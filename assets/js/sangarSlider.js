/**
 * Sangar Slider
 * Copyright 2014, Tonjoo
 * Sangar slider is available under dual license : GPLv2 and Tonjoo License
 * http://www.gnu.org/licenses/gpl-2.0.html
 */

;(function($) {

    var sangarSliderClasses = [];

    $.sangarSlider = function(el, opt) {

        var base = this, imgCount = 0,
            imgWidth = [], imgHeight = [];

        base.el = el;
        base.$el = $(base.el);
        
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
        sangarVideo.call($.sangarSlider.prototype, base, opt);

        /**
         * Initial variable
         */
        base.activeSlide = 0;
        base.activeSlideContinous = 0;
        base.numberSlides = 0;
        base.continous_count_position = 0;
        base.sangarId = "#" + base.randomString();

        /**
         * Function: initiate
         */
        base.initialize = function()
        {            
            base.onInit(); // Run functions on slide init

            base.$el.addClass('sangar-slideshow-container');
            base.$el.wrapInner('<div class="sangar-content-wrapper" />');
            base.$slideWrapper = base.$el.children('.sangar-content-wrapper');
            base.$sangar = base.$slideWrapper.wrap('<div class="sangar-slideshow-content" />').parent();
            base.$sangarWrapper = base.$sangar.wrap('<div id="' + base.sangarId + '-slideshow" class="sangar-wrapper ' + opt.themeClass.toLowerCase() + '" />').parent();
            
            base.old_responsive_class = 'responsive-full';
            base.responsiveClassLock = false;
            
            base.lock(); // Lock slider before all content loaded            
            base.$sangar.add(base.sangarWidth)
            base.$slides = base.$slideWrapper.children('div.sangar-content'); // Initialize slides

            base.initFirstRun(); // initialize first run

            base.$slides.each(function (index,slide) {
                var index = base.numberSlides;
                var img = $(this).children('img');
                
                base.numberSlides++;
                base.activeSlideContinous++;

                // indexing each slide
                $(this).attr('index',index);

                if(img.length > 0) {
                    img.attr('index',imgCount++);    
                }                
            });
            
            // imagesLoaded
            base.$slideWrapper.imagesLoaded()
                .progress( function( instance, image ) {
                    // collecting slide img original size
                    if($(image.img).parent().attr('class') == 'sangar-content')
                    {
                        var index = $(image.img).attr('index');

                        imgWidth[index] = image.img.width;
                        imgHeight[index] = image.img.height;
                    }
                })
                .always( function( instance ) {
                    // store image original size
                    base.imgWidth = imgWidth;
                    base.imgHeight = imgHeight;

                    // setup items after all image is loaded
                    base.initOutsideTextbox();
                    base.setupLayout(); // base.$slides should run before this
                    base.setupTimer();
                    base.setupDirectionalNav();
                    base.setupBulletNav();
                    base.bulletObj = new base.setupSliderBulletNav();                    
                    base.setupSwipeTouch();

                    base.runSlideshow(); // run after all completely loaded
                });


            // Window event resize window
            $(window).resize(function() {
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
        animation : 'horizontal-slide', // horizontal-slide, vertical-slide, fade
        animationSpeed : 700, // how fast animtions are
        continousSliding : true, // keep sliding without rollback
        carousel : false, // carousel mode
        carouselWidth : 60, // width in percent
        carouselOpacity : 0.3, // opacity for non-active slide
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
        paginationContent : ["Lorem Ipsum", "Dolor Sit", "Consectetur", "Do Eiusmod", "Magna Aliqua"], // can be text, image url, or something
        paginationContentType : 'text', // text, image
        paginationContentOpacity : 0.8, // pagination content opacity. working only on horizontal content pagination
        paginationContentWidth : 120, // pagination content width in pixel
        paginationImageHeight : 90, // pagination image height
        paginationImageAttr : ["", "", "", "", ""], // optional attribute for each image pagination
        paginationContentFullWidth : false, // scale width to 100% if the container larger than total width                 
        paginationExternalClass : 'exPagination', // if you use your own list (li) for pagination
        html5VideoNextOnEnded : false, // force go to next slide if HTML5 video is ended, if false, do looping
        textboxOutside : false, // put the textbox to bottom outside
        themeClass : 'default', // sangar slider theme
        width : 850, // slideshow base width
        height : 500, // slideshow base height
        fullWidth : false, // slideshow width (and height) will scale to the container size
        fullHeight : false, // slideshow height will resize to browser height
        minHeight : 300, // slideshow min height
        maxHeight : 0, // slideshow max height, set to '0' (zero) to make it unlimited        
        scaleImage : true, // images will scale to the slider size        
        background: '#222222', // container background color, leave blank will set to transparent
        imageVerticalAlign : 'middle', // top, middle, bottom -- working only while scaleImage
        disableLoading : false, // disable loading animation
        forceSize: false, // make slideshow to force use width and height option, no responsive
        animateContent : false, // animated the content (textbox). this option require velocity.js and velocityui.js to work
        jsOnly : false, // for development testing purpose
        onInit : function(){ /* run function on init */ },
        onReset : function(width,height){ /* run function on first loading and resize slide */ },
        beforeLoading : function(){ /* run function before loading */ },
        afterLoading : function(){ /* run function after loading */ },
        beforeChange : function(activeSlide){ /* run function before slide change */ },
        afterChange : function(activeSlide){ /* run function after slide change */ }
    };

    $.fn.sangarSlider = function(options) 
    {
        var selector = this.selector;
        
        if($.inArray(selector, sangarSliderClasses) !== -1) return;

        this.each(function(){
            var base = this;        
            var opt = $.extend({}, $.sangarSlider.defaults, options);
            var plugin = new $.sangarSlider(base, opt);

            sangarSliderClasses.push(selector);

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
                
            plugin.initialize();
        });
        
        return this;
    };

})(jQuery);