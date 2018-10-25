var express = require('express');
var bodyParser = require('body-parser');
var logger = require('morgan');
var exphbs = require('express-handlebars');
var dataUtil = require("./data-util");
var _ = require('underscore');

var app = express();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');
app.use('/public', express.static('public'));

/* Similar to the pokemon project, we are loading in the data to the 
 * _DATA object. Luckily, we will never actually have to save new data 
 * to a file. */
var _DATA = dataUtil.loadData().objects;

app.get('/', function(req, res) {
    /* For this endpoint, all you have to do is return the states, and
     * whatever information is necessary to link them to their own 
     * /state/:statename endpoint. */
    var _States = dataUtil.getStates();
    var states = [];
    _States.forEach(function (i){
        var state = [];
        if(dataUtil.hasWhiteSpace(i)){
            var noSpace = dataUtil.removeWhiteSpace(i);
            state.push(i);
            state.push(noSpace);
        }else{
            state.push(i);
            state.push(i);
        }
        states.push(state);
    });
    res.render('allstates', { 
        states: states 
    });
})

app.get('/party/:party', function(req, res) {
    /* We suggest using underscore to get all of the representatives of a particular
     * party. You can find these under the 'party' field of each representative. */
    var _Party = req.params.party;
    var represent;
    if(_Party == "republican")
        represent = "Republican";
    else 
        represent = "Democrat";

    var reps = [];

    _.each(_DATA, function(i){
        if(i.party == represent){
            var fullState = dataUtil.getKey(i.state);
            if(dataUtil.hasWhiteSpace(fullState)){
                fullState = dataUtil.removeWhiteSpace(fullState);
            }
            var obj = {
                representative: i,
                st: fullState
            };

            reps.push(obj);
        }
    });

    res.render('representatives', {
        /* Remember that you not only have to pass in each of the representatives, but
         * also an identifier so the header of the handlebars template can change */
        represent: represent,
        reps: reps
    });
})

app.get('/state/:name', function(req, res) {
    /* Check the README to see all of the information that must come up on each page. 
     * Also, keep in mind that you cannot have something like "/state/Rhode Island" b/c
     * of the space. Make sure you find a way around this. Hint: Check out the comment in 
     * data-util.js. */

    /*Get State Name*/
    var _Name = req.params.name;
    var _States = dataUtil.getStates();
    var states = [];
    _States.forEach(function (i){
        var state = [];
        if(dataUtil.hasWhiteSpace(i)){
            var noSpace = dataUtil.removeWhiteSpace(i);
            state.push(i);
            state.push(noSpace);
        }else{
            state.push(i);
            state.push(i);
        }
        states.push(state);
    });
    var name;
    states.forEach(function(i){
        if(i[1] == _Name)
            name = i[0];
    });
    //get abr
    var abr = dataUtil.getAbr(name);

    //get array of reps
    var RepReps = [];
    var DemReps = [];
    _.each(_DATA, function(i){
        if(i.state == abr){
            var person = i.person; 
            if(i.party == "Republican"){
                RepReps.push(person);
            }else{
                DemReps.push(person);
            }
        }
    });

    var containsReps = false;
    var containsDems = false;
    if(RepReps.length > 0)
        containsReps = true;
    if(DemReps.length > 0)
        containsDems = true;

    res.render('state', {
        name: name,
        containsReps: containsReps,
        RepReps: RepReps,
        containsDems: containsDems,
        DemReps: DemReps
    })
})

app.get('/rep', function(req, res) {
    /* Here, remember that you must use the representatives.handlebars template again,
     * so the amount of filtering you have to do is _quite_ small. */
    var represent = "All Representatives";
    var reps = [];
    _.each(_DATA, function(i){
        var fullState = dataUtil.getKey(i.state);
        if(dataUtil.hasWhiteSpace(fullState)){
            fullState = dataUtil.removeWhiteSpace(fullState);
        }
        var obj = {
            representative: i,
            st: fullState
        };

        reps.push(obj);
        
    });

    res.render('representatives', {
        represent: represent,
        reps: reps
    })
});

app.get('/rep/:repid', function(req, res) {
    /* Check the REAMDE to see how to pick a repid. */
    var _Repid = req.params.repid;
    var person;
    var website;
    var description;
    var state;
    var party;
    _.each(_DATA, function(i){
        var per = i.person; 
        if(_Repid == per.id){
            person = per;
            website = i.website;
            description = i.description;
            state = i.state;
            party = i.party;
        }
    });
    var fullState = dataUtil.getKey(state);
    if(dataUtil.hasWhiteSpace(fullState)){
        fullState = dataUtil.removeWhiteSpace(fullState);
    }

    res.render('person', { 
        person: person,
        website: website,
        description: description,
        state: state,
        party: party,
        fullState: fullState
    });
});

app.listen(3000, function() {
    console.log('House of Representatives listening on port 3000!');
});
