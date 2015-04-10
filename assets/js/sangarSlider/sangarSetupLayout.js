var sangarSetupLayout;

;(function($) {

    sangarSetupLayout = function(base, opt) {

        /**
         * Function: setupLayout
         */
        this.setupLayout = function()
        {
            // re-setup options
            setupOptions(opt);

            // general layout
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
                    slideWrapperInside1st = '<div class="slideWrapperInside swi1st">' + base.$slideWrapper.html() + '</div>';
                    slideWrapperInside2nd = '<div class="slideWrapperInside swi2nd">' + base.$slideWrapper.html() + '</div>';
                    slideWrapperInside3rd = '<div class="slideWrapperInside swi3rd">' + base.$slideWrapper.html() + '</div>';
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
                    "overflow": "hidden",
                    "width": base.sangarWidth + "px",
                    "height": base.sangarHeight + "px"
                });

                if(opt.continousSliding)
                {
                    slideWrapperInside1st = '<div class="slideWrapperInside swi1st">' + base.$slideWrapper.html() + '</div>';
                    slideWrapperInside2nd = '<div class="slideWrapperInside swi2nd">' + base.$slideWrapper.html() + '</div>';
                    slideWrapperInside3rd = '<div class="slideWrapperInside swi3rd">' + base.$slideWrapper.html() + '</div>';
                    base.$slideWrapper.html(slideWrapperInside1st + slideWrapperInside2nd + slideWrapperInside3rd);
                }
                else
                {
                    base.$slideWrapper.css({"width": base.sangarWidth + "px", "height": base.sangarHeight * base.numberSlides + "px"});
                }
            }
            else if(opt.animation == "fade")
            {
                base.$slides.css({
                    "opacity": 0,
                    "z-index": 1
                });

                base.$slides.eq(base.activeSlide).css({
                    "z-index": 3,
                    "opacity": 1
                });
                
                base.$slideWrapper.css({"width": base.sangarWidth + "px", "height": base.sangarHeight + "px"});
            }

            // set background
            base.$sangar.css('background-color', opt.background);

            // init isRunning
            base.isRunning = false;

            // set current slide
            if(opt.continousSliding)
            {
                base.$currentSlide = base.$slideWrapper.children('.slideWrapperInside.swi2nd').children().eq(0);
            }
            else
            {
                base.$currentSlide = base.$slideWrapper.children().eq(0);
            }
        }

        /**
         * Force change option value
         */
        function setupOptions(opt)
        {
            if(opt.showAllSlide)
            {
                opt.animation = 'horizontal-slide';
                opt.continousSliding = true;
                opt.continousSliding = true;
                opt.scaleSlide = false;
                // opt.scaleImage = false;
            }

            if(opt.animation == 'fade')
            {
                opt.continousSliding = false;
            }
        }

        /**
         * Function: doBlur
         */
        this.doBlur = function(parentClass,childNumber,valueBlur)
        {
            var transition = '-' + base.vendorPrefix + '-transition';

            if(!parentClass && !childNumber)
            {
                base.$slideWrapper.children().children()
                    .css({
                        'opacity': valueBlur,
                        'filter': 'alpha(opacity=' + valueBlur*100 + ')',
                        transition: 'opacity ' + opt.animationSpeed + 'ms ease-in-out'
                    });
            }
            else
            {
                base.$slideWrapper.children(parentClass).children().eq(childNumber)
                    .css({
                        'opacity': valueBlur,
                        'filter': 'alpha(opacity=' + valueBlur*100 + ')',
                        transition: 'opacity ' + opt.animationSpeed + 'ms ease-in-out'
                    });
            }
        }
    }

})(jQuery);