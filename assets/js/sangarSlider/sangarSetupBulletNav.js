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

                if (opt.pagination == 'content-horizontal' && opt.paginationContentType == 'text') 
                {
                    var paginationContent = opt.paginationContent.length > 0 ? opt.paginationContent[i] : "";
                    var liMarkup = $('<li class="sangar-slideshow-nav-pagination">' + paginationContent + '</li>');
                }
                else if (opt.pagination == 'content-horizontal' && opt.paginationContentType == 'image')
                {
                    var paginationContent = opt.paginationContent.length > 0 ? opt.paginationContent[i] : "";
                    var liMarkup = $('<li class="sangar-slideshow-nav-pagination"><img style="border-radius: 3px;" src="' + paginationContent + '" width="' + (opt.paginationContentWidth - 5) + '" height="' + opt.paginationImageHeight + '"></li>');      
                }
                else if (opt.pagination == 'content-vertical' && opt.paginationContentType == 'text') 
                {
                    var paginationContent = opt.paginationContent.length > 0 ? opt.paginationContent[i] : "";
                    var liMarkup = $('<li class="sangar-slideshow-nav-pagination">' + paginationContent + '</li>');
                }
                else if (opt.pagination == 'content-vertical' && opt.paginationContentType == 'image')
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
           
            base.$pagination.wrap("<div class='sangar-pagination-wrapper wrapper-" + opt.pagination + "' />");                              
            base.bulletObj.setActiveBullet();


            /** 
             * if bullet
             */
            if(opt.pagination == 'bullet')
            {
                var eachBullet = base.$pagination.children('li');
                var bulletsWidth = eachBullet.outerWidth(true) * base.numberSlides;
                
                var bulletsMargin = 0;

                eachBullet.each(function(index){
                    var left = $(this).css('margin-left').slice(0,-2);
                    var right = $(this).css('margin-right').slice(0,-2);

                    if(isNaN(left)) left = 0;
                    if(isNaN(right)) right = 0;

                    bulletsMargin = bulletsMargin + parseInt(left) + parseInt(right);
                });

                bulletsWidth = bulletsWidth + bulletsMargin;

                base.$pagination.parent().css({
                    'left': '50%',
                    'margin-left': '-' + (bulletsWidth / 2) + 'px'
                });
            }
        
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
         * Function: setupSliderBulletNav
         */
        this.setupSliderBulletNav = function()
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

            var eachWidth = opt.paginationContentWidth;            
            var totalWidth = eachWidth * base.numberSlides;

            var eachHeight = 0;
            var totalHeight = 0;

            // vertical or horizontal
            var dirType = opt.pagination;
                dirType = dirType.substring(8);

            
            /**
             * generate slide bullet 
             * this function will be recall every slideshow resized
             */
            this.generateSlideBullet = function()
            {
                spagination = base.$sangarWrapper.find('ul.sangar-pagination-' + opt.pagination);
                parentWidth = spagination.parent().outerWidth(true);

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
                                
                setupBulletPosition(); // vertical or horizontal
                setupPaginationWidth(); // vertical or horizontal
                setupWalkingPagination(); // vertical or horizontal

                function setupBulletPosition()
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
                        spagination.css('width', totalWidth + 'px');
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
                base.beforeSlideChange(); // before slide function

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
        this.verticalTextPaginationSetWidth = function()
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