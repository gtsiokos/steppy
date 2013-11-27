$(function(){
  STEPS_NUM = 32;
  PATTERNS_NUM = 7;
  INTERVAL = undefined;
  TEMPO = 125;

  var sequences = [];
  var $steps_parent = $('.steps');
  var $steps = $('.steps .step');
  var $play_button = $('#play-btn');
  var $tempo_button = $('#tempo-btn');

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
  var current_step = 0;
  var is_playing = false;

  var select_step = function(id){
    current_step = id;
    selected = sequences[id];
    $steps.parent('.steps').attr('data-current',id);
  };

  var set_interval = function(){
    console.log('tempo: ',TEMPO);
    if(!is_playing) return;
    if(INTERVAL) Ticker.clear(INTERVAL);
    INTERVAL = undefined;
    INTERVAL = Ticker.interval(function(){
      beat();
    },TEMPO);
  };

  var play = function(){
    if(is_playing) return;
    is_playing = true;
    set_interval();
  };

  var pause = function(){
    if(!is_playing) return;
    is_playing = false;
    Ticker.clear(INTERVAL);
    INTERVAL = undefined;
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

  $tempo_button.on(tap.start,function(){
    if($tempo_button.attr('data-toggle') == 'on'){
      $tempo_button.attr('data-toggle','off');
      Screen.go_to(1);
    } else {
      $tempo_button.attr('data-toggle','on');
      Screen.go_to(0);
    }
  });

  window.Tempo = (function(){
    var self = {};
    var el = $('#tempo-bind');
    var bpm;
    var tempo;

    var convert_bpm = function(bpm_num){
      return ((60/bpm_num)/4)*1000;
    };

    bpm = 125;
    tempo = convert_bpm(125);

    var is_ok = function(num){
      return (bpm+num > 220 || bpm-num < 20) ? false : true;
    };

    self.get = function(){
      return tempo;
    };

    self.set = function(num){
      bpm = num;
      tempo = convert_bpm(num);
    };

    self.add = function(num){
      if(!is_ok(num)) return;
      self.set(bpm+num);
    };

    self.remove = function(num){
      if(!is_ok(num)) return;
      self.set(bpm-num);
    };

    self.increase = function(){
      self.add(1);
    };

    self.decrease = function(){
      self.remove(1);
    };

    self.render = function(){
      el.html(bpm);
      TEMPO = tempo;
      set_interval();
    };
    
    return self;
  })();

  window.Screen = (function(){
    var self = {};
    var el = $('.screen .monitor');
    var index = 0;
    var current_view_id = 1;
    var max_index;

    var view = {
      pattern: el.find('.pattern-view'),
      tempo: el.find('.tempo-view'),
    };

    self.events = (function(){
      var left_arrow_btn = $('#left-arrow-btn');
      var right_arrow_btn = $('#right-arrow-btn');

      left_arrow_btn.on(tap.start, function(){
        if($tempo_button.attr('data-toggle') == 'on'){
          Tempo.decrease();
          Tempo.render();
        } else {
          index = index-1;
          self.render();
        }
      });

      right_arrow_btn.on(tap.start, function(){
        if($tempo_button.attr('data-toggle') == 'on'){
          Tempo.increase();
          Tempo.render();
        } else {
          index = index+1;
          self.render();
        }
      });

    })();
    
    self.go_to = function(id){
      current_view_id = id;
      el.find('.panel').removeClass('selected');
      el.find(".panel[data-id='"+id+"']").addClass('selected');
    };

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
});