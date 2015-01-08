var sangarLock;

;(function($) {

	sangarLock = function(base, opt) {

        /**
         * Function: unlock
         */
        this.unlock = function()
        {
            base.locked = false;
        }

        /**
         * Function: lock
         */
        this.lock = function()
        {
            base.locked = true;
        }

		/**
         * Function: stopSliderLock
         */
        this.stopSliderLock = function()
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
        this.resetAndUnlock = function(timeout)
        {
            if(timeout)
            {
                clearTimeout(timeout);
                timeout = setTimeout(function() {
                    base.unlock();
                    base.afterSlideChange();
                }, opt.animationSpeed - (opt.animationSpeed * 20 / 100));
            }
            else
            {
                base.unlock();
                base.afterSlideChange();
            }

            // Fade: put prevActiveSlide to z-index 1 after end of translation
            if (opt.animation == "fade") 
            {
                base.$slides
                    .eq(base.prevActiveSlide)
                    .css({
                        "z-index": 1
                    })
            }
        }
    }

})(jQuery);