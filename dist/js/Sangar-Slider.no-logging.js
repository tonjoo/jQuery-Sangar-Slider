// Sangar Slider - 2014 Tonjoo 
var sangarBaseClass;

;(function($) {

    sangarBaseClass = function(base, opt) {

        /**
         * Function: getImgHeight
         */
        this.getImgHeight = function(width,index)
        {
            index = index % base.numberSlides; // modulus, for continousSliding

            var Twidth = base.imgWidth[index];
            var Theight = base.imgHeight[index];

            var minusResize = Twidth - width;
            var percentMinus = (minusResize / Twidth) * 100;
            var height = Theight - (Theight * percentMinus / 100);

            return height;
        }

        /**
         * Function: getImgWidth
         */
        this.getImgWidth = function(height,index)
        {
            index = index % base.numberSlides; // modulus, for continousSliding

            var Twidth = base.imgWidth[index];
            var Theight = base.imgHeight[index];

            var minusResize = Theight - height;
            var percentMinus = (minusResize / Theight) * 100;
            var width = Twidth - (Twidth * percentMinus / 100);

            return width;
        }

        /**
         * Function: calculateHeightWidth
         */
        this.calculateHeightWidth = function(widthonly)
        {
            base.sangarWidth = base.$sangar.innerWidth();

            base.subSlideWidth = base.numberSlides * base.sangarWidth;
            base.subSlideHeight = base.numberSlides * base.sangarHeight;

            var minusResize = opt.width - base.sangarWidth;
            var percentMinus = (minusResize / opt.width) * 100;
            base.sangarHeight = opt.height - (opt.height * percentMinus / 100);
        }

        /**
         * Function: setupSize
         */
        this.setupSize = function(reinit)
        {
            var maxWidth = reinit ? base.sangarWidth : opt.width;
            var height = reinit ? base.sangarHeight : opt.height;

            // width
            if(reinit && !opt.scaleSlide)
            {
                maxWidth = opt.width;
            }
            else if(opt.scaleSlide)
            {
                maxWidth = '100%';

                realWidth = base.$sangar.width();

                var minusResize = opt.width - realWidth;
                var percentMinus = (minusResize / opt.width) * 100;
                var realHeight = opt.height - (opt.height * percentMinus / 100);

                height = realHeight;
            }

            // height
            if(opt.fixedHeight) {
                height = base.sangarHeight < opt.height ? base.sangarHeight : opt.height;
            }
            else {
                height = base.sangarHeight;
            }
            
            // apply size
            base.$sangar.css({
                'height': height,
                'max-width': maxWidth
            });

            base.$sangarWrapper.parent().css({
                'height': height,
                'max-width': maxWidth
            });
        }

        /**
         * Function: setupSizeAndCalculateHeightWidth
         */
        this.setupSizeAndCalculateHeightWidth = function(reinit)
        {
            base.calculateHeightWidth(); // re-calculate new width & height   
            base.setupSize(true); // Re-initialize size, scale or not    
            base.calculateHeightWidth(); // re-calculate new width & height  
        }

        /**
         * Function: css3support
         */
        this.css3support = function()
        {
            var element = document.createElement('div'),
                props = [ 'perspectiveProperty', 'WebkitPerspective', 'MozPerspective', 'OPerspective', 'msPerspective' ];
            
            for ( var i in props ) {
                if ( typeof element.style[ props[ i ] ] !== 'undefined' ) {
                    base.vendorPrefix = props[i].replace('Perspective', '').toLowerCase();
                    return opt.jsOnly ? false : true;
                }
            }

            return false;
        }

        /**
         * Function: doLoading
         */
        this.doLoading = function()
        {
            // Do the loading animation
            base.$slideWrapper.hide()

            base.$sangar.css('background-image','');

            // Restore & change responsive class
            setTimeout(function() {
                base.$sangarWrapper.attr('class','sangar-wrapper ' + opt.skinClass);
                base.$slideWrapper
                    .css({
                        "display": "block"
                    })

                base.$sangar.css('background-image',"none");
            }, 1000);
        }

        /**
         * Function: getTranslatePosition
         */
        this.getTranslatePosition = function(htmlDom)
        {
            var computedStyle = window.getComputedStyle(htmlDom);
            var matrix = computedStyle.getPropertyValue('transform');

            return decomposeMatrix(matrix);
        }

        function deltaTransformPoint(matrix, point)  
        {
            var dx = point.x * matrix.a + point.y * matrix.c + 0;
            var dy = point.x * matrix.b + point.y * matrix.d + 0;
            return { x: dx, y: dy };
        }

        function decomposeMatrix(matrix) 
        {
            // @see https://gist.github.com/2052247

            // calculate delta transform point
            var px = deltaTransformPoint(matrix, { x: 0, y: 1 });
            var py = deltaTransformPoint(matrix, { x: 1, y: 0 });

            // calculate skew
            var skewX = ((180 / Math.PI) * Math.atan2(px.y, px.x) - 90);
            var skewY = ((180 / Math.PI) * Math.atan2(py.y, py.x));

            // regex translate x and y
            var mat = matrix.match(/^matrix3d\((.+)\)$/);
            if(mat) return parseFloat(mat[1].split(', ')[13]);
            mat = matrix.match(/^matrix\((.+)\)$/);
            var translateX = mat ? parseFloat(mat[1].split(', ')[4]) : 0;
            var translateY = mat ? parseFloat(mat[1].split(', ')[5]) : 0;

            return {
                translateX: translateX,
                translateY: translateY,
                scaleX: Math.sqrt(matrix.a * matrix.a + matrix.b * matrix.b),
                scaleY: Math.sqrt(matrix.c * matrix.c + matrix.d * matrix.d),
                skewX: skewX,
                skewY: skewY,
                rotation: skewX // rotation is the same as skew x
            };        
        }
    }

})(jQuery);
var sangarBeforeAfter;

;(function($) {

	sangarBeforeAfter = function(base, opt) {

		/**
         * Function: afterSlideChange
         */
        this.beforeSlideChange = function()
        {
            var paginationClass = opt.paginationExternalClass;

            if(paginationClass != "" && $('.' + paginationClass).length)
            {
                $("." + paginationClass).removeClass('active');
                $("." + paginationClass).eq(base.activeSlide).addClass("active");
            }
        }

        /**
         * Function: afterSlideChange
         */
        base.afterSlideChange = function()
        {
            // empty function
        }
    }

})(jQuery);
var sangarCaption;

;(function($) {

    sangarCaption = function(base, opt) {

		/**
         * Function: setCaptionPosition
         */
        this.setCaptionPosition = function()
        {
            caption = base.$slides.eq(base.activeSlide).find('div.sangar-caption');

            if(caption.length)
            {
                base.captionPosition = caption.attr('class').replace('sangar-caption ','');
            }
            else
            {
                base.captionPosition = "undefined";
            }

            //set active caption position to bullet and navigation
            base.$sangarWrapper.find('div.sangar-pagination-wrapper').addClass(base.captionPosition);
            base.$sangarWrapper.find('div.sangar-slider-nav').addClass(base.captionPosition);
        }
    }

})(jQuery);
var sangarLock;

;(function($) {

	sangarLock = function(base, opt) {

        /**
         * Function: unlock
         */
        this.unlock = function()
        {
            base.locked = false;
        }

        /**
         * Function: lock
         */
        this.lock = function()
        {
            base.locked = true;
        }

		/**
         * Function: stopSliderLock
         */
        this.stopSliderLock = function()
        {
            if (!opt.timer || opt.timer == 'false') {
                return false;
            } else {
                base.timerRunning = false;
                clearInterval(base.clock);

                base.$pause.addClass('sangar-timer-active');
            }
        }

        
        /**
         * Function: resetAndUnlock
         */
        this.resetAndUnlock = function(timeout)
        {
            if(timeout)
            {
                clearTimeout(timeout);
                timeout = setTimeout(function() {
                    base.unlock();
                    base.afterSlideChange();
                }, opt.animationSpeed - (opt.animationSpeed * 20 / 100));
            }
            else
            {
                base.unlock();
                base.afterSlideChange();
            }

            // Fade: put prevActiveSlide to z-index 1 after end of translation
            if (opt.animation == "fade") 
            {
                base.$slides
                    .eq(base.prevActiveSlide)
                    .css({
                        "z-index": 1
                    })
            }
        }
    }

})(jQuery);
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
            }
            
            // reset slide pagination
            if(opt.pagination == 'content')
            {
                base.bulletObj.generateSlideBullet();
                base.bulletObj.slideBullet('first');
                base.shift(0, true);
            }
        }
    }

})(jQuery);    
var sangarResponsiveClass;

;(function($) {

	sangarResponsiveClass = function(base, opt) {

		/**
         * Function: doResponsiveClass
         */
        this.doResponsiveClass = function()
        {
            /**
             * Resposive Class
             * - sangar-responsive-mobile-small (width <= 369)
             * - sangar-responsive-mobile-medium (width <= 499 && width <= sangarWidth)
             * - sangar-responsive-full
             */

            if(370 <= base.sangarWidth && base.sangarWidth <= 499) {
                doResponsiveClassStart('sangar-responsive-mobile-medium')
            }
            else if(369 >= base.sangarWidth ) {
                doResponsiveClassStart('sangar-responsive-mobile-small')
            }
            else {
                // Desktop Mode
                doResponsiveClassStart('sangar-responsive-full')
            }

            function doResponsiveClassStart(responsiveClass){
                // if it is the first run dont do animation
                if(base.first_run)
                {
                    base.first_run = false
                    base.$sangarWrapper.attr('class','sangar-wrapper ' + opt.skinClass)
                    base.$sangarWrapper.addClass(responsiveClass)
                    return
                }

                if(base.old_responsive_class == responsiveClass) return

                base.old_responsive_class = responsiveClass

                base.$sangarWrapper.addClass(responsiveClass)
            }
        }
    }

})(jQuery);
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
                    // base.$slideWrapper.css({"width": base.sangarWidth * base.numberSlides * 3 + "px", "height": base.sangarHeight + "px"});
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
                opt.scaleImage = false;
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
var sangarSetupNavigation;

;(function($) {

    sangarSetupNavigation = function(base, opt) {

    	/**
         * Function: setupDirectionalNav
         */
        this.setupDirectionalNav = function()
        {
            if (opt.directionalNav != 'none') 
            {
                if (opt.directionalNav == "false") {
                    return false;
                }
                
                if(opt.animation == "vertical-slide")
                {
                    var arrow_right = 'down';
                    var arrow_left = 'up';                    
                }
                else
                {
                    var arrow_right = 'right';
                    var arrow_left = 'left';                    
                }

                var directionalNavHTML = '<div class="sangar-slider-nav ' + base.captionPosition + '"><span class="sangar-arrow-' + arrow_right + '"></span><span class="sangar-arrow-' + arrow_left + '"></span></div>';
                base.$sangarWrapper.append(directionalNavHTML);
                var leftBtn = base.$sangarWrapper.children('div.sangar-slider-nav').children('span.sangar-arrow-' + arrow_left),
                    rightBtn = base.$sangarWrapper.children('div.sangar-slider-nav').children('span.sangar-arrow-' + arrow_right);
                leftBtn.click(function () {
                    base.stopSliderLock();
                    base.shift("prev", true);
                });
                rightBtn.click(function () {
                    base.stopSliderLock();
                    base.shift("next", true)
                });

                // autohide behaviour
                if(opt.directionalNav == 'autohide')
                {
                    var btn = base.$sangarWrapper.children('div.sangar-slider-nav').children('span');
                    var btnAnimateSpeed = 300;

                    btn.css("opacity", opt.directionalNavHideOpacity);

                    base.$sangarWrapper.mouseenter(function(){
                        btn.animate({
                            "opacity": opt.directionalNavShowOpacity
                        }, btnAnimateSpeed);
                    });
                    base.$sangarWrapper.mouseleave(function(){
                        btn.animate({
                            "opacity": opt.directionalNavHideOpacity
                        }, btnAnimateSpeed);
                    });
                }                
            }
        }

        /**
         * Function: setupBulletNav
         */
        this.setupBulletNav = function()
        {
            var bulletHTML = '<ul class="sangar-pagination sangar-pagination-' + opt.pagination + ' sangar-pagination-type-' + opt.paginationContentType + ' "></ul>';

            var bulletHTMLWrapper = "<div class='sangar-bullet-wrapper'></div>";
            
            base.$sangarWrapper.append(bulletHTML);
            base.$pagination = base.$sangarWrapper.children('ul.sangar-pagination');

            for (i = 0; i < base.numberSlides; i++) 
            {
                var liMarkup = jQuery('<li class="sangar-slideshow-nav-pagination"></li>');

                if (opt.pagination == 'content' && opt.paginationContentType == 'text') 
                {
                    var paginationContent = opt.paginationContent.length > 0 ? opt.paginationContent[i] : "";
                    var liMarkup = $('<li class="sangar-slideshow-nav-pagination">' + paginationContent + '</li>');
                }
                else if (opt.pagination == 'content' && opt.paginationContentType == 'image')
                {
                    var paginationContent = opt.paginationContent.length > 0 ? opt.paginationContent[i] : "";
                    var liMarkup = $('<li class="sangar-slideshow-nav-pagination"><img style="border-radius: 3px;" src="' + paginationContent + '" width="' + (opt.paginationContentWidth - 5) + '" height="' + opt.paginationImageHeight + '"></li>');      
                }

                base.$sangarWrapper.children('ul.sangar-pagination').append(liMarkup);
                liMarkup.data('index', i);
                liMarkup.click(function () {                        
                    base.stopSliderLock();
                    base.shift($(this).data('index'), true);
                });
            }
           
            base.$pagination.wrap("<div class='sangar-pagination-wrapper wrapper-" + opt.pagination + " " + base.captionPosition + "' />");                              
            base.bulletObj.setActiveBullet();
        }
    }

})(jQuery);
var sangarSetupSliderBulletNav;

;(function($) {

    sangarSetupSliderBulletNav = function(base, opt) {

        /**
         * Function: setupSliderBulletNav
         */
        this.setupSliderBulletNav = function()
        {
            var spagination = 0;
            var paginationWalkingWidth = 0;            
            var paginationMaxShowedIndex = 0;
            var paginationBackChild = 0;
            var paginationNextChild = 0;
            var paginationOffsetWidth = 0;
            var paginationPosition = 0;                        
            var paginationOffsetEnable = false;
            var paginationWidth = 0;
            var paginationMovedWidth = 0;

            var each_width = opt.paginationContentWidth;
            var total_width = each_width * base.numberSlides;
            
            /**
             * generate slide bullet 
             * this function will be recall every slideshow resized
             */
            this.generateSlideBullet = function()
            {
                spagination = base.$sangarWrapper.find('ul.sangar-pagination-content');

                paginationWalkingWidth = 0;
                paginationMaxShowedIndex = 0;
                paginationBackChild = 0;
                paginationNextChild = 0;
                paginationOffsetWidth = 0;
                paginationPosition = 0;                        
                paginationOffsetEnable = false;              
                paginationWidth = spagination.parent().outerWidth(true);

                if(paginationWidth > total_width)
                {
                    if(opt.paginationContentFullWidth)
                    {
                        each_width = paginationWidth / base.numberSlides;
                        total_width = each_width * base.numberSlides;
                    }
                    else paginationWidth = total_width;                  
                }
                                
                spagination.parent().css('overflow', 'hidden');
                spagination.css('background-color', spagination.children('li').last().css("background-color"));
                spagination.children('li.sangar-slideshow-nav-pagination').css('width',each_width + 'px');                
                spagination.css('width', total_width + 'px');

                spagination.find('li').each(function () {
                    paginationWalkingWidth += each_width;

                    if (paginationWalkingWidth + each_width > paginationWidth) 
                    {
                        paginationNextChild = $(this).index();
                        paginationMaxShowedIndex = paginationNextChild;
                    }
                    
                    if (paginationWalkingWidth > paginationWidth) 
                    {
                        $(this).addClass('sangar-bullet-sliding-next');
                        paginationOffsetWidth = paginationWalkingWidth - paginationWidth;

                        /* detect if pagination offset is too large */
                        if(paginationOffsetWidth < each_width)
                        {
                            paginationOffsetEnable = true;
                        }

                        return false;
                    }
                });
            }

            this.slideBullet = function(navigate)
            {
                if(navigate == 'next')
                {
                    if(spagination.children('li').eq(base.numberSlides - 1).hasClass("sangar-bullet-sliding-next"))
                    {
                        paginationNavPixelWidth = (each_width * paginationPosition) + paginationOffsetWidth;
                    }
                    else
                    {
                        spagination.children('li').removeClass('sangar-bullet-sliding-back').removeClass('sangar-bullet-sliding-next');

                        paginationPosition++;
                        paginationBackChild++;
                        paginationNextChild++;

                        paginationNavPixelWidth = (each_width * paginationPosition) + paginationOffsetWidth;
                    }

                    slideBulletAddClass('sliding_one','sangar-bullet-sliding-one-back',paginationBackChild + 1)            
                }
                else if(navigate == 'back')
                {
                    spagination.children('li').removeClass('sangar-bullet-sliding-back').removeClass('sangar-bullet-sliding-next');

                    paginationPosition--;
                    paginationBackChild--;
                    paginationNextChild--;

                    paginationNavPixelWidth = each_width * paginationPosition;

                    slideBulletAddClass('sliding_one','sangar-bullet-sliding-one-next',paginationNextChild - 1)
                }
                else if(navigate == 'first')
                {
                    spagination.children('li').removeClass('sangar-bullet-sliding-back').removeClass('sangar-bullet-sliding-next');

                    paginationPosition = 0;
                    paginationBackChild = 0;                    
                    paginationNextChild = paginationMaxShowedIndex;

                    paginationNavPixelWidth = each_width * paginationPosition;

                    slideBulletAddClass('sliding_one','sangar-bullet-sliding-one-next',paginationNextChild - 1)
                }
                else if(navigate == 'last')
                {
                    spagination.children('li').removeClass('sangar-bullet-sliding-back').removeClass('sangar-bullet-sliding-next');

                    var numberBulletsByIndex = base.numberSlides - 1;

                    paginationPosition = numberBulletsByIndex - paginationMaxShowedIndex;
                    paginationBackChild = numberBulletsByIndex - paginationMaxShowedIndex;
                    paginationNextChild = numberBulletsByIndex;

                    paginationNavPixelWidth = (each_width * paginationPosition) + paginationOffsetWidth;

                    slideBulletAddClass('sliding_one','sangar-bullet-sliding-one-back',paginationBackChild + 1)
                }

                /**
                 * Track moved width
                 */
                paginationMovedWidth = paginationNavPixelWidth;
                
                if(base.css3support())
                {
                    var properties = {};
                    properties[ '-' + base.vendorPrefix + '-transition-duration' ] = opt.animationSpeed + 'ms';
                    properties[ '-' + base.vendorPrefix + '-transform' ] = 'translate3d(-' + paginationNavPixelWidth + 'px, 0, 0)';

                    spagination.css(properties);
                }
                else
                {
                    spagination
                        .animate({
                            "left": '-' + paginationNavPixelWidth + 'px'
                        }, opt.animationSpeed);
                }
                
                // Apply class to bullet
                slideBulletAddClass('sliding', 'sangar-bullet-sliding-back', paginationBackChild)
                slideBulletAddClass('sliding', 'sangar-bullet-sliding-next', paginationNextChild)
            }

            function slideBulletAddClass(li_type, li_class, li_index)
            {
                if(li_type == 'sliding_one')
                {
                    if(paginationOffsetEnable == true)
                    {
                        spagination.children('li').removeClass('sangar-bullet-sliding-one-back').removeClass('sangar-bullet-sliding-one-next');
                        
                        var addClassTo = spagination.children('li').eq(li_index)

                        if(addClassTo.attr('class') == "sangar-slideshow-nav-pagination")
                        {
                            addClassTo.addClass(li_class);
                        }                        
                    }
                }  
                else if(li_type == 'sliding')
                {
                    if(spagination.children('li').eq(li_index).attr('class') == 'sangar-slideshow-nav-pagination sangar-pagination-active' && li_index > 0 )
                    {
                        if(li_class == 'sangar-bullet-sliding-back')
                        {
                            li_index--
                        }
                        else if(li_class == 'sangar-bullet-sliding-next')
                        {
                            li_index++
                        }
                    }

                    spagination.children('li').eq(li_index).removeClass('sangar-bullet-sliding-one-back')
                    spagination.children('li').eq(li_index).removeClass('sangar-bullet-sliding-one-next')
                    spagination.children('li').eq(li_index).addClass(li_class)
                }              
            }

            function slideBulletOne(type)
            {
                var oneMove = 0;

                spagination.children('li').removeClass('sangar-bullet-sliding-one-back').removeClass('sangar-bullet-sliding-one-next');

                if(type == 'back')
                {
                    spagination.children('li').eq(paginationNextChild - 1).addClass('sangar-bullet-sliding-one-next');

                    oneMove = paginationMovedWidth - paginationOffsetWidth;
                }
                else
                {
                    spagination.children('li').eq(paginationBackChild + 1).addClass('sangar-bullet-sliding-one-back');

                    oneMove = paginationMovedWidth + paginationOffsetWidth;
                }

                /**
                 * Track moved width
                 */
                paginationMovedWidth = oneMove;

                if(base.css3support())
                {
                    var properties = {};
                    properties[ '-' + base.vendorPrefix + '-transition-duration' ] = opt.animationSpeed + 'ms';
                    properties[ '-' + base.vendorPrefix + '-transform' ] = 'translate3d(-' + oneMove + 'px, 0, 0)';

                    spagination.css(properties);
                }
                else
                {
                    spagination
                        .animate({
                            "left": '-' + oneMove + 'px'
                        }, opt.animationSpeed);
                }
            }


            /**
             * SET ACTIVE BULLETS
             */
            this.setActiveBullet = function() 
            {
                base.beforeSlideChange(); // before slide function

                if (opt.pagination == 'none') {
                    return false;
                } else {
                    base.$pagination.children('li').removeClass('sangar-pagination-active').eq(base.activeSlide).addClass('sangar-pagination-active');

                    /**
                     * begin slide pagination
                     */
                    if(opt.pagination == 'content') this.beginSlideBullet();
                }
            }

            this.beginSlideBullet = function()
            {
                var activeBullet = base.$pagination.children('li.sangar-pagination-active');
                
                var positionFirst = activeBullet.index() == 0 ? true : false;
                var positionMiddle = activeBullet.index() > 0 ? true : false;
                var positionLast = activeBullet.index() == (base.numberSlides-1) ? true : false;

                if(activeBullet.hasClass('sangar-bullet-sliding-next'))
                {
                    if(positionLast) this.slideBullet('last');
                    else this.slideBullet('next');
                }
                else if(activeBullet.hasClass('sangar-bullet-sliding-back'))
                {
                    if(positionMiddle) this.slideBullet('back');
                    else this.slideBullet('first');
                }
                else if(activeBullet.hasClass('sangar-bullet-sliding-one-next'))
                {
                    slideBulletOne('next')
                }
                else if(activeBullet.hasClass('sangar-bullet-sliding-one-back'))
                {
                    slideBulletOne('back')
                }
                else
                {
                    if(paginationMaxShowedIndex > 0)
                    {
                        if(positionFirst) this.slideBullet('first');
                        else if(positionLast) this.slideBullet('last');
                    }
                }
            }
        }
    }

})(jQuery);
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

	        jQuery(function () {
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
					
					var lastestPosition = opt.animation == "horizontal-slide" ? slideWrapperPos.translateX : slideWrapperPos.translateY;
	                	lastestPosition = lastestPosition * -1;
	                
	                lastPosition = lastestPosition;
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
	                // base.resetAndUnlock();
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
                        var slide_action_pure = base.sangarWidth * base.activeSlideContinous;
                        var slide_action = slide_action_pure * -1;
	                    	                   
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
	                    	                   
	                    // define classes
	                 	var swi1st = base.$slideWrapper.children('.slideWrapperInside.swi1st');
                        var swi2nd = base.$slideWrapper.children('.slideWrapperInside.swi2nd');
                        var swi3rd = base.$slideWrapper.children('.slideWrapperInside.swi3rd');

	                    if(direction == "next" && base.activeSlide == 0)
	                    {
	                    	// disable transitions
                        	swi1st.addClass('notransition'); 

	                        // move first group to last
	                        swi1st.css('margin-top', slide_action_pure + base.subSlideHeight);

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
	                        swi3rd.css('margin-top', slide_action_pure - base.subSlideHeight - (base.subSlideHeight - base.sangarHeight));

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

	                base.setCaptionPosition();
	            }
	        }
	    }
	}

})(jQuery);
var sangarSizeAndScale;

;(function($) {

    sangarSizeAndScale = function(base, opt) {
		
        /**
         * Function: setupScaleImage
         */
        base.setupScaleImage = function(imageDom)
        {
            // origHeight
            if(opt.fixedHeight)
            {
                var origHeight = base.sangarHeight < opt.height ? base.sangarHeight : opt.height;
            }
            else
            {
                var origHeight = base.sangarHeight;
            }

            // scaleImage
            if(opt.scaleImage)
            {
                imageDom.each(function(index){
                    var width = base.sangarWidth;
                    var height = base.getImgHeight(width,index);
                    var slideHeight = $(this).parent().height();

                    var diff = origHeight - height;

					if(diff > 0) {
                        var slideDiff = origHeight - slideHeight;
                        var diff = height - slideHeight;

                        // vertical centering image and content
                        $(this).css('margin-top', '-' + (diff / 2) + 'px');
						$(this).parent().css('margin-top', (slideDiff / 2) + 'px');
					}
					else {
                        var diff = origHeight - height;

						if(opt.imageVerticalAlign == 'top') {
                            $(this).css('margin-top', '0px');
						}
						else if(opt.imageVerticalAlign == 'bottom') {
                            $(this).css('margin-top', diff + 'px');
						}
						else {
                            $(this).css('margin-top', (diff / 2) + 'px');
						}
					}

                    // width
                    $(this).width(width);
                    $(this).parent().width(width);
                })
            }
            else
            {
                var padding = 10;
                var curImgHeight = origHeight - (padding * 2);
                var curParWidth = imageDom.parent().width();
                var curParHeight = imageDom.parent().height();

                // image
                imageDom.css({
                    'border-radius': '3px'
                });

                // parent
                imageDom.parent().css({
                    'padding': padding + 'px',
                    'width': (curParWidth - padding * 2) + 'px',
                    'height': (curParHeight - padding * 2) + 'px'
                });

                // container
                var contWidth = base.sangarWidth - (padding * 2);
                var contHeight = origHeight - (padding * 2);

                // horizontal center align
                imageDom.each(function(index){
                    var width = base.getImgWidth(curImgHeight,index);
                    var diff = contWidth - width;

                    if(diff > 0)
                    {
                        $(this).css({
                            'margin-left': (diff / 2) + 'px',
                            'margin-top': '0px',
                            'height': curImgHeight + 'px'
                        });
                    }
                    else
                    {
                        var width = base.sangarWidth;
                        var height = base.getImgHeight(width,index);
                        var diff = contHeight - height;

                        $(this).css({
                            'margin-left': '0px',
                            'margin-top': (diff / 2) + 'px',
                            'height': height + 'px'
                        });
                    }
                })

                
            }
        }

	}

})(jQuery);
/**
 * Tonjoo Responsive Slideshow 2
 * Copyright 2013, Tonjoo
 * Free to use under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
 */

;(function($) {

    $.sangarSlider = function(el, opt) {

        var base = this;

        base.el = el;
        base.$el = $(base.el);

        base.activeSlide = 0;
        base.activeSlideContinous = 0;
        base.numberSlides = 0;
        base.continous_count_position = 0;
        base.sangarId = "#" + base.$el.attr("id");        

        /**
         * Load classes
         */
        sangarBaseClass.call($.sangarSlider.prototype, base, opt);
        sangarSetupLayout.call($.sangarSlider.prototype, base, opt);
        sangarSizeAndScale.call($.sangarSlider.prototype, base, opt);
        sangarShift.call($.sangarSlider.prototype, base, opt);
        sangarSetupSliderBulletNav.call($.sangarSlider.prototype, base, opt);
        sangarSetupNavigation.call($.sangarSlider.prototype, base, opt);
        sangarSetupSwipeTouch.call($.sangarSlider.prototype, base, opt);
        sangarSetupTimer.call($.sangarSlider.prototype, base, opt);
        sangarBeforeAfter.call($.sangarSlider.prototype, base, opt);
        sangarLock.call($.sangarSlider.prototype, base, opt);
        sangarResponsiveClass.call($.sangarSlider.prototype, base, opt);
        sangarResetSlider.call($.sangarSlider.prototype, base, opt);
        sangarCaption.call($.sangarSlider.prototype, base, opt);

        /**
         * Function: initiate
         */
        base.initialize = function()
        {
            base.$slideWrapper = base.$el.children('.sangar-slide-img-wrapper').addClass('sangar-slide-img-wrapper');
            base.$sangar = base.$slideWrapper.wrap('<div class="sangar-slideshow-content" />').parent();
            base.$sangarWrapper = base.$sangar.wrap('<div id="' + base.sangarId + '-slideshow" class="sangar-wrapper ' + opt.skinClass.toLowerCase() + '" />').parent();
            
            base.first_run = true;
            base.old_responsive_class = 'responsive-full';
            base.responsiveClassLock = false;

            // Lock slider before all content loaded
            base.lock(); 
            
            base.$sangar.add(base.sangarWidth)

            // Initialize slides
            base.$slides = base.$slideWrapper.children('div.sangar-slide-img');

            base.$slides.each(function (index,slide) {
                base.numberSlides++;
                base.activeSlideContinous++;

                // Initialize original image size
                var img = $(this).children('img');                
                $("<img/>")
                    .attr("src", img.attr("src"))
                    .load(function() {
                        img.attr("naturalwidth",this.naturalWidth);
                        img.attr("naturalheight",this.naturalHeight);
                    });
            });
            
            // Setup all items
            base.setupLayout();            
            base.setupTimer();
            base.setupDirectionalNav();            
            base.bulletObj = new base.setupSliderBulletNav();
            base.setupBulletNav();
            base.setCaptionPosition();
            base.setupSwipeTouch(); 

            // Initialize and show slider after all content loaded
            $(base.$slideWrapper.children()).imagesLoaded( function() {
                base.$slideWrapper.children().fadeIn(function(){
                    base.$el.css({"display": "block"});
                })
                
                base.$sangarWrapper.children('.sangar-slideshow-content').fadeIn(function(){
                    base.$el.css({"display": "block"});
                })

                base.$sangarWrapper.children('.sangar-timer').fadeIn(function(){
                    base.$el.css({"display": "block"});
                })

                base.$sangarWrapper.children('.sangar-slider-nav').fadeIn(function(){
                    base.$el.css({"display": "block"});
                })

                base.$sangarWrapper.children('.sangar-pagination-wrapper').fadeIn(function(){
                    base.$el.css({"display": "block"});
                })
            })
            .done(function(instance){
                var imgWidth = [];
                var imgHeight = [];

                base.$slides.children('img').each(function(index) {
                    imgWidth[index] = this.getAttribute("naturalwidth");
                    imgHeight[index] = this.getAttribute("naturalheight");
                });

                //unlock event in last displayed element
                base.unlock();

                // Get original image size
                base.imgWidth = imgWidth;
                base.imgHeight = imgHeight;

                base.resetSlider();
            })

            $(window).bind('resize.sangar-slideshow-container', function(event, force){                
                base.resetSlider();             
            });
        }
    }


    /**
     * Sangar Slider Plugin Initialize Element
     * - default options
     * - initiate each element
     * - initiate return method
     */  
    $.sangarSlider.defaults = {
        'animation' : 'horizontal-slide', // horizontal-slide, vertical-slide, fade
        'animationSpeed' : 600, // how fast animtions are
        'continousSliding' : true, // only works for horizontal-slide and vertical-slide                  
        'showAllSlide' : false, // show all previous and next slides
        'timer' :  false, // true or false to have the timer
        'advanceSpeed' : 3000, // if timer is enabled, time between transitions
        'pauseOnHover' : true, // if you hover pauses the slider
        'startClockOnMouseOut' : false, // if clock should start on MouseOut
        'startClockOnMouseOutAfter' : 800, // how long after MouseOut should the timer start again
        'directionalNav' : 'autohide', // autohide, show, none
        'directionalNavShowOpacity' : '0.9', // from 0 to 1
        'directionalNavHideOpacity' : '0.1', // from 0 to 1
        'directionalNavNextClass' : 'exNext', // external ( a ) next class
        'directionalNavPrevClass' : 'exPrev', // external ( a ) prev class
        'pagination' : 'bullet', // bullet, content, none        
        'paginationContent' : ["Lorem Ipsum", "Dolor Sit", "Consectetur", "Do Eiusmod", "Magna Aliqua"], // can be text, image, or something
        'paginationContentType' : 'image', // text, image
        'paginationContentWidth' : 120, // pagination content width in pixel
        'paginationImageHeight' : 90, // pagination image height
        'paginationContentFullWidth' : false, // scale width to 100% if the container larger than total width                 
        'paginationExternalClass' : 'exPagination', // if you use your own list (li) for pagination
        'skinClass' : 'sangar-skin-default', // default: sangar-skin-default
        'width' : 650, // slideshow width
        'height' : 400, // slideshow height
        'scaleSlide' : false, // slider will scale to the container size
        'scaleImage' : true, // images will scale to the slider size
        'fixedHeight' : true,  // height will fixed on scale
        'background': '#222222', // container background color, leave blank will set to transparent
        'imageVerticalAlign' : 'middle', // top, middle, bottom -- work only while scaleImage
        'jsOnly' : false // for development testing purpose
    };

    $.fn.sangarSlider = function(options) 
    {
        var base = this;
        var opt = $.extend({}, $.sangarSlider.defaults, options);
        var plugin = new $.sangarSlider(base, opt);

        base.doShift = function(value){
            plugin.stopSliderLock();
            plugin.shift(value, true);
        }

        // external pagination shift
        var paginationClass = opt.paginationExternalClass;

        if(paginationClass != "" && $('.' + paginationClass).length){
            $('.' + paginationClass).click(function(){
                base.doShift($('.' + paginationClass).index(this));
            })
        }

        // external navigation shift
        var nextClass = opt.directionalNavNextClass;
        var prevClass = opt.directionalNavPrevClass;

        if(nextClass != "" && $('.' + nextClass).length){
            $('.' + nextClass).click(function(){
                base.doShift('next');
            })
        }

        if(prevClass != "" && $('.' + prevClass).length){
            $('.' + prevClass).click(function(){
                base.doShift('prev');
            })
        }
        
        // initialize
        base.each(function(){
            plugin.initialize();
        });
        
        return base;
    };

})(jQuery);