var TIMERSOUND = document.createElement("audio");
// TIMERSOUND.setAttribute("src","./timer.ogg");
TIMERSOUND.setAttribute("preload","auto");

var breakTime = 300;        //break timer, in seconds. defaults to 5 minutes.
var sessionTime = 1500;        //session timer, in seconds. defaults to 25 minutes.

var i = 0;              //current clock timer, in seconds
// var seconds = 0;
// var minutes = 0;

// var running = 0;    //boolean for keeping track of clock state
//REMOVE WHEN DONE TESTING
var running = 1;    //default to one for testing without mouse usage

var currentTimer = 'session';   //keeps track of which countdown is currently active - session / break
var timeout = null; //timeout storage

$(document).ready(function(){
    //set current timer equal to the default session time length
    i = sessionTime;

    //creates minutes/seconds from total time in seconds, and displays them to the user
    //updateTime returns an array with the time, in the order of "seconds, minutes"
    var sessionTimeObj = updateTime(sessionTime);
    var breakTimeObj = updateTime(breakTime);
    var currentTimeObj = updateTime(i);

    updateBreakDisplay(breakTimeObj.minutes);
    updateSessionDisplay(sessionTimeObj.minutes);
    updateTimeDisplay(currentTimeObj);


    //REMOVE WHEN DONE TESTING!!
    mainLoop(); //autostart for testing without mouse usage
    //REMOVE WHEN DONE TESTING!!

    // TIMERSOUND.play();
});

$('.startstop').on('click', function(){
    //interrupts current count loop if counter is running on click
    if(running){
        interruptTimeout();
    }
    toggleRunning();
    mainLoop();
});

function mainLoop(){
    //play sound when timer runs out, then toggle between session/break time and set the timer to the respective length
    if (i <= 0){
        TIMERSOUND.play();
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

function interruptTimeout(){
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

    secondDisplay.empty();
    secondDisplay.append(padZeroes(obj.seconds,2));

    minuteDisplay.empty();
    minuteDisplay.append(padZeroes(obj.minutes,obj.minutes.toString().length));
}
function updateTime(i){
    //creates seconds and minutes from supplied time, in seconds, and returns an object
    var seconds = Math.floor(i % 60);
    var minutes = Math.floor(i / 60);

    var timeObj = {
        seconds: seconds,
        minutes: minutes
    };

    // return [seconds, minutes];
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
function padZeroes(num,size){
    //adds specified amount of 0s in front of number input, then removes the 0s if the number is larger than 0s
    return ('00'+num).substr(-size);
}
