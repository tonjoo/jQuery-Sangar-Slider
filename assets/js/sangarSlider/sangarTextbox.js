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
        this.initOutsideTextboxDimension = function()
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
        this.setOutsideTextbox = function()
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
        this.animateContent = function(withDelay)
        {
            if(! opt.animateContent) return;

            var el = base.$currentSlide.children('.sangar-textbox');

            if(el.length <= 0) return;
                
            var enabled = el.data('anim-enable');

            if(enabled.length <= 0) return;

            var animEl = '';

            $.each(enabled,function(index,value){
                animEl += '.sangar-content.active-slide ' + value;

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
                $(animEl).css('visibility','hidden');

                setTimeout(function() {                    
                    $(animEl).velocity(animType, {                        
                        duration: animDuration,
                        stagger: animStagger,
                        visibility: 'visible'
                    });
                }, 1);
            }
            else
            {
                $(animEl).css('visibility','hidden');
                $(animEl).velocity(animType, {
                    delay: opt.animationSpeed,
                    duration: animDuration,
                    stagger: animStagger,
                    visibility: 'visible'
                });
            }
        }
    }
})(jQuery);