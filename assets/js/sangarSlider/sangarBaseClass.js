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
            if(opt.fixedHeight)
            {
                height = opt.height;
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
        this.doLoading = function()
        {
            // Do the loading animation
            base.$slideWrapper.hide()

            // Restore & change responsive class
            setTimeout(function() {
                base.$sangarWrapper.attr('class','sangar-wrapper ' + opt.skinClass);
                base.$slideWrapper.css('display','block');
            }, 1000);
        }
    }

})(jQuery);