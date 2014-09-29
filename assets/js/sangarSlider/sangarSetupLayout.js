var sangarSetupLayout;

;(function($) {

    sangarSetupLayout = function(base, opt) {

        /**
         * Function: setupLayout
         */
        this.setupLayout = function()
        {
            base.calculateHeightWidth();

            if(opt.animation == "horizontal-slide")
            {
                base.$slides.css({
                    "position": "relative",
                    "float": "left",
                    "display": "block",
                    "width": base.sangarWidth + "px",
                    "height": + "100%"
                });

                if(opt.continousSliding)
                {
                    base.$slideWrapper.css({"width": base.sangarWidth * base.numberSlides * 3 + "px", "height": base.sangarHeight + "px"});
                    slideWrapperInside1st = '<div class="slideWrapperInside swi1st" style="width:'+base.sangarWidth * base.numberSlides+'px">' + base.$slideWrapper.html() + '</div>';
                    slideWrapperInside2nd = '<div class="slideWrapperInside swi2nd" style="width:'+base.sangarWidth * base.numberSlides+'px">' + base.$slideWrapper.html() + '</div>';
                    slideWrapperInside3rd = '<div class="slideWrapperInside swi3rd" style="width:'+base.sangarWidth * base.numberSlides+'px">' + base.$slideWrapper.html() + '</div>';
                    base.$slideWrapper.html(slideWrapperInside1st + slideWrapperInside2nd + slideWrapperInside3rd);
                }
                else
                {  
                    base.$slideWrapper.css({"width": base.sangarWidth * base.numberSlides + "px", "height": base.sangarHeight + "px"});
                }
            }
            else if(opt.animation == "vertical-slide")
            {
                base.$slides.css({
                    "position": "relative",
                    "display": "block",
                    "width": base.sangarWidth + "px",
                    "height": base.sangarHeight + "px"
                });

                if(opt.continousSliding)
                {
                    base.$slideWrapper.css({"width": base.sangarWidth + "px", "height": base.sangarHeight * base.numberSlides * 3 + "px"});
                    slideWrapperInside = '<div class="slideWrapperInside">' + base.$slideWrapper.html() + '</div>';
                    base.$slideWrapper.html(slideWrapperInside + slideWrapperInside + slideWrapperInside);
                }
                else
                {
                    base.$slideWrapper.css({"width": base.sangarWidth + "px", "height": base.sangarHeight * base.numberSlides + "px"});
                }
            }
            else if(opt.animation == "fade")
            {
                base.$slides.css({
                    "z-index": 1,
                    "width": base.sangarWidth + "px",
                    "height": base.sangarHeight + "px"
                });

                base.$slides.eq(base.activeSlide).css({"z-index": 3});
                base.$slideWrapper.css({"width": base.sangarWidth + "px", "height": base.sangarHeight + "px"});
            }
        }
    }

})(jQuery);