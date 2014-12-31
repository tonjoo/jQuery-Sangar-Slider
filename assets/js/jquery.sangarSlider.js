/**
 * Tonjoo Responsive Slideshow
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
        'animationSpeed' : 1000, // how fast animtions are
        'continousSliding' : true, // only works for horizontal-slide and vertical-slide
        'timer' :  true, // true or false to have the timer
        'advanceSpeed' : 3000, // if timer is enabled, time between transitions
        'pauseOnHover' : true, // if you hover pauses the slider
        'startClockOnMouseOut' : false, // if clock should start on MouseOut
        'startClockOnMouseOutAfter' : 800, // how long after MouseOut should the timer start again
        'directionalNav' : 'autohide', // autohide, show, none
        'directionalNavShowOpacity' : '0.9', // from 0 to 1
        'directionalNavHideOpacity' : '0.1', // from 0 to 1
        'pagination' : 'bullet', // bullet, text, image, none
        'paginationContent' : [], // can be text, image, or something
        'paginationContentWidth': 200, // pagination content width in pixel
        'skinClass' : 'sangar-skin-default', // default: sangar-skin-default
        'width' : 500, // slideshow width (actually max-width)
        'height' : 270, // slideshow height (will auto generate if width changed by browser size)
        'jsOnly' : false // for development testing purpose
    };

    $.fn.sangarSlider = function(options) 
    {
        var base = this;
        var opt = $.extend({}, $.sangarSlider.defaults, options);
        var plugin = new $.sangarSlider(base, opt);

        base.doShift = function(value)
        {
            plugin.stopSliderLock();
            plugin.shift(value, true);
        }

        // external pagination shift
        var paginationClass = opt.paginationExternalClass;

        if(paginationClass != "" && $('.' + paginationClass).length)
        {
            $('.' + paginationClass).click(function(){
                base.doShift($('.' + paginationClass).index(this));
            })
        }

        // external navigation shift
        var nextClass = opt.directionalNavNextClass;
        var prevClass = opt.directionalNavPrevClass;

        if(nextClass != "" && $('.' + nextClass).length)
        {
            $('.' + nextClass).click(function(){
                base.doShift('next');
            })
        }

        if(prevClass != "" && $('.' + prevClass).length)
        {
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