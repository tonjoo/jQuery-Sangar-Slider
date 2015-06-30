#Sangar Slider

Modern jQuery slider for your project. Available as jQuery plugin and WordPress plugin.

Sangar slider is responsive and mobile ready with touch support.

Feature :

- Responsive and touch ready
- Full width slider
- Content Slider
- Multiple pagination type : bullet, text, and image
- Vertical slide
- Caurosel slide
- Javascript API to control the slide using external component
- 35+ options
- and many more awesomeness :)

You can try the slideshow here :

**[Example Page](http://tonjoo.com/demo/jQuery-Sangar-Slider/demo/sample-standart-pagination.html)**

##License

Sangar slider is available under dual license : [GPLv2](http://www.gnu.org/licenses/gpl-2.0.html) and [Tonjoo License](#)  

##External Library

Sangar slider use external library:

- jQuery v1.11.0
- imagesLoaded PACKAGED v3.1.8
- touchSwipe

And if you have enabled the `animateContent` option, you must include:

- velocity.js
- velocityui.js

##Installation

####Initialize style

```
<link rel="stylesheet" href="css/sangarSlider.css" type="text/css">
<link rel="stylesheet" href="css/sangar-skin-default.css" type="text/css">
```

####Initialize jQuery

```
<script type="text/javascript" src="js/jquery.js"></script>
<script type="text/javascript" src="js/jquery.touchSwipe.min.js"></script>
<script type="text/javascript" src="js/imagesloaded.min.js"></script>
<script type="text/javascript" src="js/jquery.sangarSlider.js"></script>
```

####Initialize plugin

```
jQuery(document).ready(function($) {
    $('.sangar-example').sangarSlider({
        width : 850,
        height : 500,
        themeClass : 'default'
    });
})
```

####HTML structure

```
<div class='sangar-example'>
    <div class='sangar-content'>
        <img src='images/slide-1.jpg' />
        <a href='http://google.com' target="_blank"></a>
    </div>
    <div class='sangar-content'>
        <img src='images/slide-2.jpg' />
        <a href='http://github.com'></a>
    </div>
    <div class='sangar-content'>
        <img src='images/slide-3.jpg' />
    </div>
    <div class='sangar-content'>
        <img src='images/slide-4.jpg' />
    </div>
</div>
```

##Options

| Name | Default Value | Accepted Values | Description |
|--------|--------|--------|--------|
|animation|`'horizontal-slide'`|[horizontal-slide, vertical-slide, fade]|Slide Animations|
|animationSpeed|`700`|number|How fast animtions are|
|continousSliding|`true`|boolean|Keep sliding without rollback|
|carousel|`false`|boolean|Carousel mode|
|carouselWidth|`60`|number|Width in percent|
|carouselOpacity|`0.3`|float (0 to 1)|Opacity for non-active slide|
|timer|`false`|boolean|Use the timer to autoplay|
|advanceSpeed|`6000`|number|If timer is enabled, time between transitions|
|pauseOnHover|`true`|boolean|If you hover pauses the slider|
|startClockOnMouseOut|`true`|boolean|If clock should start on MouseOut|
|startClockOnMouseOutAfter|`800`|number|How long after MouseOut should the timer start again|
|directionalNav|`'autohide'`|[autohide, show, none]|Directional Navigation|
|directionalNavShowOpacity|`0.9`|float (0 to 1)| |
|directionalNavHideOpacity|`0.1`|float (0 to 1)| |
|directionalNavNextClass|`'exNext'`|string|External link ( a ) next class|
|directionalNavPrevClass|`'exPrev'`|string|External link ( a ) prev class|
|pagination|`'bullet'`|[bullet, content-horizontal, content-vertical, none]|Slideshow pagination type|
|paginationBulletNumber|`false`|boolean|if true, bullet pagination will contain a slide number|
|paginationContent|`["1","2","3"]`|array string|Can be text, image url, or something|
|paginationContentType|`'text'`|[text, image]| |
|paginationContentOpacity|`0.8`|float (0 to 1)|Pagination content opacity. working only on horizontal content pagination|
|paginationContentWidth|`120`|number|Pagination content width in pixel|
|paginationImageHeight|`90`|number|Pagination image height|
|paginationImageAttr|`["", "", ""]`|array string|Optional attribute for each image pagination|
|paginationContentFullWidth|`true`|boolean|Scale width to 100% if the container larger than total width|
|paginationExternalClass|`'exPagination'`|string|If you use your own list (li) for pagination|
|html5VideoNextOnEnded|`false`|boolean|Force go to next slide if HTML5 video is ended, if false, do looping|
|textboxOutside|`false`|boolean|Put the textbox to bottom outside|
|themeClass|`'default'`|string|sangar slider theme|
|width|`850`|number|Slideshow base width|
|height|`500`|number|Slideshow base height|
|fullWidth|`false`|boolean|Slideshow width (and height) will scale to the container size|
|fullHeight|`false`|boolean|Slideshow height will resize to browser height|
|minHeight|`300`|number|Slideshow min height|
|maxHeight|`0`|number|Slideshow max height, set to '0' (zero) to make it unlimited|
|scaleImage|`true`|boolean|Images will scale to the slider size|
|background|`'#222222'`|string (color code)|Container background color, leave blank will set to transparent|
|imageVerticalAlign|`'middle'`|top, middle, bottom|Working only while scaleImage|
|disableLoading|`false`|boolean|Disable loading animation|
|forceSize|`false`|boolean|Make slideshow to force use width and height option, no responsive|
|animateContent|`false`|boolean|Animated the content (textbox). This option require velocity.js and velocityui.js to work|
|jsOnly|`false`|boolean|Use jQuery only, disable CSS3|
|onInit|`function()` `{ }`|function|Run function on init|
|onReset|`function(width,height)` `{ }`|function|Run function on first loading and resize slide|
|beforeLoading|`function()` `{ }`|function|Run function before loading|
|afterLoading|`function()` `{ }`|function|Run function after loading|
|beforeChange|`function(activeSlide)` `{ }`|function|Run function before slide change|
|afterChange|`function(activeSlide)` `{ }`|function|Run function after slide change|



