var sangarShift;

;(function($) {

	sangarShift = function(base, opt) {

		/**
	     * Function: shift
	     */
	    this.shift = function(direction, doAnimation)
	    {
	        // remember previous activeSlide
	        base.prevActiveSlide = base.activeSlide;
	        var slideDirection = direction;

	        // exit function if bullet clicked is same as the current image
	        if (base.prevActiveSlide == slideDirection) {
	            return false;
	        }

	        if (! base.locked) 
	        {
	            base.lock();
	            //deduce the proper activeImage
	            if (direction == "next") 
	            {	                
	                base.activeSlide++;
	                base.activeSlideContinous++;
	                if (base.activeSlide == base.numberSlides) {
	                    base.activeSlide = 0;
	                }
	            } 
	            else if (direction == "prev") 
	            {
	                base.activeSlide--
	                base.activeSlideContinous--
	                if (base.activeSlide < 0) {
	                    base.activeSlide = base.numberSlides - 1;
	                }
	            } 
	            else 
	            {
	                var mod_position = base.activeSlideContinous % base.numberSlides;
	                var float_position = base.activeSlideContinous - mod_position;

	                for (var i = 0; i < direction; i++) 
	                {
	                    float_position++

	                    if(i == direction)
	                    {
	                        break;
	                    }
	                }

	                // for minus position (back)
	                if(base.activeSlideContinous < 0 && mod_position != 0)
	                {
	                    float_position = float_position - base.numberSlides;
	                }

	                base.activeSlideContinous = float_position;
	                base.activeSlide = direction;

	                if (base.prevActiveSlide < base.activeSlide) 
	                {
	                    slideDirection = "next";
	                } 
	                else if (base.prevActiveSlide > base.activeSlide) 
	                {
	                    slideDirection = "prev"
	                }
	            }

	            // set to correct bullet
	            base.bulletObj.setActiveBullet();

	            base.calculateHeightWidth();

	            
	            /**
	             * Horizontal Slide
	             */
	            if (opt.animation == "horizontal-slide") 
	            {
	                if(opt.continousSliding)
	                {
	                    // if(base.activeSlideContinous > 0)
	                    // {
	                    //     var slide_action = base.sangarWidth * base.activeSlideContinous * -1;
	                    // }
	                    // else if(base.activeSlideContinous < 0)
	                    // {
	                        var slide_action_pure = base.sangarWidth * base.activeSlideContinous;
	                        var slide_action = slide_action_pure * -1;
	                    // }
	                    // else
	                    // {
	                    //     var slide_action = 0;
	                    // }

	                    // var slide_action = base.sangarWidth * -1;


	                    // var slide_width_position = base.sangarWidth * base.activeSlideContinous - (base.subSlideWidth * base.continous_count_position);

	                    // if(slide_width_position < base.subSlideWidth)
	                    // {
	                    //     base.continous_count_position--;
	                       
	                    //     base.$slideWrapper.addClass('notransition'); // Disable transitions

	                    //     base.$slideWrapper.css('margin-left', (base.subSlideWidth * base.continous_count_position) + 'px');

	                    //     base.$slideWrapper[0].offsetHeight; // Trigger a reflow, flushing the CSS changes
	                    //     base.$slideWrapper.removeClass('notransition'); // Re-enable transitions
	                    // }
	                    // else if(slide_width_position >= base.subSlideWidth * 2)
	                    // {
	                    // 	alert('xxx');
	                    //     base.continous_count_position++;
	                       
	                    //     base.$slideWrapper.addClass('notransition'); // Disable transitions

	                    //     // base.$slideWrapper.css('margin-left', (base.subSlideWidth * base.continous_count_position) + 'px');
	                    //     var properties = {};	                        
	                    //     properties[ 'margin-left' ] = '1000px';

	                    //     base.$slideWrapper.children('.slideWrapperInside').first().css(properties)
	                    //     // console.log(base.$slideWrapper.children('.slideWrapperInside').first().html());

	                    //     base.$slideWrapper[0].offsetHeight; // Trigger a reflow, flushing the CSS changes
	                    //     base.$slideWrapper.removeClass('notransition'); // Re-enable transitions
	                    // } 

	                   
	                    // define classes
	                 	var swi1st = base.$slideWrapper.children('.slideWrapperInside.swi1st');
                        var swi2nd = base.$slideWrapper.children('.slideWrapperInside.swi2nd');
                        var swi3rd = base.$slideWrapper.children('.slideWrapperInside.swi3rd');

	                    if(direction == "next" && base.activeSlide == 0)
	                    {
	                    	// disable transitions
                        	swi1st.addClass('notransition'); 

	                        // move first group to last
	                        swi1st.css('margin-left', slide_action_pure + base.subSlideWidth);

	                        // redefined classes
	                        swi1st.removeClass('swi1st').addClass('swi3rd');
	                        swi2nd.removeClass('swi2nd').addClass('swi1st');
	                        swi3rd.removeClass('swi3rd').addClass('swi2nd');

	                        // re-enable transitions
	                        swi1st[0].offsetHeight; // Trigger a reflow, flushing the CSS changes
	                        swi1st.removeClass('notransition'); // Re-enable transitions
	                    }
	                    else if(direction == "prev" && base.activeSlide == (base.numberSlides - 1))
	                    {
	                    	// disable transitions
                        	swi3rd.addClass('notransition'); 

	                    	// move first group to last
	                        swi3rd.css('margin-left', slide_action_pure - base.subSlideWidth - (base.subSlideWidth - base.sangarWidth));

	                        // redefined classes
	                        swi1st.removeClass('swi1st').addClass('swi2nd');
	                        swi2nd.removeClass('swi2nd').addClass('swi3rd');
	                        swi3rd.removeClass('swi3rd').addClass('swi1st');

	                        // re-enable transitions
	                        swi3rd[0].offsetHeight; // Trigger a reflow, flushing the CSS changes
	                        swi3rd.removeClass('notransition'); // Re-enable transitions
	                    }

	                    



	                     // animation
	                    if(base.css3support())
	                    {
	                        var properties = {};
	                        properties[ '-' + base.vendorPrefix + '-transition-duration' ] = opt.animationSpeed + 'ms';
	                        properties[ '-' + base.vendorPrefix + '-transform' ] = 'translate3d('+ slide_action +'px, 0, 0)';

	                        // Do the CSS3 transition
	                        base.$slideWrapper.children('.slideWrapperInside').css(properties);

	                        base.resetAndUnlock(true);
	                    }
	                    else
	                    {
	                        base.$slideWrapper
	                        .animate({
	                            "left": slide_action + 'px'
	                        }, opt.animationSpeed, base.resetAndUnlock);
	                    }


	                    // if(base.activeSlideContinous > 0)
	                    // {
	                    //     var slide_action = '-' + base.sangarWidth * base.activeSlideContinous;
	                    // }
	                    // else if(base.activeSlideContinous < 0)
	                    // {
	                    //     var slide_action = base.sangarWidth * base.activeSlideContinous * -1;
	                    // }
	                    // else
	                    // {
	                    //     var slide_action = 0;
	                    // }


	                    // var slide_width_position = base.sangarWidth * base.activeSlideContinous - (base.subSlideWidth * base.continous_count_position);
	                    

	                    // if(slide_width_position < base.subSlideWidth)
	                    // {
	                    //     base.continous_count_position--;
	                       
	                    //     base.$slideWrapper.addClass('notransition'); // Disable transitions

	                    //     base.$slideWrapper.css('margin-left', (base.subSlideWidth * base.continous_count_position) + 'px');

	                    //     base.$slideWrapper[0].offsetHeight; // Trigger a reflow, flushing the CSS changes
	                    //     base.$slideWrapper.removeClass('notransition'); // Re-enable transitions
	                    // }
	                    // else if(slide_width_position >= base.subSlideWidth * 2)
	                    // {
	                    //     base.continous_count_position++;
	                       
	                    //     base.$slideWrapper.addClass('notransition'); // Disable transitions

	                    //     base.$slideWrapper.css('margin-left', (base.subSlideWidth * base.continous_count_position) + 'px');

	                    //     base.$slideWrapper[0].offsetHeight; // Trigger a reflow, flushing the CSS changes
	                    //     base.$slideWrapper.removeClass('notransition'); // Re-enable transitions
	                    // }

	                    // if(doAnimation)
	                    // {
	                    //     if(base.css3support())
	                    //     {
	                    //         var properties = {};
	                    //         properties[ '-' + base.vendorPrefix + '-transition-duration' ] = opt.animationSpeed + 'ms';
	                    //         properties[ '-' + base.vendorPrefix + '-transform' ] = 'translate3d('+ slide_action +'px, 0, 0)';

	                    //         // Do the CSS3 transition
	                    //         base.$slideWrapper.css(properties);

	                    //         base.resetAndUnlock(true);
	                    //     }
	                    //     else
	                    //     {
	                    //         base.$slideWrapper
	                    //         .animate({
	                    //             "left": slide_action + 'px'
	                    //         }, opt.animationSpeed, base.resetAndUnlock);
	                    //     } 
	                    // }
	                    // else
	                    // {
	                    //     base.resetAndUnlock();
	                    // }
	                }
	                else
	                {
	                    var slide_action = base.sangarWidth * base.activeSlide < base.numberSlides * base.sangarWidth ? '-' + base.sangarWidth * base.activeSlide : 0 ;

	                    if(doAnimation)
	                    {
	                        if(base.css3support())
	                        {
	                            // Get the properties to transition
	                            var properties = {};
	                            properties[ '-' + base.vendorPrefix + '-transition-duration' ] = opt.animationSpeed + 'ms';
	                            properties[ '-' + base.vendorPrefix + '-transform' ] = 'translate3d('+ slide_action +'px, 0, 0)';

	                            // Do the CSS3 transition
	                            base.$slideWrapper.css(properties);
	                            
	                            base.resetAndUnlock(true);
	                        }
	                        else
	                        {
	                            base.$slideWrapper
	                                .animate({
	                                    "left": slide_action + 'px'
	                                }, opt.animationSpeed, base.resetAndUnlock);
	                        }
	                    }
	                    else
	                    {
	                        base.resetAndUnlock();
	                    }
	                }
	            }

	            /**
	             * Vertical Slide
	             */
	            if (opt.animation == "vertical-slide") 
	            {
	                if(opt.continousSliding)
	                {
	                    if(base.activeSlideContinous > 0)
	                    {
	                        var slide_action = '-' + base.sangarHeight * base.activeSlideContinous;
	                    }
	                    else if(base.activeSlideContinous < 0)
	                    {
	                        var slide_action = base.sangarHeight * base.activeSlideContinous * -1;
	                    }
	                    else
	                    {
	                        var slide_action = 0;
	                    }


	                    var slide_width_position = base.sangarHeight * base.activeSlideContinous - (base.subSlideHeight * base.continous_count_position);
	                    

	                    if(slide_width_position < base.subSlideHeight)
	                    {
	                        base.continous_count_position--;
	                       
	                        base.$slideWrapper.addClass('notransition'); // Disable transitions

	                        base.$slideWrapper.css('margin-top', (base.subSlideHeight * base.continous_count_position) + 'px');

	                        base.$slideWrapper[0].offsetHeight; // Trigger a reflow, flushing the CSS changes
	                        base.$slideWrapper.removeClass('notransition'); // Re-enable transitions
	                    }
	                    else if(slide_width_position >= base.subSlideHeight * 2)
	                    {
	                        base.continous_count_position++;
	                       
	                        base.$slideWrapper.addClass('notransition'); // Disable transitions

	                        base.$slideWrapper.css('margin-top', (base.subSlideHeight * base.continous_count_position) + 'px');

	                        base.$slideWrapper[0].offsetHeight; // Trigger a reflow, flushing the CSS changes
	                        base.$slideWrapper.removeClass('notransition'); // Re-enable transitions
	                    }

	                    if(doAnimation)
	                    {
	                        if(base.css3support())
	                        {
	                            var properties = {};
	                            properties[ '-' + base.vendorPrefix + '-transition-duration' ] = opt.animationSpeed + 'ms';
	                            properties[ '-' + base.vendorPrefix + '-transform' ] = 'translate3d(0, '+ slide_action +'px, 0)';

	                            // Do the CSS3 transition
	                            base.$slideWrapper.css(properties);

	                            base.resetAndUnlock(true);
	                        }
	                        else
	                        {
	                            base.$slideWrapper
	                            .animate({
	                                "top": slide_action + 'px'
	                            }, opt.animationSpeed, base.resetAndUnlock);
	                        }
	                    }
	                    else
	                    {
	                        base.resetAndUnlock();
	                    }
	                }
	                else
	                {
	                    var slide_action = base.sangarHeight * base.activeSlide < base.numberSlides * base.sangarHeight ? '-' + base.sangarHeight * base.activeSlide : 0 ;

	                    if(doAnimation)
	                    {
	                        if(base.css3support())
	                        {
	                            // Get the properties to transition
	                            var properties = {};
	                            properties[ '-' + base.vendorPrefix + '-transition-duration' ] = opt.animationSpeed + 'ms';
	                            properties[ '-' + base.vendorPrefix + '-transform' ] = 'translate3d(0, '+ slide_action +'px, 0)';

	                            // Do the CSS3 transition
	                            base.$slideWrapper.css(properties);
	                            base.resetAndUnlock(true);
	                        }
	                        else
	                        {
	                            base.$slideWrapper
	                                .animate({
	                                    "top": slide_action + 'px'
	                                }, opt.animationSpeed, base.resetAndUnlock);
	                        }
	                    }
	                    else
	                    {
	                        base.resetAndUnlock();
	                    }
	                }
	                
	            }

	            /**
	             * Fade
	             */
	            if (opt.animation == "fade") 
	            {
	                if(base.css3support())
	                {
	                    base.$slides.eq(base.activeSlide).css({'z-index': 2});                            

	                    // Get the properties to transition
	                    var properties = {};
	                    properties[ 'opacity' ] = 0;
	                    properties[ '-' + base.vendorPrefix + '-transition' ] = 'all ' + opt.animationSpeed + 'ms ease';

	                    base.$slides.eq(base.prevActiveSlide).css(properties);

	                    clearTimeout(timeout);
	                    timeout = setTimeout(function() {
	                        base.$slides.eq(base.activeSlide).css({'z-index': 3});

	                        // Get the properties to transition
	                        var properties = {};
	                        properties[ 'opacity' ] = 1;
	                        properties[ 'z-index' ] = 1;
	                        properties[ '-' + base.vendorPrefix + '-transition' ] = '';
	                        
	                        base.$slides.eq(base.prevActiveSlide).css(properties);
	                        base.resetAndUnlock();
	                    }, opt.animationSpeed - (opt.animationSpeed * 20 / 100));
	                }
	                else
	                {
	                    base.$slides
	                        .eq(base.activeSlide)
	                        .css({
	                            "opacity": 0,
	                            "z-index": 3
	                        })
	                        .animate({
	                            "opacity": 1
	                        }, opt.animationSpeed, base.resetAndUnlock);
	                }

	                base.setCaptionPosition();
	            }
	        }
	    }
	}

})(jQuery);