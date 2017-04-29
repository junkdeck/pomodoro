//would be fun to write this semi-functionally. give it a go, fred!
//easy to say when it's 3am and i know /i/ won't be doing it though
//heheh, sucks to be you, future fred!!

var TIMERSOUND = document.createElement("audio");
TIMERSOUND.setAttribute("src","./timer.ogg");
TIMERSOUND.setAttribute("preload","auto");

var i = 1500;              //total clock time, in seconds
var seconds = 0;
var minutes = 0;
var running = 0;    //boolean for keeping track of clock state
var timeout = null; //timeout storage

$(document).ready(function(){
    //creates minutes/seconds from total time in seconds, and displays them to the user
    updateTime(i);
    updateSessionDisplay(minutes);
    updateTimeDisplay(seconds,minutes);

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
    //updates every second, as countdown counts in seconds
    if(running === 1 && i > 0){
        i--;
        updateTime(i);
        updateTimeDisplay(seconds,minutes);
        //stores the timeout in a referral var
        timeout = setTimeout(mainLoop, 1000);
    }else if (i <= 0){
        TIMERSOUND.play();
        toggleRunning();
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

function updateTimeDisplay(s,m){
    //flushes the display area and appends the updated data
    var secondDisplay = $('.seconds');
    var minuteDisplay = $('.minutes');

    secondDisplay.empty();
    secondDisplay.append(padZeroes(s,2));

    minuteDisplay.empty();
    minuteDisplay.append(padZeroes(m,m.toString().length));
}
function updateTime(i){
    //creates seconds and minutes from supplied time, in seconds
    seconds = Math.floor(i % 60);
    minutes = Math.floor(i / 60);
}
function updateSessionDisplay(m){
    //flushes session length display and appends updated data
    $('.session-length').empty();
    $('.session-length').append(m);
}
function padZeroes(num,size){
    //adds specified amount of 0s in front of number input, then removes the 0s if the number is larger than 0s
    return ('00'+num).substr(-size);
}
