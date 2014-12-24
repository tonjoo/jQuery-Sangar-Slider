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

            // Continous & rollback reset attributes
            if(opt.continousSliding)
            {
                // continous sliding
                base.$slideWrapper.children().children().width(base.sangarWidth);
                base.$slideWrapper.children().children().height(base.sangarHeight);
                
                base.setupScaleImage(base.$slideWrapper.children().children().children('img'));

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

                slide_action = 0;
            }

            // setupSizeAndCalculateHeightWidth after scaling
            base.setupSizeAndCalculateHeightWidth();

            // animation based reset attributes
            if(opt.animation == "horizontal-slide")
            {
                if(opt.continousSliding)
                {
                    base.$slideWrapper.children('.slideWrapperInside').css({
                        'width': base.sangarWidth * base.numberSlides + 'px'
                    });

                    base.$slideWrapper.children('.slideWrapperInside.swi1st').css('margin-left','-' + base.subSlideWidth);
                    base.$slideWrapper.children('.slideWrapperInside.swi2nd').css('margin-left',0);
                    base.$slideWrapper.children('.slideWrapperInside.swi3rd').css('margin-left',base.subSlideWidth);

                    base.$slideWrapper.css('-' + base.vendorPrefix + '-transform', '');
                    base.$slideWrapper.css('left', '0');
                }
                else
                {
                    base.$slideWrapper.css({
                        'width': base.sangarWidth * base.numberSlides + 'px'
                    });

                    base.$slideWrapper.css('-' + base.vendorPrefix + '-transform', '');
                    base.$slideWrapper.css('left', '0');
                }
            }
            else if(opt.animation == "vertical-slide")
            {
                if(opt.continousSliding)
                {
                    base.$slideWrapper.css({
                        'height': base.sangarHeight * base.numberSlides + 'px'
                    });

                    base.$slideWrapper.children('.slideWrapperInside.swi1st').css('margin-top','-' + base.subSlideHeight);
                    base.$slideWrapper.children('.slideWrapperInside.swi2nd').css('margin-top',0);
                    base.$slideWrapper.children('.slideWrapperInside.swi3rd').css('margin-top',base.subSlideHeight);

                    base.$slideWrapper.css('-' + base.vendorPrefix + '-transform', '');
                    base.$slideWrapper.css('top', '0');
                }
                else
                {
                    base.$slideWrapper.css({
                        'width': base.sangarHeight * base.numberSlides + 'px'
                    });

                    base.$slideWrapper.css('-' + base.vendorPrefix + '-transform', '');
                    base.$slideWrapper.css('top', '0');
                }
            }
            else if(opt.animation == "fade")
            {
                base.$slideWrapper.css({"width": base.sangarWidth + "px", "height": base.sangarHeight + "px"});

                base.$slides.css({
                    "z-index": 1,
                    "width": base.sangarWidth + "px",
                    "height": base.sangarHeight + "px"
                });

                base.$slides.eq(base.activeSlide).css({"z-index": 3});
            }
            
            // reset slide pagination
            if(opt.pagination == 'text' || opt.pagination == 'image')
            {
                base.bulletObj.generateSlideBullet();
                base.bulletObj.slideBullet('first');
                base.shift(0, true);
            }
        }
    }

})(jQuery);    