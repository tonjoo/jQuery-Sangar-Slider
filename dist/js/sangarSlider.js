/**
 * Sangar Slider
 * Copyright 2014, Tonjoo
 * Sangar slider is available under dual license : GPLv2 and Tonjoo License
 * http://www.gnu.org/licenses/gpl-2.0.html
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
        sangarSetupBulletNav.call($.sangarSlider.prototype, base, opt);
        sangarSetupNavigation.call($.sangarSlider.prototype, base, opt);
        sangarSetupSwipeTouch.call($.sangarSlider.prototype, base, opt);
        sangarSetupTimer.call($.sangarSlider.prototype, base, opt);
        sangarBeforeAfter.call($.sangarSlider.prototype, base, opt);
        sangarLock.call($.sangarSlider.prototype, base, opt);
        sangarResponsiveClass.call($.sangarSlider.prototype, base, opt);
        sangarResetSlider.call($.sangarSlider.prototype, base, opt);
        sangarTextbox.call($.sangarSlider.prototype, base, opt);

        /**
         * Function: initiate
         */
        base.initialize = function()
        {            
            base.onInit(); // Run functions on slide init

            base.$slideWrapper = base.$el.children('.sangar-content-wrapper').addClass('sangar-content-wrapper');
            base.$sangar = base.$slideWrapper.wrap('<div class="sangar-slideshow-content" />').parent();
            base.$sangarWrapper = base.$sangar.wrap('<div id="' + base.sangarId + '-slideshow" class="sangar-wrapper ' + opt.themeClass.toLowerCase() + '" />').parent();
            
            base.firstRun = true;
            base.old_responsive_class = 'responsive-full';
            base.responsiveClassLock = false;

            // Lock slider before all content loaded
            base.lock(); 
            
            base.$sangar.add(base.sangarWidth)

            // Initialize slides
            base.$slides = base.$slideWrapper.children('div.sangar-content');

            base.$slides.each(function (index,slide) {
                var index = base.numberSlides;
                
                base.numberSlides++;
                base.activeSlideContinous++;

                // indexing each slide
                $(this).attr('index',index);

                // Initialize original image size
                var img = $(this).children('img');                
                $("<img/>")
                    .attr("src", img.attr("src"))
                    .load(function() {
                        img.attr("imgWidth",this.width);
                        img.attr("imgHeight",this.height);
                    });
            });
            
            // Setup all items
            base.initOutsideTextbox();
            base.setupLayout();
            base.setupTimer();
            base.setupDirectionalNav();
            base.setupBulletNav();
            base.bulletObj = new base.setupSliderBulletNav();
            base.setupSwipeTouch();            

            // do first force loading
            base.doLoading(true);

            // Initialize and show slider after all content loaded
            $(base.$slideWrapper.children()).imagesLoaded( function() {
                var imgWidth = [];
                var imgHeight = [];
                
                base.$slides.children('img').each(function(index) {
                    imgWidth[index] = this.getAttribute("imgWidth");
                    imgHeight[index] = this.getAttribute("imgHeight");
                });

                //unlock event in last displayed element
                base.unlock();

                // Get original image size
                base.imgWidth = imgWidth;
                base.imgHeight = imgHeight;

                // First reset slider, mean initialize slider
                base.resetSlider();
            });

            $(window).bind('resizeEnd', function(event, force){                
                base.resetSlider();
            });

            // event resizeEnd
            $(window).resize(function() {
                if(base.resizeTO) clearTimeout(base.resizeTO);
                base.resizeTO = setTimeout(function() {
                    $(this).trigger('resizeEnd');
                }, 350);
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
        animation : 'horizontal-slide', // horizontal-slide, vertical-slide, fade
        animationSpeed : 700, // how fast animtions are
        continousSliding : true, // only works for horizontal-slide and vertical-slide                  
        showAllSlide : false, // show all previous and next slides
        timer :  false, // true or false to have the timer
        advanceSpeed : 6000, // if timer is enabled, time between transitions
        pauseOnHover : true, // if you hover pauses the slider
        startClockOnMouseOut : true, // if clock should start on MouseOut
        startClockOnMouseOutAfter : 800, // how long after MouseOut should the timer start again
        directionalNav : 'autohide', // autohide, show, none
        directionalNavShowOpacity : 0.9, // from 0 to 1
        directionalNavHideOpacity : 0.1, // from 0 to 1
        directionalNavNextClass : 'exNext', // external ( a ) next class
        directionalNavPrevClass : 'exPrev', // external ( a ) prev class
        pagination : 'bullet', // bullet, content-horizontal, content-vertical, none
        paginationBulletNumber : false, // if true, bullet pagination will contain a slide number
        paginationContent : ["Lorem Ipsum", "Dolor Sit", "Consectetur", "Do Eiusmod", "Magna Aliqua"], // can be text, image, or something
        paginationContentType : 'text', // text, image
        paginationContentWidth : 120, // pagination content width in pixel
        paginationImageHeight : 90, // pagination image height
        paginationImageAttr : ["", "", "", "", ""], // optional attribute for each image pagination
        paginationContentFullWidth : false, // scale width to 100% if the container larger than total width                 
        paginationExternalClass : 'exPagination', // if you use your own list (li) for pagination
        html5VideoNextOnEnded : false, // force go to next slide if HTML5 video is ended, if false, do looping
        textboxOutside : false, // put the textbox to bottom outside
        themeClass : 'default', // default theme
        width : 850, // slideshow width
        height : 500, // slideshow height
        scaleSlide : false, // slider will scale to the container size
        scaleImage : true, // images will scale to the slider size
        fixedHeight : false,  // height will fixed on scale
        background: '#222222', // container background color, leave blank will set to transparent
        imageVerticalAlign : 'middle', // top, middle, bottom -- work only while scaleImage
        disableLoading : false, // disable loading animation
        forceSize: false, // not responsive mode
        autoResizeContainer: false, // set the slider containers min-width and min-height
        animateContent : false, // animate content after slide
        jsOnly : false, // for development testing purpose
        onInit : function(){ /* run function on init */ },
        onReset : function(width,height){ /* run function on init */ },
        beforeLoading : function(){ /* run function before loading */ },
        afterLoading : function(){ /* run function after loading */ },
        beforeChange : function(activeSlide){ /* run function before slide change */ },
        afterChange : function(activeSlide){ /* run function after slide change */ }
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

/* Sangar Slider Class */
var sangarBaseClass;

;(function($) {

    sangarBaseClass = function(base, opt) {

        /**
         * Function: getImgHeight
         */
        base.getImgHeight = function(width,index,totalLength)
        {
            if(opt.continousSliding)
            {
                index = index % (totalLength / 3); // modulus, for continousSliding
            }

            var Twidth = base.imgWidth[index];
            var Theight = base.imgHeight[index];

            var minusResize = Twidth - width;
            var percentMinus = (minusResize / Twidth) * 100;
            var height = Theight - (Theight * percentMinus / 100);
                height = Math.round(height);

            return height
        }

        /**
         * Function: getImgWidth
         */
        base.getImgWidth = function(height,index,totalLength)
        {
            if(opt.continousSliding)
            {
                index = index % (totalLength / 3); // modulus, for continousSliding
            }

            var Twidth = base.imgWidth[index];
            var Theight = base.imgHeight[index];

            var minusResize = Theight - height;
            var percentMinus = (minusResize / Theight) * 100;
            var width = Twidth - (Twidth * percentMinus / 100);
                width = Math.round(width);

            return width;
        }

        /**
         * Function: setupShowAllSlide
         */
        base.setupShowAllSlide = function()
        {
            if(! opt.showAllSlide) return;
            
            base.$sangar.css('overflow','visible');
            base.$sangarWrapper
                .css('background-color', opt.background)
                .parent();

            // apply full width
            base.$el.css({
                'width': '100%',
                'max-width': '100%'
            });
            base.$sangarWrapper.css({
                'width': '100%'
            });

            // doBlur
            base.doBlur(false,false,0.5);
            base.doBlur('.swi2nd',0,1);

            // showAllSlideNav
            base.showAllSlideNav();
        }

        /**
         * Function: playVideo
         */
        base.playVideo = function()
        {
            var video = base.$currentSlide.children('video');

            if(video[0])
            {
                base.setVideoCentered(video);
                video[0].load();
                video[0].currentTime = 0.1;

                if(! base.$prevSlide) //if first slide
                {
                    video[0].play();
                }
                else
                {
                    setTimeout(function() {
                        video[0].play();
                    }, opt.animationSpeed);
                }

                if(opt.html5VideoNextOnEnded)
                {
                    video[0].onended = function(e) {
                        base.shift('next');
                    };
                }
                else
                {
                    video.attr('loop','loop');
                }
            }

            // pause prev video 
            if(base.$prevSlide)
            {
                base.pauseVideo(base.$prevSlide);
            }
        }

        /**
         * Function: pauseVideo
         */
        base.pauseVideo = function(slide)
        {            
            // html 5 video
            var video = slide.children('video');

            if(video[0])
            {
                setTimeout(function() {
                    video[0].pause();
                }, opt.animationSpeed);
            }

            // vimeo and youtube
            var iframe = slide.children('iframe');

            if(iframe[0])
            {
                setTimeout(function() {
                    var src = iframe.attr('src');

                    iframe.attr('src','');
                    iframe.attr('src',src);            
                }, opt.animationSpeed);
            }            
        }

        /**
         * Function: setVideoCentered
         */
        base.setVideoCentered = function(currentSlide)
        {
            var domVideo = currentSlide[0];
            var attr = currentSlide.attr('centered');

            if (typeof attr === typeof undefined || attr === false) 
            {
                // show loading
                base.setLoading(base.$currentSlide,'show');

                domVideo.onloadedmetadata = function() {
                    var vidWidth = this.videoWidth;
                    var vidHeight = this.videoHeight;

                    var minusResize = base.sangarWidth - vidWidth;
                    var percentMinus = (minusResize / vidWidth) * 100;
                    var realHeight = vidHeight + (vidHeight * percentMinus / 100);
                        realHeight = Math.round(realHeight);

                    var margin = (realHeight - base.origHeight) / 2;
                        margin = Math.round(margin);

                    currentSlide
                        .css('margin-top','-' + margin + 'px')
                        .attr('realWidth',base.sangarWidth)
                        .attr('realHeight',realHeight)
                        .attr('centered','true');

                    // fadeOut loading
                    base.setLoading(base.$currentSlide,'fadeOut');
                };
            }
            else
            {
                var vidWidth = parseInt(currentSlide.attr('realWidth'))
                var vidHeight = parseInt(currentSlide.attr('realHeight'));

                var minusResize = base.sangarWidth - vidWidth;

                if(minusResize < 0) minusResize * -1;

                var percentMinus = (minusResize / vidWidth) * 100;
                var realHeight = vidHeight + (vidHeight * percentMinus / 100);
                    realHeight = Math.round(realHeight);

                var margin = (realHeight - base.origHeight) / 2;
                    margin = Math.round(margin);

                currentSlide
                    .css('margin-top','-' + margin + 'px')
                    .attr('realWidth',base.sangarWidth)
                    .attr('realHeight',realHeight);

                // force hide/fadeOut the loading element if it still there
                base.setLoading(base.$currentSlide,'fadeOut');
            }
        }

        /**
         * Function: setLoading
         */
        base.setLoading = function(el,status)
        {
            var loading,
                loadingHTML = '<div class="sangar-slider-loading"><div><span id="span_1"></span><span id="span_2"></span><span id="span_3"></span></div></div>',
                loadingStyle = {
                    'display': 'block',
                    'position': 'absolute',
                    'width': '100%',
                    'height': '100%',
                    'background': opt.background,
                    'z-index': '99',
                    'top': '0px',
                    'left': '0px'
                },
                isLoaded = el.children('.sangar-slider-loading').length,
                fadeTime = 400;

            switch(status) 
            {
                case 'show':
                    if(! isLoaded) el.append(loadingHTML);                    
                    loading = el.children('.sangar-slider-loading');                    
                    
                    if(loading.css('display') != 'block')
                    {
                        base.beforeLoading(); // do before loading
                        if(! opt.disableLoading)
                            loading.css(loadingStyle);
                    }
                    break;

                case 'fadeOut':
                    if(isLoaded) {
                        base.afterLoading(); // do after loading
                        loading = el.children('.sangar-slider-loading');
                        loading.fadeOut(fadeTime,function(){
                            setTimeout(function() {
                                loading.remove();
                            }, fadeTime);
                        });
                    }
                    break;

                default: // silent
            }            
        }

        /**
         * Function: calculateHeightWidth
         */
        base.calculateHeightWidth = function(widthonly)
        {
            // sangarWidth
            base.sangarWidth = base.$el.innerWidth();

            var minusResize = opt.width - base.sangarWidth;
            var percentMinus = (minusResize / opt.width) * 100;

            // sangarHeight
            base.sangarHeight = opt.height - (opt.height * percentMinus / 100);

            // base.origHeight
            if(opt.fixedHeight)
            {
                base.origHeight = base.sangarHeight < opt.height ? base.sangarHeight : opt.height;
            }
            else
            {
                base.origHeight = base.sangarHeight;
            }

            // force size, override the calculated size with defined size
            if(opt.forceSize)
            {
                base.sangarWidth = opt.width;
                base.sangarHeight = opt.height;
                base.origHeight = opt.height;
            }

            // round
            base.sangarWidth = Math.round(base.sangarWidth);
            base.sangarHeight = Math.round(base.sangarHeight);
            base.origHeight = Math.round(base.origHeight);
        }

        /**
         * Function: setupSize
         */
        base.setupSize = function(reinit)
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
                    realHeight = Math.round(realHeight);

                height = realHeight;
            }

            // height
            if(opt.fixedHeight) {
                height = base.sangarHeight < opt.height ? base.sangarHeight : opt.height;
            }
            else {
                height = base.sangarHeight;
            }

            // height for bullet or pagination
            if(opt.pagination == 'content-horizontal') {
                var containerHeight = height + base.$pagination.outerHeight(true);
            }
            else {
                var containerHeight = height;
            }


            // percent or pixel
            if(maxWidth != '100%')
            {
                maxWidth = Math.round(maxWidth);
                maxWidth = maxWidth + 'px';
            }

            containerHeight = Math.round(containerHeight);
            height = Math.round(height);
     
            // apply size
            base.$el.css({
                'height': containerHeight + 'px',
                'max-width': maxWidth
            });

            base.$sangarWrapper.css({
                'height': containerHeight + 'px',
                'width': base.sangarWidth + 'px'
            });

            base.$sangar.css({
                'height': height + 'px',
                'max-width': maxWidth
            });
        }

        /**
         * Function: setupSizeAndCalculateHeightWidth
         */
        base.setupSizeAndCalculateHeightWidth = function(reinit)
        {
            base.calculateHeightWidth(); // re-calculate new width & height   
            base.setupSize(true); // Re-initialize size, scale or not    
            base.calculateHeightWidth(); // re-calculate new width & height  

            // vertical text pagination
            base.sangarWidth = base.verticalTextPaginationSetWidth();
        }

        /**
         * Function: css3support
         */
        base.css3support = function()
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
        base.doLoading = function(forceLoading)
        {               
            base.$el.show(); // show the slideshow

            // get first slide
            if(opt.continousSliding) {
                var firstSlide = base.$slideWrapper.children('.slideWrapperInside.swi2nd').children().eq(0);
            } 
            else {
                var firstSlide = base.$slideWrapper.children().eq(0);
            }

            base.setLoading(base.$sangarWrapper,'show');

            if(forceLoading)
            {
                base.setupSizeAndCalculateHeightWidth();
                showAllElements();
                base.setupSize();
                
                base.$pagination.hide();
                showLoading();
            }
            else
            {
                if(base.firstRun)
                {
                    hideLoading();
                    base.firstRun = false;

                    // show pagination
                    base.$pagination.show();
                }
                else
                {
                    showLoading()

                    setTimeout(function() {
                        hideLoading();
                    }, 1000);
                }
            }            

            /**
             * Functions
             */
            function hideLoading()
            {
                // show loading
                base.setLoading(base.$sangarWrapper,'fadeOut');

                base.$slideWrapper
                    .css({
                        "display": "block"
                    })

                base.$sangar.css({
                    'background-image': "none",
                    'z-index': '0'
                });
            }

            function showLoading()
            {
                base.$slideWrapper.hide();
                base.$sangar.css({
                    'background-image': '',
                    'z-index': '99'
                });
            }

            function showAllElements()
            {
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

                base.$pagination.show();
            }
        }


        /**
         * Function setCurrentSlide
         */
        base.setCurrentSlide = function(reset)
        {
            base.isRunning = true;
            var eachSlide;

            // prev slide
            if(base.$currentSlide) base.$prevSlide = base.$currentSlide;
            
            // current slide
            if(opt.continousSliding)
            {
                var groupClass = '.swi2nd';

                if(base.slideDirection == 'next' && base.activeSlide == 0)
                {
                    groupClass = '.swi3rd';
                }
                else if(base.slideDirection == "prev" && base.activeSlide == (base.numberSlides - 1))
                {
                    groupClass = '.swi1st';
                }

                // if reset
                if(reset)
                {
                    groupClass = '.swi2nd';

                    // unset prev slide if it same as first slide
                    if(base.$prevSlide && base.$prevSlide.parent().hasClass('swi2nd') && base.$prevSlide.attr('index') == 0) 
                    {
                        base.$prevSlide = false;
                    }
                }

                eachSlide = base.$slideWrapper.children('.slideWrapperInside').children();
                base.$currentSlide = base.$slideWrapper.children('.slideWrapperInside' + groupClass).children().eq(base.activeSlide);
            }
            else
            {
                // unset prev slide if it same as first slide
                if(reset && base.$prevSlide && base.$prevSlide.attr('index') == 0) 
                {
                    base.$prevSlide = false;
                }

                eachSlide = base.$slideWrapper.children();
                base.$currentSlide = base.$slideWrapper.children().eq(base.activeSlide);
            }

            // set active class
            eachSlide.removeClass('active-slide');
            base.$currentSlide.addClass('active-slide');
        }


        /**
         * Function: setActiveExternalPagination
         */
        base.setActiveExternalPagination = function()
        {            
            var paginationClass = opt.paginationExternalClass;

            if(paginationClass != "" && $('.' + paginationClass).length)
            {
                $("." + paginationClass).removeClass('active');
                $("." + paginationClass).eq(base.activeSlide).addClass("active");
            }
        }


        /**
         * Function: getTranslatePosition
         */
        base.getTranslatePosition = function(htmlDom)
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

/* Sangar Slider Class */
var sangarBeforeAfter;

;(function($) {

	sangarBeforeAfter = function(base, opt) {

        /**
         * Function: onInit
         */
        base.onInit = function()
        {
            opt.onInit();
        }


        /**
         * Function: onReset
         */
        base.onReset = function()
        {
            base.setupSizeAndCalculateHeightWidth(); // setup size after scaling
            base.setCurrentSlide(true); // reset current slide
            base.setupShowAllSlide() // if opt.showAllSlide is true
            base.initOutsideTextboxDimension(); // set outside container dimension
            base.playVideo(); // play video on first slide if exist
            base.setOutsideTextbox(); // set outside textbox if it defined
            base.setTimerWidth(); // reset timer width
            base.setBulletPosition() // reset bullet position
            base.setOutsideTextbox(); // set outside textbox if it defined
            base.setActiveExternalPagination() // set class active to external pagination

            // Fit the container height & width
            var wrapWidth = base.$sangarWrapper.width();
            var wrapHeight = base.$sangarWrapper.height();

            if(opt.autoResizeContainer)
            {
                setTimeout(function() {
                    base.$el.parent().css({
                        'min-width': wrapWidth + 'px',
                        'min-height': wrapHeight + 'px'
                    });
                }, 100);
            }

            opt.onReset(wrapWidth,wrapHeight);                
        }


        /**
         * Function: beforeLoading
         */
        base.beforeLoading = function()
        {
            opt.beforeLoading();
        }


        /**
         * Function: afterLoading
         */
        base.afterLoading = function()
        {
            base.animateContent(true); // animate content if contentAnimation is true
            base.startTimer();

            opt.afterLoading();
        }


		/**
         * Function: beforeSlideChange
         */
        base.beforeSlideChange = function()
        {
            opt.beforeChange(base.activeSlide);
        }
        

        /**
         * Function: afterSlideChange
         */
        base.afterSlideChange = function()
        {
            base.playVideo(); // play current video if exist                        
            base.setOutsideTextbox(); // set outside textbox if it defined
            base.setActiveExternalPagination(); // set class active to external pagination
            base.animateContent(); // animate content if contentAnimation is true

            opt.afterChange(base.activeSlide);
        }
    }

})(jQuery);

/* Sangar Slider Class */
var sangarLock;

;(function($) {

	sangarLock = function(base, opt) {

        /**
         * Function: unlock
         */
        base.unlock = function()
        {
            base.locked = false;
        }

        /**
         * Function: lock
         */
        base.lock = function()
        {
            base.locked = true;
        }

		/**
         * Function: stopSliderLock
         */
        base.stopSliderLock = function()
        {
            if (!opt.timer || opt.timer == 'false') {
                return false;
            } else {
                base.timerRunning = false;
                clearInterval(base.clock); 
                clearTimeout(base.resumeClock);               

                base.pauseTimerAnimation();
            }
        }
        
        /**
         * Function: resetAndUnlock
         */
        base.resetAndUnlock = function()
        {
            base.unlock();
            base.afterSlideChange();

            // Fade: put prevActiveSlide to z-index 1 after end of translation
            if (opt.animation == "fade") 
            {
                base.$slides
                    .eq(base.prevActiveSlide)
                    .css({
                        "z-index": 1
                    });
            }
        }
    }

})(jQuery);

/* Sangar Slider Class */
var sangarResetSlider;

;(function($) {

	sangarResetSlider = function(base, opt) {

		/**
         * Function: resetSlider
         */
        base.resetSlider = function()
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
                        
            // reset slide pagination
            if(opt.pagination == 'content-horizontal' || opt.pagination == 'content-vertical')
            {
                base.bulletObj.generateSlideBullet();
                base.bulletObj.slideBullet('first');
                base.shift(0);
            }

            base.onReset(); // Run functions after slide init and reset
        }
    }

})(jQuery);    

/* Sangar Slider Class */
var sangarResponsiveClass;

;(function($) {

	sangarResponsiveClass = function(base, opt) {

		/**
         * Function: doResponsiveClass
         */
        base.doResponsiveClass = function()
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
                if(base.firstRun)
                {
                    base.firstRun = false
                    base.$sangarWrapper.attr('class','sangar-wrapper ' + opt.themeClass)
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

/* Sangar Slider Class */
var sangarSetupBulletNav;

;(function($) {

    sangarSetupBulletNav = function(base, opt) {

        /**
         * Function: setupBulletNav
         */
        base.setupBulletNav = function()
        {
            var bulletHTMLWrapper = "<div class='sangar-bullet-wrapper'></div>";

            if(opt.pagination == 'bullet')
            {
                var bulletHTML = '<ul class="sangar-pagination sangar-pagination-' + opt.pagination + '"></ul>';
            }
            else
            {
                var bulletHTML = '<ul class="sangar-pagination sangar-pagination-' + opt.pagination + ' sangar-pagination-type-' + opt.paginationContentType + '"></ul>';
            }            
            
            base.$sangarWrapper.append(bulletHTML);
            base.$pagination = base.$sangarWrapper.children('ul.sangar-pagination');

            for (i = 0; i < base.numberSlides; i++) 
            {
                var liMarkup;

                switch(opt.pagination)
                {
                    case 'bullet':
                        if(opt.paginationBulletNumber == true)
                        {
                            liMarkup = $('<li class="sangar-slideshow-nav-pagination sangar-bullet-number">' + (i+1) + '</li>');
                        }
                        else
                        {
                            liMarkup = $('<li class="sangar-slideshow-nav-pagination"></li>');
                        }
                        break;

                    case 'content-horizontal':
                        if(opt.paginationContentType == 'text')
                        {
                            var paginationContent = opt.paginationContent.length > 0 ? opt.paginationContent[i] : "";
                            liMarkup = $('<li class="sangar-slideshow-nav-pagination">' + paginationContent + '</li>');
                        }
                        else if(opt.paginationContentType == 'image')
                        {
                            var paginationContent = typeof(opt.paginationContent[i]) != 'undefined' ? opt.paginationContent[i] : "";
                            var paginationImageAttr = typeof(opt.paginationImageAttr[i]) != 'undefined' ? opt.paginationImageAttr[i] : "";
                            liMarkup = $('<li class="sangar-slideshow-nav-pagination"><div><img src="' + paginationContent + '" ' + paginationImageAttr + ' width="' + opt.paginationContentWidth + '" height="' + opt.paginationImageHeight + '"></div></li>');      
                        }
                        break;

                    case 'content-vertical':
                        if(opt.paginationContentType == 'text')
                        {
                            var paginationContent = opt.paginationContent.length > 0 ? opt.paginationContent[i] : "";
                            liMarkup = $('<li class="sangar-slideshow-nav-pagination">' + paginationContent + '</li>');
                        }
                        else if(opt.paginationContentType == 'image')
                        {
                            var paginationContent = typeof(opt.paginationContent[i]) != 'undefined' ? opt.paginationContent[i] : "";
                            var paginationImageAttr = typeof(opt.paginationImageAttr[i]) != 'undefined' ? opt.paginationImageAttr[i] : "";
                            liMarkup = $('<li class="sangar-slideshow-nav-pagination"><img src="' + paginationContent + '" ' + paginationImageAttr + ' width="' + opt.paginationContentWidth + '" height="' + opt.paginationImageHeight + '"></li>');      
                        }
                        break;

                    default: 
                        liMarkup = $('<li class="sangar-slideshow-nav-pagination"></li>');
                }

                base.$sangarWrapper.children('ul.sangar-pagination').append(liMarkup);
                liMarkup.data('index', i);
                liMarkup.click(function () {                        
                    base.stopSliderLock();
                    base.shift($(this).data('index'));
                });
            }
           
            base.$pagination.wrap("<div class='sangar-pagination-wrapper wrapper-" + opt.pagination + "' />");                              
                      
        
            /** 
             * autohide behaviour
             */
            if(opt.pagination == 'bullet' && opt.directionalNav == 'autohide')
            {
                var btnAnimateSpeed = 300;

                base.$pagination.css("opacity", opt.directionalNavHideOpacity);

                base.$sangarWrapper.mouseenter(function(){
                    base.$pagination.animate({
                        "opacity": opt.directionalNavShowOpacity
                    }, btnAnimateSpeed);
                });
                base.$sangarWrapper.mouseleave(function(){
                    base.$pagination.animate({
                        "opacity": opt.directionalNavHideOpacity
                    }, btnAnimateSpeed);
                });
            }
        }


        /** 
         * Function: setBulletPosition
         */
        base.setBulletPosition = function()
        {
            if(opt.pagination == 'bullet')
            {
                var eachBullet = base.$pagination.children('li');
                var bulletsWidth = eachBullet.outerWidth() * base.numberSlides;
                
                var bulletsMargin = 0;

                eachBullet.each(function(index){
                    var left = $(this).css('margin-left').slice(0,-2);
                    var right = $(this).css('margin-right').slice(0,-2);

                    if(isNaN(left)) left = 0;
                    if(isNaN(right)) right = 0;

                    bulletsMargin = bulletsMargin + parseInt(left) + parseInt(right);
                });

                bulletsWidth = bulletsWidth + bulletsMargin;

                if(opt.animation == "vertical-slide")
                {
                    base.$pagination.parent().css({
                        'top': '50%',
                        'margin-top': '-' + (bulletsWidth / 2) + 'px',
                        'bottom': '0px',
                        'right': '12px'
                    });

                    eachBullet.css({
                        'float': 'none',
                        'margin-left': '0px',
                        'margin-top': '10px'
                    });

                    eachBullet.first().css('margin-top', '0px');
                }
                else
                {
                    base.$pagination.parent().css({
                        'left': '50%',
                        'margin-left': '-' + (bulletsWidth / 2) + 'px'
                    });
                }
            }
        }


        /**
         * Function: setupSliderBulletNav
         */
        base.setupSliderBulletNav = function()
        {
            var spagination = 0;
            var parentWidth = 0;
            var paginationWalkingWidth = 0;
            var paginationWalkingHeight = 0;
            var paginationMaxShowedIndex = 0;
            var paginationBackChild = 0;
            var paginationNextChild = 0;
            var paginationOffsetSize = 0;
            var paginationPosition = 0;                        
            var paginationOffsetEnable = false;
            var paginationWidth = 0;
            var paginationHeight = 0;
            var paginationMovedWidth = 0;

            var imagePaginationSpace = 5;
            var eachWidth = opt.paginationContentWidth;
            var totalWidth = eachWidth * base.numberSlides;
                totalWidth = opt.paginationContentType == 'image' ? totalWidth + (imagePaginationSpace * base.numberSlides) : totalWidth;

            var eachHeight = 0;
            var totalHeight = 0;

            // vertical or horizontal
            var dirType = opt.pagination;
                dirType = dirType.substring(8);

            // first init horizontal bullet slider dimension
            if(dirType == 'horizontal')
            {
                var spagination = base.$sangarWrapper.find('ul.sangar-pagination-' + opt.pagination);
                spagination.width(totalWidth);
            }
            
            /**
             * generate slide bullet 
             * this function will be recall every slideshow resized
             */
            this.generateSlideBullet = function()
            {
                spagination = base.$sangarWrapper.find('ul.sangar-pagination-' + opt.pagination);

                // use slider width if all slide showed
                if(opt.showAllSlide)
                {
                    var containerWidth = base.$el.outerWidth(true);
                }
                else
                {
                    var containerWidth = spagination.parent().outerWidth(true);
                }

                parentWidth = containerWidth;
                paginationWalkingWidth = 0;
                paginationWalkingHeight = 0;
                paginationMaxShowedIndex = 0;
                paginationBackChild = 0;
                paginationNextChild = 0;
                paginationOffsetSize = 0;
                paginationPosition = 0;                        
                paginationOffsetEnable = false;              
                                
                spagination.parent().css('overflow', 'hidden');
                spagination.css('background-color', spagination.children('li').last().css("background-color"));
                spagination.children('li.sangar-slideshow-nav-pagination').css('width',eachWidth + 'px');                
                                
                setupPaginationPosition(); // vertical or horizontal
                setupPaginationWidth(); // vertical or horizontal
                setupWalkingPagination(); // vertical or horizontal

                function setupPaginationPosition()
                {
                    if(dirType == 'vertical')
                    {
                        /** 
                         * A complicated vertical positioning 
                         */
                        eachHeight = spagination.children('li').outerHeight();
                        totalHeight = eachHeight * base.numberSlides;

                        spagination.css('width', eachWidth + 'px');
                        spagination.parent().css({
                            'width': eachWidth + 'px',
                            'right': 0 + 'px',
                            'height': base.origHeight + 'px'
                        });

                        // wrapper and container
                        base.$el.css({
                            'height': base.origHeight + 'px'
                        });

                        base.$sangar.css({
                            'margin-left': '0px'
                        });
                    }
                    else
                    {
                        spagination.width(totalWidth);
                    }
                }

                function setupPaginationWidth()
                {
                    /** 
                     * vertical vs horizontal
                     */

                    if(dirType == 'vertical')
                    {
                        paginationHeight = base.origHeight;

                        if(paginationHeight > totalHeight)
                        {
                            paginationHeight = totalHeight;
                        }
                    }
                    else
                    {
                        // paginationWidth = spagination.parent().outerWidth(true);
                        paginationWidth = containerWidth;

                        if(paginationWidth > totalWidth)
                        {
                            if(opt.paginationContentFullWidth)
                            {
                                eachWidth = paginationWidth / base.numberSlides;
                                totalWidth = eachWidth * base.numberSlides;
                            }
                            else paginationWidth = totalWidth;                  
                        }
                    }
                }

                function setupWalkingPagination()
                {
                    spagination.find('li').each(function () {

                        /** 
                         * vertical vs horizontal
                         */

                        if(dirType == 'vertical')
                        {
                            paginationWalkingHeight += eachHeight;

                            if (paginationWalkingHeight + eachHeight > paginationHeight) 
                            {
                                paginationNextChild = $(this).index();
                                paginationMaxShowedIndex = paginationNextChild;
                            }

                            if (paginationWalkingHeight > paginationHeight) 
                            {
                                $(this).addClass('sangar-bullet-sliding-next');
                                paginationOffsetSize = paginationWalkingHeight - paginationHeight;

                                /* detect if pagination offset is too large */
                                if(paginationOffsetSize < eachHeight)
                                {
                                    paginationOffsetEnable = true;
                                }

                                return false;
                            }
                        }
                        else
                        {
                            paginationWalkingWidth += eachWidth;

                            if (paginationWalkingWidth + eachWidth > paginationWidth) 
                            {
                                paginationNextChild = $(this).index();
                                paginationMaxShowedIndex = paginationNextChild;
                            }

                            if (paginationWalkingWidth > paginationWidth) 
                            {
                                $(this).addClass('sangar-bullet-sliding-next');
                                paginationOffsetSize = paginationWalkingWidth - paginationWidth;

                                /* detect if pagination offset is too large */
                                if(paginationOffsetSize < eachWidth)
                                {
                                    paginationOffsetEnable = true;
                                }

                                return false;
                            }
                        }
                    });
                }
            }

            this.slideBullet = function(navigate)
            {
                /** 
                 * vertical vs horizontal
                 */
                if(dirType == 'vertical')
                {
                    var eachDimension = eachHeight;
                }
                else
                {
                    var eachDimension = eachWidth;
                }

                var paginationNavPixelSize = 0;

                if(navigate == 'next')
                {
                    if(spagination.children('li').eq(base.numberSlides - 1).hasClass("sangar-bullet-sliding-next"))
                    {
                        paginationNavPixelSize = (eachDimension * paginationPosition) + paginationOffsetSize;
                    }
                    else
                    {
                        spagination.children('li').removeClass('sangar-bullet-sliding-back').removeClass('sangar-bullet-sliding-next');

                        paginationPosition++;
                        paginationBackChild++;
                        paginationNextChild++;

                        paginationNavPixelSize = (eachDimension * paginationPosition) + paginationOffsetSize;
                    }

                    slideBulletAddClass('sliding_one','sangar-bullet-sliding-one-back',paginationBackChild + 1)            
                }
                else if(navigate == 'back')
                {
                    spagination.children('li').removeClass('sangar-bullet-sliding-back').removeClass('sangar-bullet-sliding-next');

                    paginationPosition--;
                    paginationBackChild--;
                    paginationNextChild--;

                    paginationNavPixelSize = eachDimension * paginationPosition;

                    slideBulletAddClass('sliding_one','sangar-bullet-sliding-one-next',paginationNextChild - 1)
                }
                else if(navigate == 'first')
                {
                    spagination.children('li').removeClass('sangar-bullet-sliding-back').removeClass('sangar-bullet-sliding-next');

                    paginationPosition = 0;
                    paginationBackChild = 0;                    
                    paginationNextChild = paginationMaxShowedIndex;

                    paginationNavPixelSize = eachDimension * paginationPosition;

                    slideBulletAddClass('sliding_one','sangar-bullet-sliding-one-next',paginationNextChild - 1)
                }
                else if(navigate == 'last')
                {
                    spagination.children('li').removeClass('sangar-bullet-sliding-back').removeClass('sangar-bullet-sliding-next');

                    var numberBulletsByIndex = base.numberSlides - 1;

                    paginationPosition = numberBulletsByIndex - paginationMaxShowedIndex;
                    paginationBackChild = numberBulletsByIndex - paginationMaxShowedIndex;
                    paginationNextChild = numberBulletsByIndex;

                    paginationNavPixelSize = (eachDimension * paginationPosition) + paginationOffsetSize;

                    slideBulletAddClass('sliding_one','sangar-bullet-sliding-one-back',paginationBackChild + 1)
                }

                /**
                 * Track moved width
                 */
                paginationMovedWidth = paginationNavPixelSize;
                trackMovedWidth(paginationMovedWidth);                
                
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

                    oneMove = paginationMovedWidth - paginationOffsetSize;
                }
                else
                {
                    spagination.children('li').eq(paginationBackChild + 1).addClass('sangar-bullet-sliding-one-back');

                    oneMove = paginationMovedWidth + paginationOffsetSize;
                }

                /**
                 * Track moved width
                 */
                paginationMovedWidth = oneMove;
                trackMovedWidth(paginationMovedWidth);
            }

            function trackMovedWidth(move)
            {
                /** 
                 * vertical vs horizontal
                 */
                if(dirType == 'vertical')
                {
                    var transform = 'translate3d(0, -' + move + 'px, 0)';
                    var direction = 'down';
                }
                else
                {
                    var transform = 'translate3d(-' + move + 'px, 0, 0)';
                    var direction = 'left';
                }

                if(parentWidth < totalWidth)
                {
                    if(base.css3support())
                    {
                        var properties = {};
                        properties[ '-' + base.vendorPrefix + '-transition-duration' ] = opt.animationSpeed + 'ms';
                        properties[ '-' + base.vendorPrefix + '-transform' ] = transform;

                        spagination.css(properties);
                    }
                    else
                    {
                        spagination
                            .animate({
                                direction: '-' + move + 'px'
                            }, opt.animationSpeed);
                    }
                }
            }


            /**
             * SET ACTIVE BULLETS
             */
            this.setActiveBullet = function() 
            {
                if (opt.pagination == 'none') {
                    return false;
                } else {
                    base.$pagination.children('li').removeClass('sangar-pagination-active').eq(base.activeSlide).addClass('sangar-pagination-active');

                    /**
                     * begin slide pagination
                     */
                    if(opt.pagination == 'content-horizontal' || opt.pagination == 'content-vertical')
                    {
                        this.beginSlideBullet();
                    }
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


        /**
         * Function: verticalTextPaginationSetWidth
         */
        base.verticalTextPaginationSetWidth = function()
        {
            if(opt.pagination == 'content-vertical')
            {
                return base.sangarWidth - opt.paginationContentWidth;
            }
            else
            {
                return base.sangarWidth;
            }
        }
    }

})(jQuery);

/* Sangar Slider Class */
var sangarSetupLayout;

;(function($) {

    sangarSetupLayout = function(base, opt) {

        /**
         * Function: setupLayout
         */
        base.setupLayout = function()
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
                opt.directionalNav = 'show';
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
        base.doBlur = function(parentClass,childNumber,valueBlur)
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

/* Sangar Slider Class */
var sangarSetupNavigation;

;(function($) {

    sangarSetupNavigation = function(base, opt) {

        var btnTop;

    	/**
         * Function: setupDirectionalNav
         */
        base.setupDirectionalNav = function()
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

                var directionalNavHTML = '<div class="sangar-slider-nav"><span class="sangar-arrow-' + arrow_right + '"></span><span class="sangar-arrow-' + arrow_left + '"></span></div>';
                base.$sangarWrapper.append(directionalNavHTML);
                var leftBtn = base.$sangarWrapper.children('div.sangar-slider-nav').children('span.sangar-arrow-' + arrow_left),
                    rightBtn = base.$sangarWrapper.children('div.sangar-slider-nav').children('span.sangar-arrow-' + arrow_right);
                leftBtn.click(function () {
                    base.stopSliderLock();
                    base.shift("prev");
                });
                rightBtn.click(function () {
                    base.stopSliderLock();
                    base.shift("next")
                });

                /** 
                 * autohide behaviour
                 */
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
         * Function: showAllSlideNav
         */
        base.showAllSlideNav = function()
        {
            var btn = base.$sangarWrapper.children('div.sangar-slider-nav').children('span');
            var wrapperWidth = base.$sangarWrapper.width();
            var navWidth = (wrapperWidth - base.sangarWidth) / 2;

            var slideWidth = base.sangarWidth;
            var containerWidth = base.$el.outerWidth(true);
            var diffWidth = containerWidth - slideWidth;
            
            if(diffWidth > 100)
            {
                btn.css({
                    'top': '0px',
                    'margin-top': '0px',
                    'background': 'none',
                    'width': navWidth + 'px',
                    'height': base.sangarHeight + 'px'
                });
            }
            else
            {
                btn.css({
                    'margin-top': '',
                    'background': '',
                    'width': '',
                    'height': ''
                });

                btnTop = ((base.origHeight / 2) - (btn.height() / 2)) + 'px';

                btn.css({
                    'top': btnTop
                });
            }
        }

        /**
         * Function: setNavPosition
         */
        base.setNavPosition = function()
        {
            if(opt.directionalNav == 'none') return;
            
            var btn = base.$sangarWrapper.children('div.sangar-slider-nav').children('span');

            if(opt.animation == "vertical-slide")
            {
                var downBtn = base.$sangarWrapper.children('div.sangar-slider-nav').children('span.sangar-arrow-down');
                var downBtnBottom = downBtn.css('bottom').slice(0,-2);

                if(opt.pagination == 'content-horizontal')
                {
                    var pagination = base.$pagination
                    var bottom = parseInt(pagination.outerHeight()) + parseInt(downBtnBottom);
                }                

                // down nav arrow
                downBtn.css('bottom', bottom + 'px');
                btn.css('left', ((base.sangarWidth / 2) - (btn.width() / 2)) + 'px');
            }
            else
            {
                var downRight = base.$sangarWrapper.children('div.sangar-slider-nav').children('span.sangar-arrow-right');

                // pagination content-vertical
                if(opt.pagination == 'content-vertical')
                {
                    downRight.css({
                        'right': opt.paginationContentWidth + 'px'
                    })
                }

                btnTop = ((base.origHeight / 2) - (btn.height() / 2)) + 'px';

                btn.css({
                    'top': btnTop
                })
            }
        }
    }

})(jQuery);

/* Sangar Slider Class */
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

/* Sangar Slider Class */
var sangarSetupTimer;

;(function($) {

	sangarSetupTimer = function(base, opt) {

		/**
         * Function: setupTimer
         */
        base.setupTimer = function()
        {
            var timerHTML = '<div class="sangar-timer"><div class="sangar-timer-mask"></div></div>';
                
            base.$sangarWrapper.append(timerHTML);
        }

        base.startTimer = function()
        {
            //Timer Execution
            function startClock() 
            {
                if (!opt.timer || opt.timer == 'false') 
                {
                    return false;
                } 
                else 
                {
                    // stop current if exist
                    if(base.clock) base.stopSliderLock();

                    // start new
                    base.pauseTimerAnimation(true);
                    base.doTimerAnimation();

                    base.clock = setInterval(function(e)
                    {
                        base.shift("next"); 

                        base.pauseTimerAnimation(true);

                        setTimeout(function() {
                            startClock();
                        }, opt.animationSpeed);

                    }, opt.advanceSpeed);
                }
            }

            function resumeClock()
            {
                var diffTime = getPausedInterval();

                base.pauseTimerAnimation();
                base.doTimerAnimation(diffTime);

                base.resumeClock = setTimeout(function()
                {
                    base.shift("next");

                    base.pauseTimerAnimation(true);

                    setTimeout(function() {
                        startClock();
                    }, opt.animationSpeed);

                }, diffTime);
            }

            function getPausedInterval()
            {
                var timer = base.$sangarWrapper.children('div.sangar-timer');
                var currentWidth = timer.children('div.sangar-timer-mask').width();
                var wrapperWidth = base.$sangarWrapper.width();

                var percentDiff = (currentWidth / wrapperWidth) * 100;

                var diffTime = opt.advanceSpeed - (opt.advanceSpeed * percentDiff) / 100;

                return diffTime;
            }

            // Timer Setup
            if (opt.timer && ! base.clock) 
            {
                var timer = base.$sangarWrapper.children('div.sangar-timer');

                if (timer.length != 0) 
                {
                    startClock();

                    if (opt.startClockOnMouseOut) {
                        var outTimer;
                        base.$sangarWrapper.mouseleave(function () {

                            outTimer = setTimeout(function () {
                                if (!base.timerRunning) {
                                    resumeClock();
                                }
                            }, opt.startClockOnMouseOutAfter)
                        })
                        base.$sangarWrapper.mouseenter(function () {
                            clearTimeout(outTimer);
                        })
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

        /**
         * Function: doTimerAnimation
         */
        base.doTimerAnimation = function(timeSpeed)
        {
            timeSpeed = timeSpeed ? timeSpeed : opt.advanceSpeed;

            if(base.css3support())
            {    
                enableTransition();
                doAnimate(timeSpeed);
            }

            /**
             * functions
             */
            function enableTransition()
            {
                var timer = base.$sangarWrapper.children('div.sangar-timer');

                timer.children('div.sangar-timer-mask')[0].offsetHeight; // Trigger a reflow, flushing the CSS changes
                timer.children('div.sangar-timer-mask').removeClass('notransition'); // Re-enable transitions
            }

            function doAnimate(timeSpeed)
            {
                var timer = base.$sangarWrapper.children('div.sangar-timer');

                timer.children('div.sangar-timer-mask')
                     .css({
                        'width': '100%',
                        'transition': 'width ' + timeSpeed + 'ms linear'
                     });
            }
        }

        /**
         * Function: pauseTimerAnimation
         */
        base.pauseTimerAnimation = function(reset)
        {
            var timer = base.$sangarWrapper.children('div.sangar-timer');
            var currentWidth = timer.children('div.sangar-timer-mask').width();

            if(reset) currentWidth = 0;

            if(base.css3support())
            {
                timer.children('div.sangar-timer-mask')
                     .addClass('notransition')
                     .css({
                        'width': currentWidth + 'px'
                     });
            }
        }

        /**
         * Function: setTimerWidth
         */
        base.setTimerWidth = function()
        {
            var timer = base.$sangarWrapper.children('div.sangar-timer');

            // showAllSlide
            if(opt.showAllSlide)
            {
                var wrapperWidth = base.$sangarWrapper.width();

                timer.width(wrapperWidth);
            }
            else
            {
                timer.width(base.sangarWidth);
            }
        }
	}

})(jQuery);

/* Sangar Slider Class */
var sangarShift;

;(function($) {

	sangarShift = function(base, opt) {

		/**
	     * Function: shift
	     */
	    base.shift = function(direction)
	    {
	    	// before slide function
	    	base.beforeSlideChange(); 

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
                        var slideAction_pure = base.sangarWidth * base.activeSlideContinous;
                        var slideAction = slideAction_pure * -1;

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
	                        swi1st.css('margin-left', (slideAction_pure + slideWrapperWidth) + 'px');

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
	                        swi3rd.css('margin-left', (slideAction_pure - slideWrapperWidth - (slideWrapperWidth - base.sangarWidth)) + 'px');

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
	                        properties[ '-' + base.vendorPrefix + '-transform' ] = 'translate('+ slideAction +'px, 0)';
	                        properties[ '-' + base.vendorPrefix + '-transform-style' ] = 'preserve-3d';	                        
                            properties[ '-' + base.vendorPrefix + '-backface-visibility' ] = 'hidden';	                        
                        	properties[ '-' + base.vendorPrefix + '-perspective' ] = '1000px';

	                        // Do the CSS3 transition
	                        base.$slideWrapper.css(properties);
	                    }
	                    else
	                    {
	                        base.$slideWrapper
	                        .animate({
	                            "left": slideAction + 'px'
	                        }, opt.animationSpeed);
	                    }


	                    // showAllSlide
			            if(opt.showAllSlide)
			            {
		                    base.doBlur('.swi2nd',base.activeSlide,1);
		                    base.doBlur('.swi2nd',base.prevActiveSlide,0.5);

		                    if(base.prevActiveSlide == 0){
		                    	base.doBlur('.swi3rd',base.prevActiveSlide,0.5);
		                    }

		                    if(base.prevActiveSlide == (base.numberSlides - 1)){
		                    	base.doBlur('.swi1st',base.prevActiveSlide,0.5);
		                    }
		                }
	                }
	                else
	                {
	                    var slideAction = base.sangarWidth * base.activeSlide < base.numberSlides * base.sangarWidth ? '-' + base.sangarWidth * base.activeSlide : 0 ;

                        if(base.css3support())
                        {
                            // Get the properties to transition
                            var properties = {};
                            properties[ '-' + base.vendorPrefix + '-transition' ] = opt.animationSpeed + 'ms cubic-bezier(0.445, 0.05, 0.55, 0.95)';
                            properties[ '-' + base.vendorPrefix + '-transform' ] = 'translate('+ slideAction +'px, 0)';
                            properties[ '-' + base.vendorPrefix + '-transform-style' ] = 'preserve-3d';	                        
                            properties[ '-' + base.vendorPrefix + '-backface-visibility' ] = 'hidden';	                        
                        	properties[ '-' + base.vendorPrefix + '-perspective' ] = '1000px';

                            // Do the CSS3 transition
                            base.$slideWrapper.css(properties);
                        }
                        else
                        {
                            base.$slideWrapper
                                .animate({
                                    "left": slideAction + 'px'
                                }, opt.animationSpeed);
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
	                	var slideAction_pure = base.sangarHeight * base.activeSlideContinous;
                        var slideAction = slideAction_pure * -1;

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
	                        swi1st.css('margin-top', (slideAction_pure + slideWrapperHeight) + 'px');

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
	                        swi3rd.css('margin-top', (slideAction_pure - slideWrapperHeight - (slideWrapperHeight - base.sangarHeight)) + 'px');

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
	                        properties[ '-' + base.vendorPrefix + '-transform' ] = 'translate(0, '+ slideAction +'px)';
	                        properties[ '-' + base.vendorPrefix + '-transform-style' ] = 'preserve-3d';	                        
							properties[ '-' + base.vendorPrefix + '-backface-visibility' ] = 'hidden';	                        
							properties[ '-' + base.vendorPrefix + '-perspective' ] = '1000px';

	                        // Do the CSS3 transition
	                        base.$slideWrapper.css(properties);
	                    }
	                    else
	                    {
	                        base.$slideWrapper
	                        .animate({
	                            "top": slideAction + 'px'
	                        }, opt.animationSpeed);
	                    }
	                }
	                else
	                {
	                    var slideAction = base.sangarHeight * base.activeSlide < base.numberSlides * base.sangarHeight ? '-' + base.sangarHeight * base.activeSlide : 0 ;

                        if(base.css3support())
                        {
                            // Get the properties to transition
                            var properties = {};
                            properties[ '-' + base.vendorPrefix + '-transition' ] = opt.animationSpeed + 'ms cubic-bezier(0.445, 0.05, 0.55, 0.95)';
	                        properties[ '-' + base.vendorPrefix + '-transform' ] = 'translate(0, '+ slideAction +'px)';
	                        properties[ '-' + base.vendorPrefix + '-transform-style' ] = 'preserve-3d';	                        
							properties[ '-' + base.vendorPrefix + '-backface-visibility' ] = 'hidden';	                        
							properties[ '-' + base.vendorPrefix + '-perspective' ] = '1000px';

                            // Do the CSS3 transition
                            base.$slideWrapper.css(properties);
                        }
                        else
                        {
                            base.$slideWrapper
                                .animate({
                                    "top": slideAction + 'px'
                                }, opt.animationSpeed);
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
                        }, opt.animationSpeed);

                    // show and put activeSlide to z-index 3
                    base.$slides
                        .eq(base.activeSlide)
                        .css({
                            "opacity": 0,
                            "z-index": 3
                        })
                        .animate({
                            "opacity": 1
                        }, opt.animationSpeed);
	            }
	        
	            base.resetAndUnlock(); // unlock after animated slide
	        }
	    }
	}

})(jQuery);

/* Sangar Slider Class */
var sangarSizeAndScale;

;(function($) {

    sangarSizeAndScale = function(base, opt) {
		
        /**
         * Function: setupScaleImage
         */
        base.setupScaleImage = function(imageDom)
        {
            // set sangarWrapper height
            // base.$sangarWrapper.height(base.origHeight + base.$pagination.outerHeight(true));

            // scaleImage
            if(opt.scaleImage)
            {
                imageDom.each(function(index){

                    var width = base.sangarWidth;
                    var height = base.getImgHeight(width,index,imageDom.length);
                    var slideHeight = $(this).parent().height();

					if(base.origHeight > height) 
                    {
                        var curImgWidth = base.getImgWidth(base.origHeight,index,imageDom.length);
                        var curDiffWidth = (curImgWidth - base.sangarWidth) * -1;

                        $(this).css({
                            'height': base.origHeight + 'px',
                            'width': curImgWidth + 'px',
                            'max-height': base.origHeight + 'px',
                            'max-width': curImgWidth + 'px',
                            'margin-left': curDiffWidth / 2  + 'px'
                        })

                        // neutralize
                        $(this).css({
                            'margin-top': ''
                        })
					}
					else 
                    {
                        var diff = base.origHeight - height;

						if(opt.imageVerticalAlign == 'top') {
                            $(this).css('margin-top', '0px');
						}
						else if(opt.imageVerticalAlign == 'bottom') {
                            $(this).css('margin-top', diff + 'px');
						}
						else {
                            $(this).css('margin-top', (diff / 2) + 'px');
						}

                        $(this).css({
                            'width': width + 'px',
                            'max-width': width + 'px'
                        })

                        // neutralize
                        $(this).css({
                            'height': 'auto',
                            'margin-left': ''
                        })
					}

                    // width                    
                    $(this).parent().width(width);
                })
            }
            else
            {
                var padding = 10;
                var curImgHeight = base.origHeight - (padding * 2);
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
                var contHeight = base.origHeight - (padding * 2);

                // horizontal center align
                imageDom.each(function(index){
                    var width = base.getImgWidth(curImgHeight,index,imageDom.length);
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
                        var height = base.getImgHeight(width,index,imageDom.length);
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

        /**
         * Function: setupScaleIframe
         */
        base.setupScaleIframe = function(iframeDom)
        {
            iframeDom.each(function(index){
                $(this).width(base.sangarWidth);
                $(this).height(base.origHeight);
            });
        }
	}

})(jQuery);

/* Sangar Slider Class */
var sangarTextbox;

;(function($) {

    sangarTextbox = function(base, opt) {

        var textboxContent = [],
            arrTextboxHeight = [],
            textboxHeight,
            pagination,
            paginationBottom,
            isSetPaginationBottom = false;

		/**
         * Function: initOutsideTextbox
         */
        base.initOutsideTextbox = function()
        {
            if(! opt.textboxOutside) return;
            
            base.$el.css('background',opt.background); // set background to root element

            base.$sangarWrapper.append('<div class="sangar-outside-textbox sangar-position-sticky-bottom"></div>');
            base.$outsideTextbox = base.$sangarWrapper.children('.sangar-outside-textbox');

            base.$slides.each(function (index,slide) {
                var textbox = $(this).find('.sangar-textbox-inner');

                if(textbox.length > 0)
                {
                    textbox.children('.sangar-textbox-content')
                        .attr('class','sangar-textbox-content')
                        .removeAttr('style')
                        .css({
                            'box-sizing': 'border-box',
                            'background': 'none'
                        });

                    textboxContent[index] = textbox.html();

                    $(this).children('.sangar-textbox').remove();
                }
                else
                {
                    textboxContent[index] = false;
                }                
            });
        }


        /**
         * Function: initOutsideTextboxHeight
         */
        base.initOutsideTextboxDimension = function()
        {
            if(! opt.textboxOutside) return;

            base.$slides.each(function (index,slide) {
                base.$outsideTextbox.html(textboxContent[index]);
                var activeTextboxContent = base.$outsideTextbox.children('.sangar-textbox-content');
                
                arrTextboxHeight[index] = activeTextboxContent.outerHeight();
            });

            base.$outsideTextbox.html(''); // set to empty
            textboxHeight = Math.max.apply(Math,arrTextboxHeight); // get max height

            // apply bullet pagination position
            if(! isSetPaginationBottom) setPaginationBottom();
            
            if(opt.pagination == 'bullet')
            {
                pagination.css({
                    'bottom': parseInt(paginationBottom) + parseInt(textboxHeight) + 'px'
                });
            }
            else if(opt.pagination == 'content-horizontal')
            {
                textboxHeight = textboxHeight + parseInt(paginationBottom);
            }

            // apply size
            base.$el.height(base.origHeight + textboxHeight);
            base.$sangarWrapper.height(base.origHeight + textboxHeight);            
            
            // function setPaginationBottom
            function setPaginationBottom()
            {
                isSetPaginationBottom = true;

                // get paginationBottom
                if(opt.pagination == 'bullet')
                {                    
                    pagination = base.$pagination.parent();
                    paginationBottom = pagination.css('bottom').slice(0,-2);
                }
                else if(opt.pagination == 'content-horizontal')
                {
                    pagination = base.$pagination;
                    paginationBottom = pagination.outerHeight();
                }
            }
        }


        /**
         * Function: setOutsideTextbox
         */
        base.setOutsideTextbox = function()
        {
            if(! opt.textboxOutside) return;

            if(textboxContent[base.activeSlide])
            {
                base.$outsideTextbox.html(textboxContent[base.activeSlide]);
                var activeTextboxContent = base.$outsideTextbox.children('.sangar-textbox-content');
                var textboxBottom = textboxHeight - arrTextboxHeight[base.activeSlide];

                activeTextboxContent.css('bottom',textboxBottom + 'px');
                activeTextboxContent.hide(); // hide
                activeTextboxContent.fadeIn(opt.animationSpeed); // show animation
            }            
        }


        /**
         * Function: animateContent
         */
        base.animateContent = function(withDelay)
        {
            if(! opt.animateContent) return;

            var current = base.$currentSlide;
            var el = current.children('.sangar-textbox');

            if(el.length <= 0) return;
                
            var enabled = el.data('anim-enable');

            if(enabled.length <= 0) return;

            var animEl = '';

            $.each(enabled,function(index,value){
                animEl += value;

                if(index + 1 < enabled.length)
                {
                    animEl += ',';
                }
            });

            var animType = el.data('anim-type') ? el.data('anim-type') : 'transition.slideDownIn';
            var animDuration = el.data('anim-duration') ? el.data('anim-duration') : 1000;
            var animStagger = el.data('anim-stagger') ? el.data('anim-stagger') : 250;

            // do velocity
            if(withDelay)     
            {
                current.find(animEl).css('visibility','hidden');

                setTimeout(function() {                    
                    current.find(animEl).velocity(animType, {                        
                        duration: animDuration,
                        stagger: animStagger,
                        visibility: 'visible'
                    });
                }, 1);
            }
            else
            {
                current.find(animEl).css('visibility','hidden');
                current.find(animEl).velocity(animType, {
                    delay: opt.animationSpeed,
                    duration: animDuration,
                    stagger: animStagger,
                    visibility: 'visible'
                });
            }
        }
    }
})(jQuery);