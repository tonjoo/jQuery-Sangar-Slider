var sangarBaseClass;

;(function($) {

    sangarBaseClass = function(base, opt) {

        /**
         * Function: calculateHeightWidth
         */
        this.calculateHeightWidth = function()
        {
            base.sangarWidth = base.$sangar.innerWidth();

            base.subSlideWidth = base.numberSlides * base.sangarWidth;
            base.subSlideHeight = base.numberSlides * base.sangarHeight;

            var minusResize = opt.width - base.sangarWidth;
            var percentMinus = (minusResize / opt.width) * 100;
            base.sangarHeight = opt.height - (opt.height * percentMinus / 100);
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