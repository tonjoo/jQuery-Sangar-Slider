var sangarSetupSwipeTouch;

;(function($) {

	sangarSetupSwipeTouch = function(base, opt) {

		/**
	     * Function: setupSwipeTouch
	     */
	    this.setupSwipeTouch = function()
	    {
	        var IMG_WIDTH = opt.animation == "horizontal-slide" ? base.sangarWidth : base.sangarHeight;
	        var currentImg = opt.continousSliding ? base.activeSlideContinous : base.activeSlide;
	        var maxImages = base.numberSlides;
	        var speed = opt.animationSpeed;

	        var imgs;

	        var swipeOptions = {
	            triggerOnTouchEnd: true,
	            triggerOnTouchLeave: true,
	            swipeStatus: swipeStatus,
	            allowPageScroll: "vertical",
	            threshold: 75
	        };

	        jQuery(function () {
	            imgs = opt.continousSliding ? base.$slideWrapper.children().children() : base.$slides;

	            imgs.swipe(swipeOptions);
	        });


	        /**
	         * Catch each phase of the swipe.
	         * move : we drag the div
	         * cancel : we animate back to where we were
	         * end : we animate to the next image
	         */
	        function swipeStatus(event, phase, direction, distance) 
	        {
	            if(base.locked == false)
	            {
	                // reset width and currentImg in case slideshow have been resized
	                IMG_WIDTH = opt.animation == "horizontal-slide" ? base.sangarWidth : base.sangarHeight;
	                currentImg = opt.continousSliding ? base.activeSlideContinous : base.activeSlide;

	                if (phase == "move") 
	                {
	                    var duration = 0;

	                    if(opt.animation == "horizontal-slide")
	                    {
	                        if (direction == "left") {
	                            scrollImages((IMG_WIDTH * currentImg) + distance, duration);
	                        } else if (direction == "right") {
	                            scrollImages((IMG_WIDTH * currentImg) - distance, duration);
	                        }
	                    }
	                    else if(opt.animation == "vertical-slide")
	                    {
	                        if (direction == "up") {
	                            scrollImages((IMG_WIDTH * currentImg) + distance, duration);
	                        } else if (direction == "down") {
	                            scrollImages((IMG_WIDTH * currentImg) - distance, duration);
	                        }
	                    }

	                } else if (phase == "cancel") {
	                    scrollImages(IMG_WIDTH * currentImg, speed);
	                } else if (phase == "end") {
	                    if (direction == "right" || direction == "down") {
	                        previousImage();
	                    } else if (direction == "left" || direction == "up") {
	                        nextImage();
	                    }
	                }
	            }                
	        }

	        function previousImage() {
	            if(opt.continousSliding)
	            {
	                currentImg = currentImg - 1;
	                doShiftAndSwipeScroll('prev');
	            }
	            else
	            {
	                currentImg = Math.max(currentImg - 1, 0);
	                doShiftAndSwipeScroll(currentImg);
	            }
	        }

	        function nextImage() {                
	            if(opt.continousSliding)
	            {
	                currentImg = currentImg + 1;
	                doShiftAndSwipeScroll('next');
	            }
	            else
	            {
	                currentImg = Math.min(currentImg + 1, maxImages - 1);
	                doShiftAndSwipeScroll(currentImg);
	            }
	        }

	        function doShiftAndSwipeScroll(direction)
	        {
	            base.shift(direction);
	            base.lock();

	            scrollImages(IMG_WIDTH * currentImg, speed);
	        }

	        /**
	         * Manually update the position of the imgs on drag
	         */
	        function scrollImages(distance, duration) 
	        {
	            var slide_action = (distance < 0 ? "" : "-") + Math.abs(distance).toString();
	            var transform_css3, transform_js; 

	            if(opt.animation == "horizontal-slide")
	            {
	                transform_css3 = 'translate3d('+ slide_action +'px, 0, 0)';
	                transform_js = {"left": slide_action + 'px'};
	            }
	            else if(opt.animation == "vertical-slide")
	            {
	                transform_css3 = 'translate3d(0, '+ slide_action +'px, 0)';
	                transform_js = {"top": slide_action + 'px'};
	            }


	            if(base.css3support())
	            {
	                // Get the properties to transition
	                var properties = {};
	                properties[ '-' + base.vendorPrefix + '-transition-duration' ] = duration + 'ms';
	                properties[ '-' + base.vendorPrefix + '-transform' ] = transform_css3;

	                // Do the CSS3 transition
	                base.$slideWrapper.css(properties);
	                base.resetAndUnlock(true);
	            }
	            else
	            {
	                base.$slideWrapper
	                    .animate(transform_js, duration, base.resetAndUnlock);
	            }              
	        }
	    }
	}

})(jQuery);