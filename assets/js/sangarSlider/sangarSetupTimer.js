var sangarSetupTimer;

;(function($) {

	sangarSetupTimer = function(base, opt) {

		/**
         * Function: setupTimer
         */
        this.setupTimer = function()
        {
            date = new Date();
            milliseconds = date.getTime();
            startSeconds = milliseconds / 1000;

            function log_time() {
                date = new Date();
                milliseconds = date.getTime();
                seconds = milliseconds / 1000;
                seconds = seconds - startSeconds;         
            }

            //Timer Execution
            function startClock() {
                if (!opt.timer || opt.timer == 'false') {
                    return false;
                                
                /**
                 * Because in startup timer is always hidden
                 * use this if you want to change the behaviour
                 *
                 * } else if (timer.is(':hidden')) {
                 *       base.timerRunning = true;
                 *       base.clock = setInterval(function (e) {
                 *
                 *           shift("next");
                 *
                 *      }, opt.advanceSpeed);
                 *
                 */

                } else {
                    base.timerRunning = true;
                    base.$pause.removeClass('sangar-timer-active');
                    base.clock = setInterval(function (e) {
                
                        base.shift("next", true);
                
                    }, opt.advanceSpeed);
                }
                
                //
                // HEAVY ANIMATION
                //
                // } else {
                //     base.timerRunning = true;
                //     base.$pause.removeClass('sangar-timer-active');
                //     base.clock = setInterval(function (e) {

                //         var degreeCSS = "rotate(" + degrees + "deg)"
                //         rotator.css('-' + base.vendorPrefix + '-transform', degreeCSS);
                //         degrees += 1
                //         if (degrees >= 180) {

                //             mask.addClass('sangar-timer-move')
                //             rotator.addClass('sangar-timer-move')
                //             mask_turn.css("display", "block")

                //         }
                //         if (degrees >= 360) {

                //             degrees = 0;
                //             mask.removeClass('sangar-timer-move')
                //             rotator.removeClass('sangar-timer-move')
                //             mask_turn.css("display", "none")

                //             base.shift("next", true);
                //         }
                //     }, opt.advanceSpeed / 360);
                // }
            }

            // Timer Setup
            if (opt.timer) {
                var timerHTML = '<div class="sangar-timer"><span class="sangar-timer-mask"><span class="sangar-timer-rotator"></span></span><span class="sangar-timer-mask-turn"></span><span class="sangar-timer-pause"></span></div>';
                
                base.$sangarWrapper.append(timerHTML);

                var timer = base.$sangarWrapper.children('div.sangar-timer');

                if (timer.length != 0) {
                    var rotator = $(base.sangarId + ' div.sangar-timer span.sangar-timer-rotator'),
                        mask = $(base.sangarId + ' div.sangar-timer span.sangar-timer-mask'),
                        mask_turn = $(base.sangarId + ' div.sangar-timer span.sangar-timer-mask-turn'),
                        degrees = 0;

                    base.$pause = $(base.sangarId + ' div.sangar-timer span.sangar-timer-pause')

                    startClock();
                    timer.click(function () {
                        if (!base.timerRunning) {
                            startClock();
                        } else {
                            base.stopSliderLock();
                        }
                    });
                    if (opt.startClockOnMouseOut) {
                        var outTimer;
                        base.$sangarWrapper.mouseleave(function () {

                            outTimer = setTimeout(function () {
                                if (!base.timerRunning) {
                                    startClock();
                                }
                            }, opt.startClockOnMouseOutAfter)
                        })
                        base.$sangarWrapper.mouseenter(function () {
                            clearTimeout(outTimer);
                        })
                    }
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

})(jQuery);