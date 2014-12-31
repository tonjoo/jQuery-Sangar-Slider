var sangarCaption;

;(function($) {

    sangarCaption = function(base, opt) {

		/**
         * Function: setCaptionPosition
         */
        this.setCaptionPosition = function()
        {
            caption = base.$slides.eq(base.activeSlide).find('div.sangar-caption');

            if(caption.length)
            {
                base.captionPosition = caption.attr('class').replace('sangar-caption ','');
            }
            else
            {
                base.captionPosition = "undefined";
            }

            //set active caption position to bullet and navigation
            base.$sangarWrapper.find('div.sangar-pagination-wrapper').addClass(base.captionPosition);
            base.$sangarWrapper.find('div.sangar-slider-nav').addClass(base.captionPosition);
        }
    }

})(jQuery);