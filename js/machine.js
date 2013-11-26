$(function(){
  var STEPS_NUM = 32;
  var PATTERNS_NUM = 7;
  var sequences = [];
  var $steps_parent = $('.steps');
  var $steps = $('.steps .step');
  var $play_button = $('#play-btn');

  var fill_empty_sequence = function(){
    var seq = [];
    for(var i=0; i<STEPS_NUM; i++){
      seq.push(0);
    }
    return seq;
  };

  var play_pattern = function(id){
    lowLag.play(id);
  };

  lowLag.init({'urlPrefix':''});
  for(var i=0; i<PATTERNS_NUM; i++){
    lowLag.load(['sound_pack/'+i+'/sound.wav'],i+'');
    sequences.push(fill_empty_sequence());
  }

  var n=0;
  function beat() {
    if(n<STEPS_NUM-1){
      n++;
    }
    else {
      n=0;
    }

    for(var i=0; i<PATTERNS_NUM; i++){
      if(sequences[i][n]===1){
        play_pattern(i);
      }
    }

    $steps.removeClass('active');
    $steps_parent.find("[data-id='"+n+"']").addClass('active');
    //console.log('running...', n);
  }

  var selected = sequences[0];
  var tempo;
  var interval;
  var current_step = 0;
  var is_playing = false;

  var select_step = function(id){
    current_step = id;
    selected = sequences[id];
    $steps.parent('.steps').attr('data-current',id);
  };

  var set_tempo = function(value){
    tempo = ((60/120)/4)*1000;
  };

  var play = function(){
    console.log('tempo: ',tempo);
    if(is_playing) return;
    is_playing = true;
    interval = Ticker.interval(function(){
      beat();
    },tempo);
  };

  var pause = function(){
    if(!is_playing) return;
    is_playing = false;
    Ticker.clear(interval);
    interval = undefined;
  };

  $steps.on(tap.start,function(){
    var id = $(this).data('id');
    if (selected[id] === 0) {
      selected[id]=1;
    }
    else {
      selected[id] = 0;
    }
    $(this).toggleClass('p'+current_step);
  });

  $play_button.on(tap.start,function(){
    if(is_playing){
      $play_button.attr('data-toggle','on');
      pause();
    } else {
      $play_button.attr('data-toggle','off');
      play();
    }
  });

  window.Screen = (function(){
    var self = {};
    var el = $('.screen .monitor');
    var index = 0;
    var max_index;

    var view = {
      pattern: el.find('.pattern-view'),
      tempo: el.find('.tempo-view'),
    };

    self.events = (function(){
      var left_arrow_btn = $('#left-arrow-btn');
      var right_arrow_btn = $('#right-arrow-btn');
      var tempo_btn;

      left_arrow_btn.on(tap.start, function(){
        index = index-1;
        self.render();
      });

      right_arrow_btn.on(tap.start, function(){
        index = index+1;
        self.render();
      });

    })();
    
    self.view = (function(id){
      var that = {};

      that.go_to = function(){

      };

      return that;
    })();

    self.render = function(){
      max_index = $('.pattern-view .pattern').length-1;
      if(index>max_index){
        index = 0;
      }
      if(index<0){
        index = max_index;
      }

      view.pattern.find('.pattern').removeClass('selected');
      view.pattern.find(".pattern[data-id='"+index+"']").addClass('selected');
      select_step(index);
    };

    self.render();
    return self;
  })();

  set_tempo();
});