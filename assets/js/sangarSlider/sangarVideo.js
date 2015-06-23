var sangarVideo;

;(function($) {

    sangarVideo = function(base, opt) {

        /**
         * Function: playVideo
         */
        base.playVideo = function()
        {
            var video = base.$currentSlide.children('video');

            if(video[0])
            {
                base.setVideoCentered(video);
                video[0].load();
                video[0].currentTime = 0.1;

                if(! base.$prevSlide) //if first slide
                {
                    video[0].play();
                }
                else
                {
                    setTimeout(function() {
                        video[0].play();
                    }, opt.animationSpeed);
                }

                if(opt.html5VideoNextOnEnded)
                {
                    video[0].onended = function(e) {
                        base.shift('next');
                    };
                }
                else
                {
                    video.attr('loop','loop');
                }
            }

            // pause prev video 
            if(base.$prevSlide)
            {
                base.pauseVideo(base.$prevSlide);
            }
        }

        /**
         * Function: pauseVideo
         */
        base.pauseVideo = function(slide)
        {            
            // html 5 video
            var video = slide.children('video');

            if(video[0])
            {
                setTimeout(function() {
                    video[0].pause();
                }, opt.animationSpeed);
            }

            // vimeo and youtube
            var iframe = slide.children('iframe');

            if(iframe[0])
            {
                setTimeout(function() {
                    var src = iframe.attr('src');

                    iframe.attr('src','');
                    iframe.attr('src',src);            
                }, opt.animationSpeed);
            }            
        }

        /**
         * Function: setVideoCentered
         */
        base.setVideoCentered = function(currentSlide)
        {
            var domVideo = currentSlide[0];
            var attr = currentSlide.attr('centered');

            if (typeof attr === typeof undefined || attr === false) 
            {
                // show loading
                base.setLoading(base.$currentSlide,'show');

                domVideo.onloadedmetadata = function() {
                    var vidWidth = this.videoWidth;
                    var vidHeight = this.videoHeight;

                    var minusResize = base.sangarWidth - vidWidth;
                    var percentMinus = (minusResize / vidWidth) * 100;
                    var realHeight = vidHeight + (vidHeight * percentMinus / 100);
                        realHeight = Math.round(realHeight);

                    var margin = (realHeight - base.sangarHeight) / 2;
                        margin = Math.round(margin);

                    currentSlide
                        .css('margin-top','-' + margin + 'px')
                        .attr('realWidth',base.sangarWidth)
                        .attr('realHeight',realHeight)
                        .attr('centered','true');

                    // fadeOut loading
                    base.setLoading(base.$currentSlide,'fadeOut');
                };
            }
            else
            {
                var vidWidth = parseInt(currentSlide.attr('realWidth'))
                var vidHeight = parseInt(currentSlide.attr('realHeight'));

                var minusResize = base.sangarWidth - vidWidth;

                if(minusResize < 0) minusResize * -1;

                var percentMinus = (minusResize / vidWidth) * 100;
                var realHeight = vidHeight + (vidHeight * percentMinus / 100);
                    realHeight = Math.round(realHeight);

                var margin = (realHeight - base.sangarHeight) / 2;
                    margin = Math.round(margin);

                currentSlide
                    .css('margin-top','-' + margin + 'px')
                    .attr('realWidth',base.sangarWidth)
                    .attr('realHeight',realHeight);

                // force hide/fadeOut the loading element if it still there
                base.setLoading(base.$currentSlide,'fadeOut');
            }
        }
    }
})(jQuery);