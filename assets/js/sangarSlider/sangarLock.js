var sangarLock;

;(function($) {

	sangarLock = function(base, opt) {

        /**
         * Function: unlock
         */
        base.unlock = function()
        {
            base.locked = false;
        }

        /**
         * Function: lock
         */
        base.lock = function()
        {
            base.locked = true;
        }

		/**
         * Function: stopSliderLock
         */
        base.stopSliderLock = function()
        {
            if (!opt.timer || opt.timer == 'false') {
                return false;
            } else {
                base.timerRunning = false;
                clearInterval(base.clock); 
                clearTimeout(base.resumeClock);               

                base.pauseTimerAnimation();
            }
        }
        
        /**
         * Function: resetAndUnlock
         */
        base.resetAndUnlock = function()
        {
            base.unlock();
            base.afterSlideChange();

            // Fade: put prevActiveSlide to z-index 1 after end of translation
            if (opt.animation == "fade") 
            {
                base.$slides
                    .eq(base.prevActiveSlide)
                    .css({
                        "z-index": 1
                    });
            }
        }
    }

})(jQuery);