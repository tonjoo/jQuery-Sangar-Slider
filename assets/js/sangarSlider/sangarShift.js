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

	        // remember slideDirection to base
	        base.slideDirection = slideDirection;

	        // exit function if bullet clicked is same as the current image
	        if (base.prevActiveSlide == slideDirection) {
	            return false;
	        }

	        if (! base.locked) 
	        {
	            base.lock();
	            
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

	            // set current slide
            	base.setCurrentSlide();

	            
	            /**
	             * Horizontal Slide
	             */
	            if (opt.animation == "horizontal-slide")
	            {
	            	// vertical text pagination
					base.sangarWidth = base.verticalTextPaginationSetWidth();

	                if(opt.continousSliding)
	                {
                        var slide_action_pure = base.sangarWidth * base.activeSlideContinous;
                        var slide_action = slide_action_pure * -1;

                        // get slideWrapperWidth
                        var slideWrapper = base.$slideWrapper.children('.slideWrapperInside');
	                    var slide = slideWrapper.children('.sangar-content');
	                    var slideWrapperWidth = slide.width() * base.numberSlides;
	
	                    // define classes
	                 	var swi1st = base.$slideWrapper.children('.slideWrapperInside.swi1st');
                        var swi2nd = base.$slideWrapper.children('.slideWrapperInside.swi2nd');
                        var swi3rd = base.$slideWrapper.children('.slideWrapperInside.swi3rd');

	                    if(direction == "next" && base.activeSlide == 0)
	                    {
	                    	// disable transitions
                        	swi1st.addClass('notransition'); 

	                        // move first group to last
	                        swi1st.css('margin-left', (slide_action_pure + slideWrapperWidth) + 'px');

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
	                        swi3rd.css('margin-left', (slide_action_pure - slideWrapperWidth - (slideWrapperWidth - base.sangarWidth)) + 'px');

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
	                        properties[ '-' + base.vendorPrefix + '-transition' ] = opt.animationSpeed + 'ms cubic-bezier(0.445, 0.05, 0.55, 0.95)';
	                        properties[ '-' + base.vendorPrefix + '-transform' ] = 'translate('+ slide_action +'px, 0)';
	                        properties[ '-' + base.vendorPrefix + '-transform-style' ] = 'preserve-3d';	                        
                            properties[ '-' + base.vendorPrefix + '-backface-visibility' ] = 'hidden';	                        
                        	properties[ '-' + base.vendorPrefix + '-perspective' ] = '1000px';

	                        // Do the CSS3 transition
	                        base.$slideWrapper.css(properties);

	                        base.resetAndUnlock();
	                    }
	                    else
	                    {
	                        base.$slideWrapper
	                        .animate({
	                            "left": slide_action + 'px'
	                        }, opt.animationSpeed, base.resetAndUnlock);
	                    }


	                    // showAllSlide
			            if(opt.showAllSlide)
			            {
		                    this.doBlur('.swi2nd',base.activeSlide,1);
		                    this.doBlur('.swi2nd',base.prevActiveSlide,0.5);

		                    if(base.prevActiveSlide == 0){
		                    	this.doBlur('.swi3rd',base.prevActiveSlide,0.5);
		                    }

		                    if(base.prevActiveSlide == (base.numberSlides - 1)){
		                    	this.doBlur('.swi1st',base.prevActiveSlide,0.5);
		                    }
		                }
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
	                            properties[ '-' + base.vendorPrefix + '-transition' ] = opt.animationSpeed + 'ms cubic-bezier(0.445, 0.05, 0.55, 0.95)';
	                            properties[ '-' + base.vendorPrefix + '-transform' ] = 'translate('+ slide_action +'px, 0)';
	                            properties[ '-' + base.vendorPrefix + '-transform-style' ] = 'preserve-3d';	                        
	                            properties[ '-' + base.vendorPrefix + '-backface-visibility' ] = 'hidden';	                        
	                        	properties[ '-' + base.vendorPrefix + '-perspective' ] = '1000px';

	                            // Do the CSS3 transition
	                            base.$slideWrapper.css(properties);
	                            
	                            base.resetAndUnlock();
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
	                	var slide_action_pure = base.sangarHeight * base.activeSlideContinous;
                        var slide_action = slide_action_pure * -1;

                        // get slideWrapperHeight
                        var slideWrapper = base.$slideWrapper.children('.slideWrapperInside');
	                    var slide = slideWrapper.children('.sangar-content');
	                    var slideWrapperHeight = slide.height() * base.numberSlides;
	                    	                   
	                    // define classes
	                 	var swi1st = base.$slideWrapper.children('.slideWrapperInside.swi1st');
                        var swi2nd = base.$slideWrapper.children('.slideWrapperInside.swi2nd');
                        var swi3rd = base.$slideWrapper.children('.slideWrapperInside.swi3rd');

	                    if(direction == "next" && base.activeSlide == 0)
	                    {
	                    	// disable transitions
                        	swi1st.addClass('notransition'); 

	                        // move first group to last
	                        swi1st.css('margin-top', (slide_action_pure + slideWrapperHeight) + 'px');

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
	                        swi3rd.css('margin-top', (slide_action_pure - slideWrapperHeight - (slideWrapperHeight - base.sangarHeight)) + 'px');

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
	                        properties[ '-' + base.vendorPrefix + '-transition' ] = opt.animationSpeed + 'ms cubic-bezier(0.445, 0.05, 0.55, 0.95)';
	                        properties[ '-' + base.vendorPrefix + '-transform' ] = 'translate(0, '+ slide_action +'px)';
	                        properties[ '-' + base.vendorPrefix + '-transform-style' ] = 'preserve-3d';	                        
							properties[ '-' + base.vendorPrefix + '-backface-visibility' ] = 'hidden';	                        
							properties[ '-' + base.vendorPrefix + '-perspective' ] = '1000px';

	                        // Do the CSS3 transition
	                        base.$slideWrapper.css(properties);

	                        base.resetAndUnlock();
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
	                    var slide_action = base.sangarHeight * base.activeSlide < base.numberSlides * base.sangarHeight ? '-' + base.sangarHeight * base.activeSlide : 0 ;

	                    if(doAnimation)
	                    {
	                        if(base.css3support())
	                        {
	                            // Get the properties to transition
	                            var properties = {};
	                            properties[ '-' + base.vendorPrefix + '-transition' ] = opt.animationSpeed + 'ms cubic-bezier(0.445, 0.05, 0.55, 0.95)';
		                        properties[ '-' + base.vendorPrefix + '-transform' ] = 'translate(0, '+ slide_action +'px)';
		                        properties[ '-' + base.vendorPrefix + '-transform-style' ] = 'preserve-3d';	                        
								properties[ '-' + base.vendorPrefix + '-backface-visibility' ] = 'hidden';	                        
								properties[ '-' + base.vendorPrefix + '-perspective' ] = '1000px';

	                            // Do the CSS3 transition
	                            base.$slideWrapper.css(properties);
	                            base.resetAndUnlock();
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
	            	// hide and put prevActiveSlide to z-index 2
                    base.$slides
                        .eq(base.prevActiveSlide)
                        .css({
                            "opacity": 1,
                            "z-index": 2
                        })
                        .animate({
                            "opacity": 0
                        }, opt.animationSpeed, base.resetAndUnlock);

                    // show and put activeSlide to z-index 3
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
	        }
	    }
	}

})(jQuery);