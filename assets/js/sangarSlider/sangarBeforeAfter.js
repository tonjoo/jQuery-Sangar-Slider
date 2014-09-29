var sangarBeforeAfter;

;(function($) {

	sangarBeforeAfter = function(base, opt) {

		/**
         * Function: afterSlideChange
         */
        this.beforeSlideChange = function()
        {
            var paginationClass = opt.paginationExternalClass;

            if(paginationClass != "" && $('.' + paginationClass).length)
            {
                $("." + paginationClass).removeClass('active');
                $("." + paginationClass).eq(base.activeSlide).addClass("active");
            }

            // set slides brightness
            if(base.css3support())
            {
                // active
                var properties = {};
                    properties[ '-' + base.vendorPrefix + '-transition-duration' ] = opt.animationSpeed + 'ms';
                    properties[ '-' + base.vendorPrefix + '-filter' ] = 'brightness(1)';
                
                if(base.countSlide > 0 && base.activeSlide == 0)
                {
                    base.$slideWrapper.children('.slideWrapperInside.swi3rd').children().eq(base.activeSlide).css(properties);
                }
                else
                {
                    base.$slideWrapper.children('.slideWrapperInside.swi2nd').children().eq(base.activeSlide).css(properties);
                }

                // after active
                var properties = {};
                    properties[ '-' + base.vendorPrefix + '-transition-duration' ] = opt.animationSpeed + 'ms';
                    properties[ '-' + base.vendorPrefix + '-filter' ] = 'brightness(0.3)';
                    
                base.$slideWrapper.children('.slideWrapperInside.swi2nd').children().eq(base.prevActiveSlide).css(properties);
            }

            // alert(base.activeSlide);
        }

        /**
         * Function: afterSlideChange
         */
        base.afterSlideChange = function()
        {
            base.countSlide++;
        }
    }

})(jQuery);