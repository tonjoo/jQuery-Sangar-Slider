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

                base.$pause.addClass('sangar-timer-active');
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
        }
    }

})(jQuery);