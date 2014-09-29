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
            base.$sangarWrapper.parent().width(""); // reset wrapper width
            base.calculateHeightWidth(); // calculate new width & height

            // resize wrapper
            base.$sangar.height(base.sangarHeight);
            base.$sangarWrapper.parent().width(base.sangarWidth).height(base.sangarHeight);

            base.doResponsiveClass(); // apply responsive class

            // reset active slide & bullet
            base.activeSlide = 0;
            
            base.bulletObj.setActiveBullet();

            // continous & rollback reset attributes
            if(opt.continousSliding)
            {
                base.$slideWrapper.children().children().width(base.sangarWidth);
                base.$slideWrapper.children().children().height(base.sangarHeight);
                base.$slideWrapper.children().children().children('img').width(base.sangarWidth);
                
                // show before and after slide
                // if(opt.theme == 'threeDisplay')
                // {
                //     base.$slideWrapper.children().children().children('img').width(base.sangarWidth-200);
                //     base.$slideWrapper.children().children().css({
                //         'text-align': 'center',
                //         'margin-left': '-100px',
                //         'margin-right': '-100px'
                //     })
                //     base.$slideWrapper.css({
                //         // 'padding-left': '200px'
                //     })
                // }
                

                base.activeSlideContinous = 0;
                base.continous_count_position = 0;
            }
            else
            {
                base.$slides.width(base.sangarWidth);                
                base.$slides.height(base.sangarHeight);
                base.$slides.children('img').width(base.sangarWidth);

                slide_action = 0;
            }

            // animation based reset attributes
            if(opt.animation == "horizontal-slide")
            {
                if(opt.continousSliding)
                {
                    slide_action = '-' + base.sangarWidth * base.activeSlideContinous;

                    // base.$slideWrapper.css({
                    //     'width': base.sangarWidth * base.numberSlides * 3 + 'px'
                    // });
                }
                else
                {
                    base.$slideWrapper.css({
                        'width': base.sangarWidth * base.numberSlides + 'px'
                    });
                }

                // reset slide position
                if(base.css3support())
                {
                    // var properties = {};
                    // properties['-' + base.vendorPrefix + '-transform'] = 'translate3d('+ slide_action +'px, 0, 0)';
                    // properties['margin-left'] = '0px';

                    // base.$slideWrapper.css(properties);
                    base.$slideWrapper.children('.slideWrapperInside.swi1st').css('margin-left','-' + base.subSlideWidth);
                    base.$slideWrapper.children('.slideWrapperInside.swi2nd').css('margin-left',0);
                    base.$slideWrapper.children('.slideWrapperInside.swi3rd').css('margin-left',base.subSlideWidth);
                }
                else
                {
                    var properties = {};
                    properties['left'] = slide_action + 'px';
                    properties['margin-left'] = '0px';

                    base.$slideWrapper.css(properties);
                }
            }
            else if(opt.animation == "vertical-slide")
            {
                if(opt.continousSliding)
                {
                    slide_action = '-' + base.sangarHeight * base.activeSlideContinous;

                    base.$slideWrapper.css({
                        'height': base.sangarHeight * base.numberSlides * 3 + 'px'
                    });
                }
                else
                {
                    base.$slideWrapper.css({
                        'height': opt.height * base.numberSlides + 'px'
                    });
                }

                // reset slide position
                if(base.css3support())
                {
                    var properties = {};
                    properties['-' + base.vendorPrefix + '-transform'] = 'translate3d(0, '+ slide_action +'px, 0)';
                    properties['margin-top'] = '0px';

                    base.$slideWrapper.css(properties);
                }
                else
                {
                    var properties = {};
                    properties['top'] = slide_action + 'px';
                    properties['margin-top'] = '0px';

                    base.$slideWrapper.css(properties);
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