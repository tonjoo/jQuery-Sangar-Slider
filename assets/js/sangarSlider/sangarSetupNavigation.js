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
         * Function: showAllSlideNav
         */
        this.showAllSlideNav = function()
        {
            var btn = base.$sangarWrapper.children('div.sangar-slider-nav').children('span');
            var wrapperWidth = base.$sangarWrapper.width();
            var navWidth = (wrapperWidth - base.sangarWidth) / 2;

            btn.css({
                'top': 0,
                'margin-top': 0,
                'background': 'none',
                'width': navWidth + 'px',
                'height': base.sangarHeight + 'px'
            })
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