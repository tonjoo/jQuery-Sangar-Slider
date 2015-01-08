var sangarBeforeAfter;

;(function($) {

	sangarBeforeAfter = function(base, opt) {

		/**
         * Function: afterSlideChange
         */
        this.beforeSlideChange = function()
        {
            var paginationClass = opt.paginationExternalClass;

            if(paginationClass != "" && $('.' + paginationClass).length)
            {
                $("." + paginationClass).removeClass('active');
                $("." + paginationClass).eq(base.activeSlide).addClass("active");
            }
        }

        /**
         * Function: afterSlideChange
         */
        base.afterSlideChange = function()
        {
            // var timer = base.$sangarWrapper.children('div.sangar-timer');

            // timer.children('div.sangar-timer-mask')
            //      .css('width','0px')
            //      .animate({width:'100%'}, 2900);

            // console.log(opt.advanceSpeed)
        }
    }

})(jQuery);