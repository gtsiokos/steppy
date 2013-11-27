
screen.mozLockOrientation("landscape");

if((document.ontouchstart!==null)){
  var tap = {
    start: 'mousedown',
    move: 'mousemove',
    end: 'mouseup'
  };
} else {
  var tap = {
    start: 'touchstart',
    move: 'touchmove',
    end: 'touchend'
  };
}
var tap_event = ((document.ontouchstart!==null)?'click':'touchstart');

document.addEventListener("touchstart", function() {},false);

$(function(){

		var $root_divs = $('body>div:not(.screen-wrapper .view.options .content)');

    $('body').on('touchmove', false);
    $('body').on('touchmove', $root_divs, false);

    $('body').on('touchmove', '.screen-wrapper .view.options .content', function(e){
      e.stopPropagation();
    });

});