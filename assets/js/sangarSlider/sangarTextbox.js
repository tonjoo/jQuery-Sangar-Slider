var sangarTextbox;

;(function($) {

    sangarTextbox = function(base, opt) {

        var textboxContent = [],
            pagination,
            paginationBottom,
            isSetPaginationBottom = false;

		/**
         * Function: initOutsideTextbox
         */
        this.initOutsideTextbox = function()
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
                            'background': opt.background
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
         * Function: setOutsideTextbox
         */
        this.setOutsideTextbox = function()
        {
            if(! opt.textboxOutside) return;

            if(textboxContent[base.activeSlide])
            {
                base.$outsideTextbox.html(textboxContent[base.activeSlide]);
                var activeTextboxContent = base.$outsideTextbox.children('.sangar-textbox-content');
                var textboxHeight = activeTextboxContent.outerHeight();

                activeTextboxContent.hide();

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
                base.$el.animate({
                    height: base.origHeight + textboxHeight
                }, opt.animationSpeed);

                activeTextboxContent.fadeIn(opt.animationSpeed);

                base.$sangarWrapper.height(base.origHeight + textboxHeight);
            }

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
    }

})(jQuery);