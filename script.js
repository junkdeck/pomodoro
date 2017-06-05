// create audio elements ------------------------------------------
var SELECTSOUND = document.createElement("audio");
var UPSOUND = document.createElement("audio");
var DOWNSOUND = document.createElement("audio");
// timer sounds ---------------------------------
var TOBREAK = document.createElement("audio");
var TOREST = document.createElement("audio");
var TOSESSION = document.createElement("audio");
var TIMERSOUND = document.createElement("audio");
// reset sounds -----------------------------
var RESETSET = document.createElement("audio");
var RESETLAP = document.createElement("audio");
// sample loading -------------------------------------------------
TOBREAK.setAttribute("src","./sfx/to-break.ogg");
TOBREAK.setAttribute("preload", "auto");
TOREST.setAttribute("src","./sfx/to-rest.ogg");
TOREST.setAttribute("preload", "auto");
TOSESSION.setAttribute("src","./sfx/to-session.ogg");
TOSESSION.setAttribute("preload", "auto");

RESETSET.setAttribute("src","./sfx/reset-set.ogg");
RESETSET.setAttribute("preload", "auto");
RESETLAP.setAttribute("src","./sfx/reset-lap.ogg");
RESETLAP.setAttribute("preload", "auto");

TIMERSOUND.setAttribute("src","./sfx/beep.ogg");
TIMERSOUND.setAttribute("preload","auto");
SELECTSOUND.setAttribute("src","./sfx/select.ogg");
SELECTSOUND.setAttribute("preload","auto");
UPSOUND.setAttribute("src","./sfx/up.ogg");
UPSOUND.setAttribute("preload","auto");
DOWNSOUND.setAttribute("src","./sfx/down.ogg");
DOWNSOUND.setAttribute("preload","auto");

var breakTime = 300;        //break timer, in seconds. defaults to 5 minutes.
var sessionTime = 1500;        //session timer, in seconds. defaults to 25 minutes.
var restTime = 1800;        //rest time, in seconds. defaults to 30 minutes.

var i = 0;              //current clock timer, in seconds
var laps = 0;         // keeps track of how many laps have eLAPSed

var running = 0;    //boolean for keeping track of clock state

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
  //play sound when timer runs out, then toggle between session/break time and set the timer to the respective length
  if (i <= 0){
    // currentTimer === 'session' ? currentTimer = 'break' : currentTimer = 'session';
    if(currentTimer === 'session'){
      //only increment laps after a session is over, not break
      laps++;
      // change timer to break if laps are less than 4
      if(laps < 4){
        currentTimer = 'break';
        i = breakTime;
        playSound(TOBREAK);
      // change timer to rest if laps are 4 or more
      }else if(laps >= 4){
        currentTimer = 'rest';
        i = restTime;
        playSound(TOREST);
      }
    }else if(currentTimer === 'break' || currentTimer === 'rest'){
      if(currentTimer === 'rest'){
        // resets laps after a rest period
        laps = 0;
      }
      currentTimer = 'session';
      i = sessionTime;
      playSound(TOSESSION);
    }
    // toggleRunning();
  }
  //updates every second, as countdown counts in seconds
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

function playSound(sound){
  sound.currentTime = 0;
  sound.play();
}

function timerLengthChange(timeUnit, operator){
  //adds or subtracts 60 seconds to the session time, depending on the data-set value, the operator
  if(operator === 'inc'){
    playSound(UPSOUND);
    timeUnit += 60;
  }else if(operator === 'dec'){
    playSound(DOWNSOUND);
    timeUnit -= 60;
  }
  return timeUnit;
}

function timerChangeStopClock(timerType, currentTimer, timeout, timeUnit){
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
}

$('.startstop').on('click', function(){
  //interrupts current count loop if counter is running on click
  playSound(SELECTSOUND);
  toggleRunning();
  interruptTimeout(timeout);
  mainLoop();

  if(running === 1){
    $(this).empty().append("STOP");
  }else if(running === 0){
    $(this).empty().append("START");
  }
});

$('.reset').on('click',function(){
  // resets the currently running timer back to SESSION, with the specified session timer length
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
  i = timerChangeStopClock('session', currentTimer, timeout, sessionTime);
  //update the session time object and display the new data
  sessionTimeObj = updateTime(sessionTime);
  updateSessionDisplay(sessionTimeObj.minutes);

});

$('.break-change').on('click', function(){
  var operator = $(this).attr('data-set');
  breakTime = timerLengthChange(breakTime, operator);
  // stops clock when the current session timer is changed
  i = timerChangeStopClock('break', currentTimer, timeout, breakTime);
  //update the break time object and display the new data
  breakTimeObj = updateTime(breakTime);
  updateBreakDisplay(breakTimeObj.minutes);
});

$('.rest-change').on('click', function(){
  var operator = $(this).attr('data-set');
  restTime = timerLengthChange(restTime, operator);
  i = timerChangeStopClock('rest', currentTimer, timeout, restTime);

  restTimeObj = updateTime(restTime);
  updateRestDisplay(restTimeObj.minutes);
});

$('.junq').on('click',function(){
  window.open('https://github.com/junkdeck/','_blank');
});
