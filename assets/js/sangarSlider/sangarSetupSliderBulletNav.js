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
                spagination = base.$sangarWrapper.find('ul.sangar-pagination-text');

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
                    each_width = paginationWidth / base.numberSlides;
                    total_width = each_width * base.numberSlides;
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
                    if(opt.pagination == 'text' || opt.pagination == 'image') this.beginSlideBullet();
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