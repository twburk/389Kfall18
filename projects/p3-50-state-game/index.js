// This is a subset of the states.
// Use this to actually run the game
// (assume this is the full set of states.
// This will make it easier to test.
var states = ["Idaho", "South Dakota", "Hawaii", "Alaska", "Alabama", "New York"];


var correctStates =[];
var missingStates =[];

// These are all the states. It maps the state name to the number which you'll
// want to use in your API call.
var abvMap = {
    "Alabama": "01",
    "Alaska": "02",
    "Arizona": "04",
    "Arkansas": "05",
    "California": "06",
    "Colorado": "08",
    "Connecticut": "09",
    "Delaware": "10",
    "District Of Columbia": "11",
    "Florida": "12",
    "Georgia": "13",
    "Hawaii": "15",
    "Idaho": "16",
    "Illinois": "17",
    "Indiana": "18",
    "Iowa": "19",
    "Kansas": "20",
    "Kentucky": "21",
    "Louisiana": "22",
    "Maine": "23",
    "Maryland": "24",
    "Massachusetts": "25",
    "Michigan": "26",
    "Minnesota": "27",
    "Mississippi": "28",
    "Missouri": "29",
    "Montana": "30",
    "Nebraska": "31",
    "Nevada": "32",
    "New Hampshire": "33",
    "New Jersey": "34",
    "New Mexico": "35",
    "New York": "36",
    "North Carolina": "37",
    "North Dakota": "38",
    "Ohio": "39",
    "Oklahoma": "40",
    "Oregon": "41",
    "Pennsylvania": "42",
    "Rhode Island": "44",
    "South Carolina": "45",
    "South Dakota": "46",
    "Tennessee": "47",
    "Texas": "48",
    "Utah": "49",
    "Vermont": "50",
    "Virginia": "51",
    "Washington": "53",
    "West Virginia": "54",
    "Wisconsin": "55",
    "Wyoming": "56",
}


/*
 * The majority of this project is done in JavaScript.
 *
 * 1. Start the timer when the click button is hit. Also, you must worry about
 *    how it will decrement (hint: setInterval).
 * 2. Check the input text with the group of states that has not already been
 *    entered. Note that this should only work if the game is currently in
 * 3. Realize when the user has entered all of the states, and let him/her know
 *    that he/she has won (also must handle the lose scenario). The timer must
 *    be stopped as well.
 *
 * There may be other tasks that must be completed, and everyone's implementation
 * will be different. Make sure you Google! We urge you to post in Piazza if
 * you are stuck.
 */

var timeRemaining = 20;
var won = false;

function arraysEqual(array1, array2) {
    if(!Array.isArray(array1) || !Array.isArray(array2) || array1.length !== array2.length){
        return false;
    }

    var cs = array1.concat().sort();
    var s = array2.concat().sort();

    for(var i = 0; i < cs.length; i++){
        if(cs[i] !== s[i]){
            return false;
        }
    }

    return true;
}

function printMissingStates(){
    for(var i = 0; i < states.length; i++){
        if(!correctStates.includes(states[i])){
            missingStates.push(states[i]);
        }
    }

    var missing = document.getElementById("missing");

    var str = "<ul id='mList'>";
    for(var i = 0; i < missingStates.length; i++){
        str += "<li>" + missingStates[i] + "</li>";
    }
    str += "</ul>";
    missing.innerHTML = str;

}

function checkIfWon(){
    for(var i = 0; i < states.length; i++){
        if(!correctStates.includes(states[i])){
            if(timeRemaining === 0){
                alert("You Lose!");
                printMissingStates();
                break;
            }
        }
    }

    if(arraysEqual(correctStates, states)){
        alert("You Win!!!!!");
        return true;
    }
    
}

$('#start').click(function(){
    $('#stateID').prop('disabled', false);
    time = document.getElementById("timer");
    time.innerHTML = "Time Remaining: " + timeRemaining;
    setInterval(function() {
        timeRemaining--;
        if(timeRemaining >= 0 && won == false){
            time = document.getElementById("timer");
            time.innerHTML = "Time Remaining: " + timeRemaining;
        }
        if(timeRemaining >= 0 && won == true){
            clearInterval(timeRemaining);
            time = document.getElementById("timer");
            time.innerHTML = "Time Over. Game Won!";
        }
        if(timeRemaining === 0){
            $('#stateID').prop('disabled', true);
            checkIfWon();
            clearInterval(timeRemaining);
        }
    }, 1000);
});

function printCorrect(){
    var correct = document.getElementById("correct");
    var str = "<ul id='list'>";
    for(var i = 0; i < correctStates.length; i++){
        str += "<li>" + correctStates[i] + "</li>";
    }
    str += "</ul>";
    correct.innerHTML = str;
}

$("#stateID").on('keyup',function(){
    var state = $("#stateID").val();
    state = state.toLowerCase();
    Object.keys(abvMap).forEach(function(key){
        if(state == key.toLowerCase()){
            if(!correctStates.includes(key)){
                correctStates.push(key);
                printCorrect();
                document.getElementById("stateID").value = '';
                if(checkIfWon()){
                    won = true;
                    $('#stateID').prop('disabled', true);
                }
            }
        }
    })
});

function addCommas(str){
    str += '';
    s = str.split('.');
    s1 = s[0];
    s2 = s.length > 1 ? '.' + s[1] : '';
    var regex = /(\d+)(\d{3})/;
    while (regex.test(s1)){
        s1 = s1.replace(regex, '$1' + ',' + '$2');
    }
    return s1 + s2;
}

function printSpanishSpeaker(state){
    var code;
    for(var st in abvMap){
        if(st == state)
            code = abvMap[st];
    }
    
    $.get("https://api.census.gov/data/2013/language?get=EST&for=state:" + code + "&LAN=625", function(data){
        if (data.length == 0) {
            alert("Oops, can't find state code: " + code);
        }else{
            var spanishSpeakers = data[1][0];
            
            spanishSpeakers = addCommas(spanishSpeakers);
            
            var str = state;
            str += " has ";
            str += spanishSpeakers;
            str += " Spanish Speakers.";

            document.getElementById("spanish").innerHTML = str;
        }
    });
}

$(document).on("mouseenter", "li", function() {
    var state = $(this).text();
    printSpanishSpeaker(state);
});
