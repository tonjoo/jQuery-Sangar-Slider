var sangarBaseClass;

;(function($) {

    sangarBaseClass = function(base, opt) {

        /**
         * Function: getImgHeight
         */
        this.getImgHeight = function(width,index)
        {
            index = index % base.numberSlides; // modulus, for continousSliding

            var Twidth = base.imgWidth[index];
            var Theight = base.imgHeight[index];

            var minusResize = Twidth - width;
            var percentMinus = (minusResize / Twidth) * 100;
            var height = Theight - (Theight * percentMinus / 100);

            return height;
        }

        /**
         * Function: getImgWidth
         */
        this.getImgWidth = function(height,index)
        {
            index = index % base.numberSlides; // modulus, for continousSliding

            var Twidth = base.imgWidth[index];
            var Theight = base.imgHeight[index];

            var minusResize = Theight - height;
            var percentMinus = (minusResize / Theight) * 100;
            var width = Twidth - (Twidth * percentMinus / 100);

            return width;
        }

        /**
         * Function: calculateHeightWidth
         */
        this.calculateHeightWidth = function(widthonly)
        {
            base.sangarWidth = base.$sangar.innerWidth();

            base.subSlideWidth = base.numberSlides * base.sangarWidth;
            base.subSlideHeight = base.numberSlides * base.sangarHeight;

            var minusResize = opt.width - base.sangarWidth;
            var percentMinus = (minusResize / opt.width) * 100;
            base.sangarHeight = opt.height - (opt.height * percentMinus / 100);
        }

        /**
         * Function: setupSize
         */
        this.setupSize = function(reinit)
        {
            var maxWidth = reinit ? base.sangarWidth : opt.width;
            var height = reinit ? base.sangarHeight : opt.height;

            // width
            if(reinit && !opt.scaleSlide)
            {
                maxWidth = opt.width;
            }
            else if(opt.scaleSlide)
            {
                maxWidth = '100%';

                realWidth = base.$sangar.width();

                var minusResize = opt.width - realWidth;
                var percentMinus = (minusResize / opt.width) * 100;
                var realHeight = opt.height - (opt.height * percentMinus / 100);

                height = realHeight;
            }

            // height
            if(opt.fixedHeight) {
                height = base.sangarHeight < opt.height ? base.sangarHeight : opt.height;
            }
            else {
                height = base.sangarHeight;
            }
            
            // apply size
            base.$sangar.css({
                'height': height,
                'max-width': maxWidth
            });

            base.$sangarWrapper.parent().css({
                'height': height,
                'max-width': maxWidth
            });
        }

        /**
         * Function: setupSizeAndCalculateHeightWidth
         */
        this.setupSizeAndCalculateHeightWidth = function(reinit)
        {
            base.calculateHeightWidth(); // re-calculate new width & height   
            base.setupSize(true); // Re-initialize size, scale or not    
            base.calculateHeightWidth(); // re-calculate new width & height  
        }

        /**
         * Function: css3support
         */
        this.css3support = function()
        {
            var element = document.createElement('div'),
                props = [ 'perspectiveProperty', 'WebkitPerspective', 'MozPerspective', 'OPerspective', 'msPerspective' ];
            
            for ( var i in props ) {
                if ( typeof element.style[ props[ i ] ] !== 'undefined' ) {
                    base.vendorPrefix = props[i].replace('Perspective', '').toLowerCase();
                    return opt.jsOnly ? false : true;
                }
            }

            return false;
        }

        /**
         * Function: doLoading
         */
        this.doLoading = function(forceLoading)
        {
            if(forceLoading)
            {
                // origHeight
                if(opt.fixedHeight)
                {
                    var origHeight = base.sangarHeight < opt.height ? base.sangarHeight : opt.height;
                }
                else
                {
                    var origHeight = base.sangarHeight;
                }
            
                showAllElements()

                // set height include pagination, after that hide the pagination
                base.$sangar.height(origHeight + base.$pagination.outerHeight(true));
                base.$pagination.hide();

                showLoading();
            }
            else
            {
                if(base.firstRun)
                {
                    hideLoading();
                    base.firstRun = false;

                    // show pagination
                    base.$pagination.show();

                    // Start timer
                    setTimeout(function()
                    {
                        base.startTimer();
                    }, 1000);
                }
                else
                {
                    showLoading()

                    setTimeout(function() {
                        hideLoading();
                    }, 1000);
                }
            }            

            /**
             * Functions
             */
            function hideLoading()
            {
                base.$slideWrapper
                    .css({
                        "display": "block"
                    })

                base.$sangar.css('background-image',"none");
            }

            function showLoading()
            {
                base.$slideWrapper.hide();
                base.$sangar.css('background-image','');
            }

            function showAllElements()
            {
                base.$slideWrapper.children().fadeIn(function(){
                    base.$el.css({"display": "block"});
                })
                
                base.$sangarWrapper.children('.sangar-slideshow-content').fadeIn(function(){
                    base.$el.css({"display": "block"});
                })

                base.$sangarWrapper.children('.sangar-timer').fadeIn(function(){
                    base.$el.css({"display": "block"});
                })

                base.$sangarWrapper.children('.sangar-slider-nav').fadeIn(function(){
                    base.$el.css({"display": "block"});
                })

                base.$sangarWrapper.children('.sangar-pagination-wrapper').fadeIn(function(){
                    base.$el.css({"display": "block"});
                })

                base.$pagination.show();
            }
        }

        /**
         * Function: getTranslatePosition
         */
        this.getTranslatePosition = function(htmlDom)
        {
            var computedStyle = window.getComputedStyle(htmlDom);
            var matrix = computedStyle.getPropertyValue('transform');

            return decomposeMatrix(matrix);
        }

        function deltaTransformPoint(matrix, point)  
        {
            var dx = point.x * matrix.a + point.y * matrix.c + 0;
            var dy = point.x * matrix.b + point.y * matrix.d + 0;
            return { x: dx, y: dy };
        }

        function decomposeMatrix(matrix) 
        {
            // @see https://gist.github.com/2052247

            // calculate delta transform point
            var px = deltaTransformPoint(matrix, { x: 0, y: 1 });
            var py = deltaTransformPoint(matrix, { x: 1, y: 0 });

            // calculate skew
            var skewX = ((180 / Math.PI) * Math.atan2(px.y, px.x) - 90);
            var skewY = ((180 / Math.PI) * Math.atan2(py.y, py.x));

            // regex translate x and y
            var mat = matrix.match(/^matrix3d\((.+)\)$/);
            if(mat) return parseFloat(mat[1].split(', ')[13]);
            mat = matrix.match(/^matrix\((.+)\)$/);
            var translateX = mat ? parseFloat(mat[1].split(', ')[4]) : 0;
            var translateY = mat ? parseFloat(mat[1].split(', ')[5]) : 0;

            return {
                translateX: translateX,
                translateY: translateY,
                scaleX: Math.sqrt(matrix.a * matrix.a + matrix.b * matrix.b),
                scaleY: Math.sqrt(matrix.c * matrix.c + matrix.d * matrix.d),
                skewX: skewX,
                skewY: skewY,
                rotation: skewX // rotation is the same as skew x
            };        
        }
    }

})(jQuery);