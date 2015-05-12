var sangarBeforeAfter;

;(function($) {

	sangarBeforeAfter = function(base, opt) {

        /**
         * Function: onInit
         */
        this.onInit = function()
        {
            opt.onInit();
        }


        /**
         * Function: beforeLoading
         */
        this.beforeLoading = function()
        {
            opt.beforeLoading();
        }


        /**
         * Function: afterLoading
         */
        this.afterLoading = function()
        {
            opt.afterLoading();            
        }


        /**
         * Function: onReset
         */
        this.onReset = function()
        {
            base.playVideo(); // play video on first slide if exist
            base.setOutsideTextbox(); // set outside textbox if it defined
            base.setTimerWidth(); // reset timer width
            base.setBulletPosition() // reset bullet position
            base.setActiveExternalPagination() // set class active to external pagination
        }

		/**
         * Function: afterSlideChange
         */
        this.beforeSlideChange = function()
        {
            opt.beforeChange(base.activeSlide);
        }
        
        /**
         * Function: afterSlideChange
         */
        base.afterSlideChange = function()
        {
            opt.afterChange(base.activeSlide);
            
            base.playVideo(); // play current video if exist                        
            base.setOutsideTextbox(); // set outside textbox if it defined
            base.setActiveExternalPagination() // set class active to external pagination
        }
    }

})(jQuery);