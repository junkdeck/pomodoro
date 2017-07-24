// cookie - remembers users choice for sound on page, defaults to no sound
muted = document.cookie


// create audio elements ------------------------------------------
var STARTSOUND = document.createElement("audio");
var STOPSOUND = document.createElement("audio");
// timer sounds ---------------------------------
var TOBREAK = document.createElement("audio");
var TOREST = document.createElement("audio");
var TOSESSION = document.createElement("audio");
// reset sounds -----------------------------
var RESETLAP = document.createElement("audio");
// sample loading -------------------------------------------------
TOBREAK.setAttribute("src","./sfx/to-break.ogg");
TOBREAK.setAttribute("preload", "auto");
TOREST.setAttribute("src","./sfx/to-rest.ogg");
TOREST.setAttribute("preload", "auto");
TOSESSION.setAttribute("src","./sfx/to-session.ogg");
TOSESSION.setAttribute("preload", "auto");

RESETLAP.setAttribute("src","./sfx/reset-lap.ogg");
RESETLAP.setAttribute("preload", "auto");

STARTSOUND.setAttribute("src","./sfx/start-clock.ogg");
STARTSOUND.setAttribute("preload","auto");
STOPSOUND.setAttribute("src","./sfx/stop-clock.ogg");
STOPSOUND.setAttribute("preload","auto");

var breakTime = 300;        //break timer, in seconds. defaults to 5 minutes.
var sessionTime = 1500;        //session timer, in seconds. defaults to 25 minutes.
var restTime = 1800;        //rest time, in seconds. defaults to 30 minutes.

// breakTime = 2;
// sessionTime = 2;
// restTime = 3;

var i = 0;              //current clock timer, in seconds
var lap = 0;         // keeps track of how many laps have eLAPSed
var laps = ["I","II","III","IV","V"];

var running = 0;    // boolean for keeping track of clock state
// var muted = 1;      // determines whether sound should play or not

var currentTimer = 'session';   //keeps track of which countdown is currently active - session / break / rest
var timeout = null; //timeout storage

$(document).ready(function(){
  //set current timer equal to the default session time length
  i = sessionTime;

  //creates minutes/seconds from total time in seconds, and displays them to the user
  //updateTime returns an array with the time, in the order of "seconds, minutes"
  var sessionTimeObj = updateTime(sessionTime);
  var breakTimeObj = updateTime(breakTime);
  var restTimeObj = updateTime(restTime);
  var currentTimeObj = updateTime(i);

  //updates all time displays with the newly created second/minute objects.
  updateBreakDisplay(breakTimeObj.minutes);
  updateSessionDisplay(sessionTimeObj.minutes);
  updateRestDisplay(restTimeObj.minutes);
  updateTimeDisplay(currentTimeObj);
});

function mainLoop(){
  // behavior when timer zeroes out
  // increments lap counter, determines timer type and specifies timer sounds to play
  if (i <= 0){
    if(currentTimer === 'session'){
      // increment laps after a session is over
      lap++;
      // change timer to break if laps are less than 4
      if(lap < 4){
        currentTimer = 'break';
        i = breakTime;
        playSound(TOBREAK);
      // change timer to rest if laps are 4 or more
    }else if(lap >= 4){
        currentTimer = 'rest';
        i = restTime;
        playSound(TOREST);
      }
    }else if(currentTimer === 'break' || currentTimer === 'rest'){
      if(currentTimer === 'rest'){
        // resets laps after a rest period
        lap = 0;
      }
      currentTimer = 'session';
      i = sessionTime;
      playSound(TOSESSION);
    }
    updateLapDisplay(lap);
  }
  //updates every second
  if(running === 1 && i > 0){
    i--;
    currentTimeObj = updateTime(i);
    updateTimeDisplay(currentTimeObj);
    //stores the timeout in a referral var
    timeout = setTimeout(mainLoop, 1000);
  }
}

function toggleRunning(){
  //toggles running between 0 and 1
  //uses XOR gate; outputs 1 if only one input is 1
  running ^= 1;
}

function toggleSound(){
  // see toggleRunning
  muted ^= 1;
}

function playSound(sound){
  if(muted === 0){
    sound.currentTime = 0;
    sound.play();
  }
}

function interruptTimeout(timeout){
  //interrupts the timeout if set
  if(timeout !== null){
    clearTimeout(timeout);
    timeout = null;
  }
}

function updateTimeDisplay(obj){
  //flushes the display area and appends the updated data
  var secondDisplay = $('.seconds');
  var minuteDisplay = $('.minutes');

  secondDisplay.empty().append(padZeroes(obj.seconds,2));
  minuteDisplay.empty().append(obj.minutes);
  //displays remaining time in page title
  $(document).attr('title',currentTimer.toUpperCase()+': '+obj.minutes+":"+padZeroes(obj.seconds,2)+" // POMODORO");
}
function updateTime(i){
  //creates seconds and minutes from supplied time, in seconds, and returns an object
  var seconds = Math.floor(i % 60);
  var minutes = Math.floor(i / 60);

  var timeObj = {
    seconds: seconds,
    minutes: minutes
  };

  return timeObj;
}
function updateSessionDisplay(m){
  //flushes session length display and appends updated data
  $('.session-length').empty();
  $('.session-length').append(m);
}
function updateBreakDisplay(m){
  //flushes session length display and appends updated data
  $('.break-length').empty();
  $('.break-length').append(m);
}
function updateRestDisplay(m){
  $('.rest-length').empty();
  $('.rest-length').append(m);
}
function padZeroes(num,size){
  //adds specified amount of 0s in front of number input, then removes the 0s if the amount of digits is larger than 0s
  return ('00'+num).substr(-size);
}


function timerLengthChange(timeUnit, operator){
  //adds or subtracts 60 seconds to the session time, depending on the data-set value, the operator
  if(operator === 'inc'){
    timeUnit += 60;
  }else if(operator === 'dec' && timeUnit > 0){
    timeUnit -= 60;
  }
  return timeUnit;
}

function timerChangeStopClock(timerType, currentTimer, timeout, timeUnit, i){
  if(currentTimer === timerType){
    //stop current timer
    $('.startstop').empty().append("START");
    running = 0;
    interruptTimeout(timeout);
    // set timer
    //set total time to new session amount
    currentTimeObj = updateTime(timeUnit)
    updateTimeDisplay(currentTimeObj);

    return timeUnit;
  }
  return i;
}

function updateLapDisplay(lap){
  $('.lap-counter').empty().append(laps[lap]);
}

$('.startstop').on('click', function(){
  //interrupts current count loop if counter is running on click
  toggleRunning();
  interruptTimeout(timeout);
  mainLoop();

  if(running === 1){
    playSound(STARTSOUND);
    $(this).empty().append("STOP");
  }else if(running === 0){
    playSound(STOPSOUND);
    $(this).empty().append("START");
  }
});

$('.reset').on('click',function(){
  // resets the currently running timer back to SESSION, with the specified session timer length
  if(currentTimer === 'rest'){
    lap = 0;
    updateLapDisplay(lap);
  }

  playSound(RESETLAP);
  interruptTimeout(timeout);
  i = sessionTime;
  currentTimer = 'session';
  currentTimeObj = updateTime(i);
  updateTimeDisplay(currentTimeObj);
  mainLoop();
});

$('.session-change').on('click',function(){
  //adds or subtracts 60 seconds to the session time, depending on the data-set value, the operator
  var operator = $(this).attr('data-set');
  sessionTime = timerLengthChange(sessionTime, operator);
  // stops clock when the current session timer is changed
  i = timerChangeStopClock('session', currentTimer, timeout, sessionTime, i);
  //update the session time object and display the new data
  sessionTimeObj = updateTime(sessionTime);
  updateSessionDisplay(sessionTimeObj.minutes);

});

$('.break-change').on('click', function(){
  var operator = $(this).attr('data-set');
  breakTime = timerLengthChange(breakTime, operator);
  // stops clock when the current session timer is changed
  i = timerChangeStopClock('break', currentTimer, timeout, breakTime, i);
  //update the break time object and display the new data
  breakTimeObj = updateTime(breakTime);
  updateBreakDisplay(breakTimeObj.minutes);
  console.log(i);
});

$('.rest-change').on('click', function(){
  var operator = $(this).attr('data-set');
  restTime = timerLengthChange(restTime, operator);
  i = timerChangeStopClock('rest', currentTimer, timeout, restTime, i);

  restTimeObj = updateTime(restTime);
  updateRestDisplay(restTimeObj.minutes);
});

$('.junq').on('click',function(){
  window.open('https://github.com/junkdeck/','_blank');
});

$('.sounder').on('click', function(){
  toggleSound();
  if(muted === 1){
    $('.sounder-waves').css("opacity","0");
  }else if(muted === 0){
    $('.sounder-waves').css("opacity","1");
  }
});
