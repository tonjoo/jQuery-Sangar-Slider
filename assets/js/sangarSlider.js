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
                        img.attr("naturalwidth",this.naturalWidth);
                        img.attr("naturalheight",this.naturalHeight);
                    });
            });
            
            // Setup all items
            base.initOutsideTextbox();
            base.setupLayout();            
            base.setupTimer();
            base.setupDirectionalNav();            
            base.bulletObj = new base.setupSliderBulletNav();
            base.setupBulletNav();
            base.setupSwipeTouch();            

            // do first force loading
            base.doLoading(true);

            // Initialize and show slider after all content loaded
            $(base.$slideWrapper.children()).imagesLoaded( function() {
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

                // First reset slider, mean initialize slider
                base.resetSlider();
            });

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
        paginationContent : ["Lorem Ipsum", "Dolor Sit", "Consectetur", "Do Eiusmod", "Magna Aliqua"], // can be text, image, or something
        paginationContentType : 'text', // text, image
        paginationContentWidth : 120, // pagination content width in pixel
        paginationImageHeight : 90, // pagination image height
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
        forceHeight: false, // not responsive mode
        jsOnly : false // for development testing purpose
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