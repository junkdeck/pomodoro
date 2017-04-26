//would be fun to write this semi-functionally. give it a go, fred!
//easy to say when it's 3am and i know /i/ won't be doing it though
//heheh, sucks to be you, future fred!!

var i = 5;              //total clock time, in seconds
var seconds = 0;
var minutes = 0;
var running = 0;    //boolean for keeping track of clock state

$(document).ready(function(){
    //creates minutes/seconds from total time in seconds, and displays them to the user
    updateTime(i);
    updateDisplay(seconds,minutes);
});

$('.startstop').on('click', function(){
    //toggles 0/1 - ^ is an exclusive bitwise operator.
    //a = 0, b = 1, a XOR b = 1
    //a = 1, b = 1, a XOR b = 0
    running ^= 1;

    //only run the clock if the state is indeed running
    if(running === 1){
        mainLoop();
    }else if(running === 0){
        clearInterval(x);
    }
});

function mainLoop(){
    //global interval variable
    x = setInterval(function(){
        updateTime(i);
        updateDisplay(seconds,minutes);

        i--;

        if(i < 0){
            clearInterval(x);
        }
    }, 1000) //updates every second ( countdown counts in seconds )
}

function updateDisplay(s,m){
    //flushes the display area and appends the updated data
    var secondDisplay = $('.seconds');
    var minuteDisplay = $('.minutes');

    secondDisplay.empty();
    secondDisplay.append(s);

    minuteDisplay.empty();
    minuteDisplay.append(m);
}
function updateTime(i){
    //creates seconds and minutes from supplied time, in seconds
    seconds = Math.floor(i % 60);
    minutes = Math.floor(i / 60);
}
