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