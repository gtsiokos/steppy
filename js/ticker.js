
window.Ticker = (function(){
  var requestAnimFrame = window.requestAnimationFrame       ||
                         window.webkitRequestAnimationFrame ||
                         window.mozRequestAnimationFrame    ||
                         window.msRequestAnimationFrame     ||
                         undefined;

  var cancelAnimFrame = window.cancelAnimationFrame              ||
                        window.webkitCancelRequestAnimationFrame ||
                        window.mozCancelRequestAnimationFrame    ||
                        window.msCancelRequestAnimationFrame     ||
                        undefined;

  var shim_timeout = function(){
    var func = arguments[0];
    var delay = arguments[1];
    var args = Array.prototype.slice.call(arguments, 2);
    return setTimeout(function(){ return func.apply(null, args); }, delay);
  };

  var shim_interval = function(){
    var func = arguments[0];
    var delay = arguments[1];
    var args = Array.prototype.slice.call(arguments, 2);
    return setInterval(function(){ return func.apply(null, args); }, delay);
  };

  var delay = function(fn, delay){
    if(!requestAnimFrame){
      return shim_timeout.apply(null, arguments);
    }

    var start = new Date().getTime(),
        args = Array.prototype.slice.call(arguments, 2),
        handle = {};

    delay = delay || 0;

    var loop = function(){
      var current = new Date().getTime(),
      delta = current - start;

      delta >= delay ? fn.apply(null, args) : handle.value = requestAnimFrame(loop);
    };

    handle.value = requestAnimFrame(loop);
    return handle;
  };

  var interval = function(fn, delay){
    if(!requestAnimFrame){
      return shim_interval.apply(null, arguments);
    }

    var start = new Date().getTime(),
        args = Array.prototype.slice.call(arguments, 2),
        handle = {};

    delay = delay || 0;

    var loop = function() {
      var current = new Date().getTime(),
      delta = current - start;

      if(delta >= delay) {
          fn.apply(null, args);
          start = new Date().getTime();
      }

      handle.value = requestAnimFrame(loop);
    };

    handle.value = requestAnimFrame(loop);
    return handle;
  };

  var clear = function(handle){
    if(cancelAnimFrame){
      cancelAnimFrame(handle.value);
    } else {
      clearTimeout(handle);
      clearInterval(handle);
    }
  };

  return {delay:delay, interval:interval, clear:clear};
})();