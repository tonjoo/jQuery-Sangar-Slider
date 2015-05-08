var sangarResetSlider;

;(function($) {

	sangarResetSlider = function(base, opt) {

		/**
         * Function: resetSlider
         */
        this.resetSlider = function()
        {
            var slide_action;
            base.doLoading(); // do loading

            // setupSizeAndCalculateHeightWidth before scaling
            base.setupSizeAndCalculateHeightWidth();

            base.doResponsiveClass(); // apply responsive class
            base.activeSlide = 0; // reset active slide
            base.countSlide = 0; // reset active slide            
            base.bulletObj.setActiveBullet(); // reset active bullets     
            base.setNavPosition() // reset navigation position after resize

            // Continous & rollback reset attributes
            if(opt.continousSliding)
            {
                // continous sliding
                base.$slideWrapper.children().children().width(base.sangarWidth);
                base.$slideWrapper.children().children().height(base.sangarHeight);
                
                base.setupScaleImage(base.$slideWrapper.children().children().children('img'));
                base.setupScaleIframe(base.$slideWrapper.children().children().children('iframe'));

                base.activeSlideContinous = 0;
                base.continous_count_position = 0;
                base.activeGroup = 2;
            }
            else
            {
                // non continous sliding
                base.$slides.width(base.sangarWidth);                
                base.$slides.height(base.sangarHeight);
                
                base.setupScaleImage(base.$slides.children('img'));
                base.setupScaleIframe(base.$slides.children('iframe'));

                slide_action = 0;
            }

            // reset current slide
            base.setCurrentSlide(true);

            // setupSizeAndCalculateHeightWidth after scaling
            base.setupSizeAndCalculateHeightWidth();

            // animation based reset attributes
            if(opt.animation == "horizontal-slide")
            {
                if(opt.continousSliding)
                {
                    var slideWrapper = base.$slideWrapper.children('.slideWrapperInside');
                    var slide = slideWrapper.children('.sangar-content');
                    var slideWrapperWidth = slide.width() * base.numberSlides;

                    slideWrapper.css({
                        'width': slideWrapperWidth + 'px'
                    });

                    base.$slideWrapper.children('.slideWrapperInside.swi1st').css('margin-left','-' + slideWrapperWidth + 'px');
                    base.$slideWrapper.children('.slideWrapperInside.swi2nd').css('margin-left','0px');
                    base.$slideWrapper.children('.slideWrapperInside.swi3rd').css('margin-left',slideWrapperWidth + 'px');

                    base.$slideWrapper.css('-' + base.vendorPrefix + '-transform', '');
                    base.$slideWrapper.css('left', '0px');
                }
                else
                {
                    var slideWrapper = base.$slideWrapper;
                    var slide = slideWrapper.children('.sangar-content');
                    var slideWrapperWidth = slide.width() * base.numberSlides;

                    slideWrapper.css({
                        'width': slideWrapperWidth + 'px'
                    });

                    base.$slideWrapper.css('-' + base.vendorPrefix + '-transform', '');
                    base.$slideWrapper.css('left', '0px');
                }
            }
            else if(opt.animation == "vertical-slide")
            {
                if(opt.continousSliding)
                {
                    var slideWrapper = base.$slideWrapper.children('.slideWrapperInside');
                    var slide = slideWrapper.children('.sangar-content');
                    var slideWrapperHeight = slide.height() * base.numberSlides;

                    slideWrapper.css({
                        'height': slideWrapperHeight + 'px'
                    });

                    base.$slideWrapper.children('.slideWrapperInside.swi1st').css('margin-top','-' + slideWrapperHeight + 'px');
                    base.$slideWrapper.children('.slideWrapperInside.swi2nd').css('margin-top','0px');
                    base.$slideWrapper.children('.slideWrapperInside.swi3rd').css('margin-top',slideWrapperHeight + 'px');

                    base.$slideWrapper.css('-' + base.vendorPrefix + '-transform', '');
                    base.$slideWrapper.css('top', '0px');
                }
                else
                {
                    var slideWrapper = base.$slideWrapper;
                    var slide = slideWrapper.children('.sangar-content');
                    var slideWrapperHeight = slide.height() * base.numberSlides;

                    slideWrapper.css({
                        'height': slideWrapperHeight + 'px'
                    });

                    base.$slideWrapper.css('-' + base.vendorPrefix + '-transform', '');
                    base.$slideWrapper.css('top', '0px');
                }
            }
            else if(opt.animation == "fade")
            {
                base.$slideWrapper.css({"width": base.sangarWidth + "px", "height": base.sangarHeight + "px"});

                base.$slides.css({
                    "z-index": 1
                });

                base.$slides.eq(base.activeSlide).css({"z-index": 3});
            }

            // showAllSlide
            if(opt.showAllSlide)
            {
                base.$sangar.css('overflow','visible');
                base.$sangarWrapper
                    .css('background-color', opt.background)
                    .parent()
                    .css({'max-width': '100%', 'width': '100%'});

                // doBlur
                this.doBlur(false,false,0.5);
                this.doBlur('.swi2nd',0,1);

                // showAllSlideNav
                base.showAllSlideNav();
            }
            
            // reset slide pagination
            if(opt.pagination == 'content-horizontal' || opt.pagination == 'content-vertical')
            {
                base.bulletObj.generateSlideBullet();
                base.bulletObj.slideBullet('first');
                base.shift(0, true);
            }
        
            base.playVideo(); // play video on first slide if exist
            base.setOutsideTextbox(); // set outside textbox if it defined
            base.setTimerWidth(); // reset timer width
        }
    }

})(jQuery);    