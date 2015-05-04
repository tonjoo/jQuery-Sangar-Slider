var sangarResponsiveClass;

;(function($) {

	sangarResponsiveClass = function(base, opt) {

		/**
         * Function: doResponsiveClass
         */
        this.doResponsiveClass = function()
        {
            /**
             * Resposive Class
             * - sangar-responsive-mobile-small (width <= 369)
             * - sangar-responsive-mobile-medium (width <= 499 && width <= sangarWidth)
             * - sangar-responsive-full
             */

            if(370 <= base.sangarWidth && base.sangarWidth <= 499) {
                doResponsiveClassStart('sangar-responsive-mobile-medium')
            }
            else if(369 >= base.sangarWidth ) {
                doResponsiveClassStart('sangar-responsive-mobile-small')
            }
            else {
                // Desktop Mode
                doResponsiveClassStart('sangar-responsive-full')
            }

            function doResponsiveClassStart(responsiveClass){
                // if it is the first run dont do animation
                if(base.firstRun)
                {
                    base.firstRun = false
                    base.$sangarWrapper.attr('class','sangar-wrapper ' + opt.themeClass)
                    base.$sangarWrapper.addClass(responsiveClass)
                    return
                }

                if(base.old_responsive_class == responsiveClass) return

                base.old_responsive_class = responsiveClass

                base.$sangarWrapper.addClass(responsiveClass)
            }
        }
    }

})(jQuery);