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
                    
                base.$slideWrapper.children().children().eq(base.activeSlide + 5).css(properties);


                // after active
                var properties = {};
                    properties[ '-' + base.vendorPrefix + '-transition-duration' ] = opt.animationSpeed + 'ms';
                    properties[ '-' + base.vendorPrefix + '-filter' ] = 'brightness(0.3)';
                    
                base.$slideWrapper.children().children().eq(base.activeSlide + 4).css(properties);
            }

            // alert(base.activeSlide);
        }

        /**
         * Function: afterSlideChange
         */
        base.afterSlideChange = function()
        {
            // empty function
        }
    }

})(jQuery);