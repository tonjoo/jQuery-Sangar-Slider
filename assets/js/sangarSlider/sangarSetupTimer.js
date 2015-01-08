var sangarSetupTimer;

;(function($) {

	sangarSetupTimer = function(base, opt) {

		/**
         * Function: setupTimer
         */
        this.setupTimer = function()
        {
            var timerHTML = '<div class="sangar-timer"><div class="sangar-timer-mask"></div></div>';
                
            base.$sangarWrapper.append(timerHTML);
        }

        this.startTimer = function()
        {
            //Timer Execution
            function startClock() 
            {
                if (!opt.timer || opt.timer == 'false') 
                {
                    return false;
                } 
                else 
                {
                    base.pauseTimerAnimation(true);
                    base.doTimerAnimation();

                    base.clock = setInterval(function(e)
                    {
                        base.shift("next", true);                

                        base.pauseTimerAnimation(true);
                        base.doTimerAnimation();

                    }, opt.advanceSpeed);
                }
            }

            function resumeClock()
            {
                var diffTime = getPausedInterval();

                base.pauseTimerAnimation();
                base.doTimerAnimation(diffTime);

                base.resumeClock = setTimeout(function()
                {
                    base.shift("next", true);                

                    startClock();

                }, diffTime);
            }

            function getPausedInterval()
            {
                var timer = base.$sangarWrapper.children('div.sangar-timer');
                var currentWidth = timer.children('div.sangar-timer-mask').width();
                var wrapperWidth = base.$sangarWrapper.width();

                var percentDiff = (currentWidth / wrapperWidth) * 100;

                var diffTime = opt.advanceSpeed - (opt.advanceSpeed * percentDiff) / 100;

                return diffTime;
            }

            // Timer Setup
            if (opt.timer) {
                var timer = base.$sangarWrapper.children('div.sangar-timer');

                if (timer.length != 0) 
                {
                    startClock();

                    if (opt.startClockOnMouseOut) {
                        var outTimer;
                        base.$sangarWrapper.mouseleave(function () {

                            outTimer = setTimeout(function () {
                                if (!base.timerRunning) {
                                    resumeClock();
                                }
                            }, opt.startClockOnMouseOutAfter)
                        })
                        base.$sangarWrapper.mouseenter(function () {
                            clearTimeout(outTimer);
                        })
                    }
                }

                // Pause Timer on hover
                if (opt.pauseOnHover) {
                    base.$sangarWrapper.mouseenter(function () {
                        base.stopSliderLock();
                    });
                }
            }            
        }

        /**
         * Function: doTimerAnimation
         */
        this.doTimerAnimation = function(timeSpeed)
        {
            timeSpeed = timeSpeed ? timeSpeed : opt.advanceSpeed;

            if(base.css3support())
            {    
                enableTransition();
                doAnimate(timeSpeed);
            }

            /**
             * functions
             */
            function enableTransition()
            {
                var timer = base.$sangarWrapper.children('div.sangar-timer');

                timer.children('div.sangar-timer-mask')[0].offsetHeight; // Trigger a reflow, flushing the CSS changes
                timer.children('div.sangar-timer-mask').removeClass('notransition'); // Re-enable transitions
            }

            function doAnimate(timeSpeed)
            {
                var timer = base.$sangarWrapper.children('div.sangar-timer');

                timer.children('div.sangar-timer-mask')
                     .css({
                        'width': '100%',
                        'transition': 'width ' + timeSpeed + 'ms linear'
                     });
            }
        }

        /**
         * Function: pauseTimerAnimation
         */
        this.pauseTimerAnimation = function(reset)
        {
            var timer = base.$sangarWrapper.children('div.sangar-timer');
            var currentWidth = timer.children('div.sangar-timer-mask').width();

            if(reset) currentWidth = 0;

            if(base.css3support())
            {
                timer.children('div.sangar-timer-mask')
                     .addClass('notransition')
                     .css({
                        'width': currentWidth + 'px'
                     });
            }
        }

        /**
         * Function: setTimerWidth
         */
        this.setTimerWidth = function()
        {
            var timer = base.$sangarWrapper.children('div.sangar-timer');

            // showAllSlide
            if(opt.showAllSlide)
            {
                var wrapperWidth = base.$sangarWrapper.width();

                timer.width(wrapperWidth);
            }
            else
            {
                timer.width(base.sangarWidth);
            }
        }
	}

})(jQuery);