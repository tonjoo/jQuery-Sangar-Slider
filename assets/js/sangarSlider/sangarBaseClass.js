var sangarBaseClass;

;(function($) {

    sangarBaseClass = function(base, opt) {
        
        /**
         * Function: initFirstRun
         */
        base.initFirstRun = function()
        {
            base.isFirstRun = true;
            base.delayFirstRun = 1000;
            
            base.css3support();
            
            var properties = {};
            properties[ '-' + base.vendorPrefix + '-transition-property' ] = 'all';
            properties[ '-' + base.vendorPrefix + '-transition' ] = base.delayFirstRun + 'ms cubic-bezier(0, 1, 0.5, 1)';
            properties[ 'height' ] = opt.height;
            
            base.$el.css(properties);
            
            // display loading
            base.$sangarWrapper.css({
                'height': opt.height
            });
            
            base.setLoading(base.$sangarWrapper,'show');
        }
        
        
        /**
         * Function: runSlideshow
         */
        base.runSlideshow = function()
        {
            base.setupSizeAndCalculateHeightWidth(); // first - initialize
            base.setupSizeAndCalculateHeightWidth(); // second - finishing

            setTimeout(function() {
                base.unlock();
                base.resetSlider();
            }, base.delayFirstRun);
        }


        /**
         * Function: getImgHeight
         */
        base.getImgHeight = function(width,index,totalLength)
        {
            if(opt.continousSliding)
            {
                index = index % (totalLength / 3); // modulus, for continousSliding
            }

            var Twidth = base.imgWidth[index];
            var Theight = base.imgHeight[index];

            var minusResize = Twidth - width;
            var percentMinus = (minusResize / Twidth) * 100;
            var height = Theight - (Theight * percentMinus / 100);
                height = Math.round(height);

            return height
        }


        /**
         * Function: getImgWidth
         */
        base.getImgWidth = function(height,index,totalLength)
        {
            if(opt.continousSliding)
            {
                index = index % (totalLength / 3); // modulus, for continousSliding
            }

            var Twidth = base.imgWidth[index];
            var Theight = base.imgHeight[index];

            var minusResize = Theight - height;
            var percentMinus = (minusResize / Theight) * 100;
            var width = Twidth - (Twidth * percentMinus / 100);
                width = Math.round(width);

            return width;
        }


        /**
         * Function: calculateHeightWidth
         */
        base.calculateHeightWidth = function(widthonly)
        {
            // sangarWidth
            base.sangarWidth = base.$el.innerWidth();

            var minusResize = opt.width - base.sangarWidth;
            var percentMinus = (minusResize / opt.width) * 100;

            // sangarHeight
            base.sangarHeight = opt.height - (opt.height * percentMinus / 100);

            // max and min height
            if(base.sangarHeight <= opt.minHeight) {
                base.sangarHeight = opt.minHeight;
            }
            else if(base.sangarHeight >= opt.maxHeight && opt.maxHeight > 0) {
                base.sangarHeight = opt.maxHeight;
            }

            // force slideshow height to browser height
            if(opt.fullHeight)
            {
                var windowHeight = $(window).height();
                var position = base.$el.position();
                var fullHeight = windowHeight - position.top;

                base.sangarHeight = fullHeight;
            }

            // force size, override the calculated size with defined size
            if(opt.forceSize) {
                base.sangarWidth = opt.width;
                base.sangarHeight = opt.height;
            }

            // round
            base.sangarWidth = Math.round(base.sangarWidth);
            base.sangarHeight = Math.round(base.sangarHeight);
        }


        /**
         * Function: setupSize
         */
        base.setupSize = function(reinit)
        {
            var height = reinit ? base.sangarHeight : opt.height;
            var maxWidth = opt.fullWidth ? '100%' : opt.width;    
            var containerHeight = height;


            // percent or pixel
            if(maxWidth != '100%')
            {
                maxWidth = Math.round(maxWidth);
                maxWidth = maxWidth + 'px';
            }

            containerHeight = Math.round(containerHeight);
            height = Math.round(height);
     
            // apply size
            base.$el.css({
                'height': containerHeight + 'px',
                'max-width': maxWidth
            });

            base.$sangarWrapper.css({
                'height': containerHeight + 'px',
                'width': base.sangarWidth + 'px'
            });

            base.$sangar.css({
                'height': height + 'px',
                'max-width': maxWidth
            });
        }


        /**
         * Function: setupSizeAndCalculateHeightWidth
         */
        base.setupSizeAndCalculateHeightWidth = function(reinit)
        {
            base.calculateHeightWidth(); // re-calculate new width & height   
            base.setupSize(true); // Re-initialize size, scale or not    
            base.calculateHeightWidth(); // re-calculate new width & height  

            setupDimensionAfterCalculating()

            function setupDimensionAfterCalculating()
            {
                base.originalSangarWidth = base.sangarWidth;

                // vertical pagination
                if(opt.pagination == 'content-vertical') {
                    base.sangarWidth = base.sangarWidth - opt.paginationContentWidth;
                }

                // carousel
                if(opt.carousel) {
                    base.sangarWidth = base.sangarWidth * opt.carouselWidth / 100;
                }
            }
        }


        /**
         * Function: css3support
         */
        base.css3support = function()
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
        base.doLoading = function()
        {
            base.$el.show(); // show the slideshow            
            showLoading(); // show loading
            clearTimeout(base.loadingTimer); // prevent flickering (hide loading)

            // hide loading
            base.loadingTimer = setTimeout(function() {
                hideLoading();
            }, 300);
            
            function hideLoading()
            {
                // show loading
                base.setLoading(base.$sangarWrapper,'fadeOut');
                base.$slideWrapper
                    .css({
                        "display": "block"
                    });                    
                base.$sangar.css({
                    'background-image': "none",
                    'z-index': '0'
                });
            }

            function showLoading()
            {
                base.setLoading(base.$sangarWrapper,'show');
                base.$slideWrapper.hide();
                base.$sangar.css({
                    'background-image': '',
                    'z-index': '99'
                });
            }
        }


        /**
         * Function: setLoading
         */
        base.setLoading = function(el,status)
        {
            var loading,
                loadingHTML = '<div class="sangar-slider-loading"><div><span id="span_1"></span><span id="span_2"></span><span id="span_3"></span></div></div>',
                loadingStyle = {
                    'display': 'block',
                    'position': 'absolute',
                    'width': '100%',
                    'height': '100%',
                    'background': opt.background,
                    'z-index': '99',
                    'top': '0px',
                    'left': '0px'
                },
                isLoaded = el.children('.sangar-slider-loading').length,
                fadeTime = 400;

            switch(status) 
            {
                case 'show':
                    if(! isLoaded) el.append(loadingHTML);                    
                    loading = el.children('.sangar-slider-loading');                    
                    
                    if(loading.css('display') != 'block')
                    {
                        base.beforeLoading(); // do before loading
                        if(! opt.disableLoading)
                            loading.css(loadingStyle);
                    }
                    break;

                case 'fadeOut':
                    if(isLoaded) {
                        base.afterLoading(); // do after loading
                        loading = el.children('.sangar-slider-loading');
                        loading.fadeOut(fadeTime,function(){
                            setTimeout(function() {
                                loading.remove();
                            }, fadeTime);
                        });
                    }
                    break;

                default: // silent
            }            
        }


        /**
         * Function setCurrentSlide
         */
        base.setCurrentSlide = function(reset)
        {
            base.isRunning = true;
            var eachSlide;

            // prev slide
            if(base.$currentSlide) base.$prevSlide = base.$currentSlide;
            
            // current slide
            if(opt.continousSliding)
            {
                var groupClass = '.swi2nd';

                if(base.slideDirection == 'next' && base.activeSlide == 0)
                {
                    groupClass = '.swi3rd';
                }
                else if(base.slideDirection == "prev" && base.activeSlide == (base.numberSlides - 1))
                {
                    groupClass = '.swi1st';
                }

                // if reset
                if(reset)
                {
                    groupClass = '.swi2nd';

                    // unset prev slide if it same as first slide
                    if(base.$prevSlide && base.$prevSlide.parent().hasClass('swi2nd') && base.$prevSlide.attr('index') == 0) 
                    {
                        base.$prevSlide = false;
                    }
                }

                eachSlide = base.$slideWrapper.children('.slideWrapperInside').children();
                base.$currentSlide = base.$slideWrapper.children('.slideWrapperInside' + groupClass).children().eq(base.activeSlide);
            }
            else
            {
                // unset prev slide if it same as first slide
                if(reset && base.$prevSlide && base.$prevSlide.attr('index') == 0) 
                {
                    base.$prevSlide = false;
                }

                eachSlide = base.$slideWrapper.children();
                base.$currentSlide = base.$slideWrapper.children().eq(base.activeSlide);
            }

            // set active class
            eachSlide.removeClass('active-slide');
            base.$currentSlide.addClass('active-slide');
        }


        /**
         * Function: setActiveExternalPagination
         */
        base.setActiveExternalPagination = function()
        {            
            var paginationClass = opt.paginationExternalClass;

            if(paginationClass != "" && $('.' + paginationClass).length)
            {
                $("." + paginationClass).removeClass('active');
                $("." + paginationClass).eq(base.activeSlide).addClass("active");
            }
        }


        /**
         * Function: randomString
         */
        base.randomString = function(number)
        {
            var text = "";
            var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

            if(typeof number == 'undefined') number = 10;

            for( var i=0; i < number; i++ )
                text += possible.charAt(Math.floor(Math.random() * possible.length));

            return text;
        }


        /**
         * Function: getTranslatePosition
         */
        base.getTranslatePosition = function(htmlDom)
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