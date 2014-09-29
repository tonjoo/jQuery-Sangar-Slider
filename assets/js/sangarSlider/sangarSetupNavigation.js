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
                var directionalNavHTML = '<div class="sangar-slider-nav ' + base.captionPosition + '"><span class="sangar-arrow-right"></span><span class="sangar-arrow-left"></span></div>';
                base.$sangarWrapper.append(directionalNavHTML);
                var leftBtn = base.$sangarWrapper.children('div.sangar-slider-nav').children('span.sangar-arrow-left'),
                    rightBtn = base.$sangarWrapper.children('div.sangar-slider-nav').children('span.sangar-arrow-right');
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
            var bulletHTML = '<ul class="sangar-pagination sangar-pagination-' + opt.pagination + '"></ul>';

            var bulletHTMLWrapper = "<div class='sangar-bullet-wrapper'></div>";
            
            base.$sangarWrapper.append(bulletHTML);
            base.$pagination = base.$sangarWrapper.children('ul.sangar-pagination');

            for (i = 0; i < base.numberSlides; i++) 
            {
                var liMarkup = jQuery('<li class="sangar-slideshow-nav-pagination"></li>');

                if (opt.pagination == 'text' || opt.pagination == 'image') 
                {
                    var paginationContent = opt.paginationContent.length > 0 ? opt.paginationContent[i] : "";
                    var liMarkup = $('<li class="sangar-slideshow-nav-pagination">' + paginationContent + '</li>');
                }

                base.$sangarWrapper.children('ul.sangar-pagination').append(liMarkup);
                liMarkup.data('index', i);
                liMarkup.click(function () {                        
                    base.stopSliderLock();
                    base.shift($(this).data('index'), true);
                });
            }
           
            base.$pagination.wrap("<div class='sangar-pagination-wrapper " + base.captionPosition + "' />");                              
            base.bulletObj.setActiveBullet();

            // if (opt.pagination == 'none')
            // {                
            //     base.$pagination.css('display','none');
            // }
        }
    }

})(jQuery);