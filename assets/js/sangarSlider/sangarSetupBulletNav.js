var sangarSetupBulletNav;

;(function($) {

    sangarSetupBulletNav = function(base, opt) {

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

        /**
         * Function: setupSliderBulletNav
         */
        this.setupSliderBulletNav = function()
        {
            var spagination = 0;
            var parentWidth = 0;
            var paginationWalkingWidth = 0;            
            var paginationMaxShowedIndex = 0;
            var paginationBackChild = 0;
            var paginationNextChild = 0;
            var paginationOffsetWidth = 0;
            var paginationPosition = 0;                        
            var paginationOffsetEnable = false;
            var paginationWidth = 0;
            var paginationMovedWidth = 0;

            var eachWidth = opt.paginationContentWidth;
            var totalWidth = eachWidth * base.numberSlides;

            
            /**
             * generate slide bullet 
             * this function will be recall every slideshow resized
             */
            this.generateSlideBullet = function()
            {
                spagination = base.$sangarWrapper.find('ul.sangar-pagination-content');
                parentWidth = spagination.parent().outerWidth(true);

                paginationWalkingWidth = 0;
                paginationMaxShowedIndex = 0;
                paginationBackChild = 0;
                paginationNextChild = 0;
                paginationOffsetWidth = 0;
                paginationPosition = 0;                        
                paginationOffsetEnable = false;              
                paginationWidth = spagination.parent().outerWidth(true);

                if(paginationWidth > totalWidth)
                {
                    if(opt.paginationContentFullWidth)
                    {
                        eachWidth = paginationWidth / base.numberSlides;
                        totalWidth = eachWidth * base.numberSlides;
                    }
                    else paginationWidth = totalWidth;                  
                }
                                
                spagination.parent().css('overflow', 'hidden');
                spagination.css('background-color', spagination.children('li').last().css("background-color"));
                spagination.children('li.sangar-slideshow-nav-pagination').css('width',eachWidth + 'px');                
                spagination.css('width', totalWidth + 'px');

                spagination.find('li').each(function () {
                    paginationWalkingWidth += eachWidth;

                    if (paginationWalkingWidth + eachWidth > paginationWidth) 
                    {
                        paginationNextChild = $(this).index();
                        paginationMaxShowedIndex = paginationNextChild;
                    }
                    
                    if (paginationWalkingWidth > paginationWidth) 
                    {
                        $(this).addClass('sangar-bullet-sliding-next');
                        paginationOffsetWidth = paginationWalkingWidth - paginationWidth;

                        /* detect if pagination offset is too large */
                        if(paginationOffsetWidth < eachWidth)
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
                        paginationNavPixelWidth = (eachWidth * paginationPosition) + paginationOffsetWidth;
                    }
                    else
                    {
                        spagination.children('li').removeClass('sangar-bullet-sliding-back').removeClass('sangar-bullet-sliding-next');

                        paginationPosition++;
                        paginationBackChild++;
                        paginationNextChild++;

                        paginationNavPixelWidth = (eachWidth * paginationPosition) + paginationOffsetWidth;
                    }

                    slideBulletAddClass('sliding_one','sangar-bullet-sliding-one-back',paginationBackChild + 1)            
                }
                else if(navigate == 'back')
                {
                    spagination.children('li').removeClass('sangar-bullet-sliding-back').removeClass('sangar-bullet-sliding-next');

                    paginationPosition--;
                    paginationBackChild--;
                    paginationNextChild--;

                    paginationNavPixelWidth = eachWidth * paginationPosition;

                    slideBulletAddClass('sliding_one','sangar-bullet-sliding-one-next',paginationNextChild - 1)
                }
                else if(navigate == 'first')
                {
                    spagination.children('li').removeClass('sangar-bullet-sliding-back').removeClass('sangar-bullet-sliding-next');

                    paginationPosition = 0;
                    paginationBackChild = 0;                    
                    paginationNextChild = paginationMaxShowedIndex;

                    paginationNavPixelWidth = eachWidth * paginationPosition;

                    slideBulletAddClass('sliding_one','sangar-bullet-sliding-one-next',paginationNextChild - 1)
                }
                else if(navigate == 'last')
                {
                    spagination.children('li').removeClass('sangar-bullet-sliding-back').removeClass('sangar-bullet-sliding-next');

                    var numberBulletsByIndex = base.numberSlides - 1;

                    paginationPosition = numberBulletsByIndex - paginationMaxShowedIndex;
                    paginationBackChild = numberBulletsByIndex - paginationMaxShowedIndex;
                    paginationNextChild = numberBulletsByIndex;

                    paginationNavPixelWidth = (eachWidth * paginationPosition) + paginationOffsetWidth;

                    slideBulletAddClass('sliding_one','sangar-bullet-sliding-one-back',paginationBackChild + 1)
                }

                /**
                 * Track moved width
                 */
                paginationMovedWidth = paginationNavPixelWidth;
                
                if(parentWidth < totalWidth)
                {
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

                if(parentWidth < totalWidth)
                {
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