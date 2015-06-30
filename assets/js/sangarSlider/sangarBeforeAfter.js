var sangarBeforeAfter;

;(function($) {

	sangarBeforeAfter = function(base, opt) {

        /**
         * Function: onInit
         */
        base.onInit = function()
        {
            opt.onInit();
        }


        /**
         * Function: onReset
         */
        base.onReset = function()
        {
            base.setupSizeAndCalculateHeightWidth(); // setup size after scaling
            base.setCurrentSlide(true); // reset current slide
            base.setupCarousel() // if opt.carousel is true
            base.initOutsideTextboxDimension(); // set outside container dimension
            base.playVideo(); // play video on first slide if exist
            base.setTimerWidth(); // reset timer width
            base.setBulletPosition() // reset bullet position
            base.setOutsideTextbox(); // set outside textbox if it defined
            base.resizeEmContent(); // resize text box font and padding size
            base.setActiveExternalPagination() // set class active to external pagination

            opt.onReset(base.sangarWidth,base.sangarHeight);
        }


        /**
         * Function: beforeLoading
         */
        base.beforeLoading = function()
        {
            opt.beforeLoading();
        }


        /**
         * Function: afterLoading
         */
        base.afterLoading = function()
        {
            base.animateContent(true); // animate content if contentAnimation is true
            base.startTimer();

            opt.afterLoading();

            // carousel blur effect
            if(opt.carousel)
            {
                base.doBlur(base.$sangarWrapper.find('.sangar-content'),0.3);
            }
        }


		/**
         * Function: beforeSlideChange
         */
        base.beforeSlideChange = function()
        {
            opt.beforeChange(base.activeSlide);
        }
        

        /**
         * Function: afterSlideChange
         */
        base.afterSlideChange = function()
        {
            base.playVideo(); // play current video if exist                        
            base.setOutsideTextbox(); // set outside textbox if it defined
            base.setActiveExternalPagination(); // set class active to external pagination
            base.animateContent(); // animate content if contentAnimation is true

            opt.afterChange(base.activeSlide);
        }
    }

})(jQuery);