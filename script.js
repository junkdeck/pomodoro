var TIMERSOUND = document.createElement("audio");
var SELECTSOUND = document.createElement("audio");
var UPSOUND = document.createElement("audio");
var DOWNSOUND = document.createElement("audio");
TIMERSOUND.setAttribute("src","./beep.ogg");
TIMERSOUND.setAttribute("preload","auto");
SELECTSOUND.setAttribute("src","./select.ogg");
SELECTSOUND.setAttribute("preload","auto");
UPSOUND.setAttribute("src","./up.ogg");
UPSOUND.setAttribute("preload","auto");
DOWNSOUND.setAttribute("src","./down.ogg");
DOWNSOUND.setAttribute("preload","auto");

var breakTime = 300;        //break timer, in seconds. defaults to 5 minutes.
var sessionTime = 1500;        //session timer, in seconds. defaults to 25 minutes.
var restTime = 1800;        //rest time, in seconds. defaults to 30 minutes.

var i = 0;              //current clock timer, in seconds

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
    TIMERSOUND.play();
    // currentTimer === 'session' ? currentTimer = 'break' : currentTimer = 'session';
    if(currentTimer === 'session'){
      currentTimer = 'break';
      i = breakTime;
    }else if(currentTimer === 'break'){
      currentTimer = 'session';
      i = sessionTime
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
    //set total time to new session amount
    currentTimeObj = updateTime(timeUnit)
    updateTimeDisplay(currentTimeObj);
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
  playSound(SELECTSOUND);
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
  timerChangeStopClock('session', currentTimer, timeout, sessionTime);
  //update the session time object and display the new data
  sessionTimeObj = updateTime(sessionTime);
  updateSessionDisplay(sessionTimeObj.minutes);

});

$('.break-change').on('click', function(){
  var operator = $(this).attr('data-set');
  breakTime = timerLengthChange(breakTime, operator);
  // stops clock when the current session timer is changed
  timerChangeStopClock('break', currentTimer, timeout, breakTime);
  //update the break time object and display the new data
  breakTimeObj = updateTime(breakTime);
  updateBreakDisplay(breakTimeObj.minutes);
});

$('.junq').on('click',function(){
  window.open('https://github.com/junkdeck/','_blank');
});
