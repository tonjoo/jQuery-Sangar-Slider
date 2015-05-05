#Sangar Slider

Modern jQuery slider for your project. Available as jQuery plugin and WordPress plugin.

Sangar slider is responsive and mobile ready with touch support.

Feature :

1. Responsive and touch ready
2. Full width slider
3. Content Slider
4. Multiple pagination type : bullet , text and image
5. Javascript API to control the slide using external component

You can try the slider here :

**[Example Page](http://tonjoo.com/demo/jQuery-Sangar-Slider/demo/sample-standart-pagination.html)**

##License

Sangar slider is available under dual license : [GPLv2](http://www.gnu.org/licenses/gpl-2.0.html) and [Tonjoo License](#)  

##Component Used

Sangar slider require the last version of:

1. jQuery
2. jQuery migrate
3. touchSwipe
4. imagesloaded

##Installation

####Initialize style

```
<link rel="stylesheet" href="css/sangarSlider.css" type="text/css">
<link rel="stylesheet" href="css/sangar-skin-default.css" type="text/css">
```

####Initialize jQuery

```
<script type="text/javascript" src="js/jquery.js"></script>
<script type="text/javascript" src="js/jquery-migrate.min.js"></script>
<script type="text/javascript" src="js/jquery.touchSwipe.min.js"></script>
<script type="text/javascript" src="js/imagesloaded.min.js"></script>
<script type="text/javascript" src="js/jquery.sangarSlider.js"></script>
```

####Initialize plugin

```
jQuery(document).ready(function($) {
    $('#sangar-example').sangarSlider();
})	
```

####HTML structure

```
<div class='sangar-slideshow-container' id='sangar-example'>
	<div class='sangar-content-wrapper' style='display:none;'>
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
        <div class='sangar-content'>
        	<img src='images/slide-5.jpg' />
		</div>
    </div>
</div>
```

##Options

####Default options

```
animation : 'horizontal-slide',
animationSpeed : 600,
continousSliding : true,
showAllSlide : false,
timer :  false,
advanceSpeed : 3000,
pauseOnHover : true,
startClockOnMouseOut : true,
startClockOnMouseOutAfter : 800,
directionalNav : 'autohide',
directionalNavShowOpacity : '0.9'
directionalNavHideOpacity : '0.1',
directionalNavNextClass : 'exNext',
directionalNavPrevClass : 'exPrev',
pagination : 'bullet',
paginationContent : ["Lorem Ipsum", "Dolor Sit", "Consectetur", "Do Eiusmod", "Magna Aliqua"],
paginationContentType : 'text',
paginationContentWidth : 120,
paginationImageHeight : 90,
paginationContentFullWidth : false,
paginationExternalClass : 'exPagination',
skinClass : 'sangar-skin-default',
width : 650,
height : 400,
scaleSlide : false,
scaleImage : true,
fixedHeight : true,
background: "#222222",
imageVerticalAlign : 'middle',
jsOnly : false
```

####Options Details

| Name | Value | Description |
|--------|--------|--------|
|animation|horizontal-slide, vertical-slide, fade|Slide Animations|
|animationSpeed|[number]|How fast animtions are|
|continousSliding|true, false|Keep sliding without rollback|
|showAllSlide|true, false|Show all previous and next slides|
|timer|true, false|Use the timer to autoplay|
|advanceSpeed|[number]|If timer is enabled, time between transitions|
|pauseOnHover|true, false|If you hover pauses the slider|
|startClockOnMouseOut|true, false|If clock should start on MouseOut|
|startClockOnMouseOutAfter|[number]|How long after MouseOut should the timer start again|
|directionalNav|autohide, show, none|Directional Navigation|
|directionalNavShowOpacity|[float from 0 to 1]| |
|directionalNavHideOpacity|[float from 0 to 1]| |
|directionalNavNextClass|[class name]|External link ( a ) next class|
|directionalNavPrevClass|[class name]|External link ( a ) prev class|
|pagination|bullet, content, none|Slideshow pagination|
|paginationContent|[array string]|Can be text, image, or something|
|paginationContentType|text, image| |
|paginationContentWidth|[number]|Pagination content width in pixel|
|paginationImageHeight|[number]|Pagination image height|
|paginationContentFullWidth|true, false|Scale width to 100% if the container larger than total width|
|paginationExternalClass|[class name]|If you use your own list (li) for pagination|
|skinClass|[skin name]| |
|width|[number]|Slideshow width|
|height|[number]|Slideshow height|
|scaleSlide|true, false|Slider will scale to the container size|
|scaleImage|true, false|Images will scale to the slider size|
|fixedHeight|true, false|Height will fixed on scale|
|background|[color code]|Container background color, leave blank will set to transparent|
|imageVerticalAlign|top, middle, bottom| |
|jsOnly|true, false|Use jQuery only, disable CSS3|



