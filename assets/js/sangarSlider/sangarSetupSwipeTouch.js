var sangarSetupSwipeTouch;

;(function($) {

	sangarSetupSwipeTouch = function(base, opt) {

		/**
	     * Function: setupSwipeTouch
	     */
	    base.setupSwipeTouch = function()
	    {
	        var IMG_WIDTH = opt.animation == "horizontal-slide" ? base.sangarWidth : base.sangarHeight;
	        var currentImg = opt.continousSliding ? base.activeSlideContinous : base.activeSlide;
	        var maxImages = base.numberSlides;
	        var speed = opt.animationSpeed;
			var lastPosition = 0;
	        var imgs;

	        var swipeOptions = {
	            triggerOnTouchEnd: true,
	            triggerOnTouchLeave: true,
	            swipeStatus: swipeStatus,
	            allowPageScroll: "vertical",
	            threshold: 300,
	            excludedElements: "label, button, input, select, textarea, .noSwipe", // enable link (a)
	            
	            tap:function(event, target) {		          	
		          	var href = $(target).attr('href');
		          	var hrefTarget = $(target).attr('target');

		          	if(href && href != "")
		          	{
		          		// link (a) can go if on tap mode
		          		if(hrefTarget && hrefTarget == "_blank") {
			          		window.open(href,'_blank');
			          	}
			          	else {
			          		window.location.href = href;
			          	}
		          	}		          	

		          	return false;
		        }
	        };

	        $(function () {
	            imgs = opt.continousSliding ? base.$slideWrapper.children().children() : base.$slides;

	            // prevent link (a) to go
	            imgs.children('a').click(function(){	            	
	            	return false;
	            })

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
        	    // reset width and currentImg in case slideshow have been resized
                IMG_WIDTH = opt.animation == "horizontal-slide" ? base.sangarWidth : base.sangarHeight;
                currentImg = opt.continousSliding ? base.activeSlideContinous : base.activeSlide;
				
                var curImgPosition = IMG_WIDTH * currentImg;

				if (phase == "start")
				{
					var slideWrapperPos = base.getTranslatePosition(base.$slideWrapper[0]);
					
					if(base.css3support())
	            	{
						var lastestPosition = opt.animation == "horizontal-slide" ? slideWrapperPos.translateX : slideWrapperPos.translateY;
					}
					else
					{
						var lastestPosition = opt.animation == "horizontal-slide" ? base.$slideWrapper.css('left') : base.$slideWrapper.css('top');
							lastestPosition = lastestPosition.slice(0,-2);
					}	                
	                
	                lastPosition = parseInt(lastestPosition) * -1;
				}
				else if (phase == "move") 
                {
                    var duration = 0;

                    if(opt.animation == "horizontal-slide")
                    {
	                    if (direction == "left") 
	                    {
	                    	var pos = lastPosition < curImgPosition ? lastPosition : curImgPosition;

                            scrollImages(pos + distance, duration);
                        } 
                        else if (direction == "right") 
                        {
                        	var pos = lastPosition > curImgPosition ? lastPosition : curImgPosition;

                            scrollImages(pos - distance, duration);
                        }
                    }
                    else if(opt.animation == "vertical-slide")
                    {
	                    if (direction == "up") 
	                    {
	                    	var pos = lastPosition < curImgPosition ? lastPosition : curImgPosition;

                            scrollImages(pos + distance, duration);
                        }
                        else if (direction == "down") 
                        {
                        	var pos = lastPosition > curImgPosition ? lastPosition : curImgPosition;

                            scrollImages(pos - distance, duration);
                        }
                    }
                }
                else if (phase == "cancel") 
                {
                    scrollImages(IMG_WIDTH * currentImg, speed);
                } 
                else if (phase == "end") 
                {
                    if (direction == "right" || direction == "down") 
                    {
                        previousImage();
                    } 
                    else if (direction == "left" || direction == "up") 
                    {
                        nextImage();
                    }

                    lastestPosition = base.$slideWrapper.position();
                    lastestPosition = lastestPosition['left'] * -1;
                }	                          
	        }

	        function previousImage() {
	            if(opt.continousSliding)
	            {
	                currentImg = currentImg - 1;
	                doShiftAndSwipeScroll('prev','prev');
	            }
	            else
	            {
	                currentImg = Math.max(currentImg - 1, 0);
	                doShiftAndSwipeScroll(currentImg,'prev');
	            }
	        }

	        function nextImage() {                
	            if(opt.continousSliding)
	            {
	                currentImg = currentImg + 1;
	                doShiftAndSwipeScroll('next','next');
	            }
	            else
	            {
	                currentImg = Math.min(currentImg + 1, maxImages - 1);
	                doShiftAndSwipeScroll(currentImg,'next');
	            }
	        }

	        function doShiftAndSwipeScroll(direction,arrow)
	        {
	        	if(! opt.continousSliding && base.activeSlide == (base.numberSlides-1) && arrow == 'next')
	        	{
	        		var slideAction = IMG_WIDTH * (base.numberSlides-1) * -1;
	        			        		
	        		scrollBackImages(slideAction);
	        	}
	        	else if(! opt.continousSliding && base.activeSlide == 0 && arrow == 'prev')
	        	{
	        		scrollBackImages(0);
	        	}
	        	else
	        	{
	        		base.shift(direction);
	        	}
	        }

	        function scrollBackImages(slideAction)
	        {
	        	var duration = 500;

	        	// horizontal or vertical
        		if(opt.animation == "horizontal-slide")
	            {
	                transform_css3 = 'translate3d('+ slideAction +'px, 0, 0)';
	                transform_js = {"left": slideAction + 'px'};
	            }
	            else if(opt.animation == "vertical-slide")
	            {
	                transform_css3 = 'translate3d(0, '+ slideAction +'px, 0)';
	                transform_js = {"top": slideAction + 'px'};
	            }

            	if(base.css3support())
	            {
	                // Get the properties to transition
	                var properties = {};
	                properties[ '-' + base.vendorPrefix + '-transition-duration' ] = duration + 'ms';
	                properties[ '-' + base.vendorPrefix + '-transform' ] = transform_css3;

	                // Do the CSS3 transition
	                base.$slideWrapper.css(properties);
	            }
	            else
	            {
	                base.$slideWrapper
	                    .animate(transform_js, duration);
	            }
	        }	        

	        /**
	         * Manually update the position of the imgs on drag
	         */
	        function scrollImages(distance, duration) 
	        {
	            var slideAction = (distance < 0 ? "" : "-") + Math.abs(distance).toString();
	            var transform_css3, transform_js; 

	            if(opt.animation == "horizontal-slide")
	            {
	                transform_css3 = 'translate3d('+ slideAction +'px, 0, 0)';
	                transform_js = {"left": slideAction + 'px'};
	            }
	            else if(opt.animation == "vertical-slide")
	            {
	                transform_css3 = 'translate3d(0, '+ slideAction +'px, 0)';
	                transform_js = {"top": slideAction + 'px'};
	            }


	            if(base.css3support())
	            {
	                // Get the properties to transition
	                var properties = {};
	                properties[ '-' + base.vendorPrefix + '-transition-duration' ] = duration + 'ms';
	                properties[ '-' + base.vendorPrefix + '-transform' ] = transform_css3;

	                // Do the CSS3 transition
	                base.$slideWrapper.css(properties);
	            }
	            else
	            {
	                base.$slideWrapper.animate(transform_js, duration);
	            }
	        }
	    }
	}

})(jQuery);