var sangarBeforeAfter;

;(function($) {

	sangarBeforeAfter = function(base, opt) {

		/**
         * Function: afterSlideChange
         */
        this.beforeSlideChange = function()
        {
            // set active pagination
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
            base.playVideo(); // play current video if exist                        
            base.setOutsideTextbox(); // set outside textbox if it defined
        }
    }

})(jQuery);