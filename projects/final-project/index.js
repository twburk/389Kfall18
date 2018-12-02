var express = require('express');
var bodyParser = require('body-parser');
var logger = require('morgan');
var exphbs = require('express-handlebars');
//var dataUtil = require("./data-util");
var _ = require('underscore');
var mongoose = require('mongoose');
var dotenv = require('dotenv');
var Activity = require('./models/Activities');
var expstate = require('express-state');

// Load envirorment variables
dotenv.load();

console.log(process.env.MONGODB);

//connect to sandbox
mongoose.connect(process.env.MONGODB);
mongoose.connection.on("error", function(err){
    console.log("Connection was unable to take place");
    process.exit(1);
})
// Connect to Sandbox MongoDB
mongoose.connect(process.env.MONGODB);
mongoose.connection.on('error',function(err){
    console.log("Connection was unable to take place");
    process.exit(1);
});

var app = express();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');
app.use('/public', express.static('public'));

expstate.extend(app);
app.set("state namespace", 'App');

/* Add whatever endpoints you need! Remember that your API endpoints must
 * have '/api' prepended to them. Please remember that you need at least 5 
 * endpoints for the API, and 5 others. 
 */


app.get('/', function(req, res){
    var activityArr = [];

    Activity.find({}, function(err, activities){
        if(err) throw err;
        activities.forEach(function(a){
            activityArr.push(a);
        });
        res.expose(activityArr, "activ");
        res.render("all", {activ: activityArr});
    });
});

app.get('/', function(req, res){
    var activityArr = [];

    Activity.find({}, function(err, activities){
        if(err) throw err;
        activities.forEach(function(a){
            activityArr.push(a);
        });
        res.render("all", {activ: activityArr});
    });
});

app.get('/baltimore_activities', function(req, res){
    Activity.find({city: "Baltimore"}, function(err, activities){
        if(err) throw err;

        res.render('baltimore', {activ: activities});
    });
});

app.get('/restricted_activities', function(req, res){
    Activity.find({ageRequirement: "Yes"}, function(err, activities){
        if(err) throw err;

        res.render('restricted', {activ: activities});
    });
});

app.get('/notRestricted_activities', function(req, res){
    Activity.find({ageRequirement: "No"}, function(err, activities){
        if(err) throw err;

        res.render('restricted', {activ: activities});
    });
});

app.get('/activity_abc', function(req, res){
    Activity.find({}, function(err, activities){
        if(err) throw err;
        var activ_abc = _.sortBy(activities, function(a){return a.name});

        res.render('alphabetical', {activ: activ_abc});
    });
});

app.get('/group_activities', function(req, res){
    Activity.find({}, function(err, activities){
        if(err) throw err;
        var group = _.sortBy(activities, function(a){return a.maxGroupCount});

        res.render('group', {activ: group.reverse()});
    });
})

app.get('/new_activity', function(req, res){
    res.render('activity_form', {});
});

app.post('/activity', function(req, res){
    var dressC = req.body.dressCode;
    var dress = dressC.split(";");

    var activity = new Activity({
        name: req.body.name,
        city: req.body.city,
        ageRequirement: req.body.ageRequirement,
        maxGroupCount: req.body.maxGroup,
        dressCode: dress
    });

    activity.save(function(err){
        if(err) throw err;
        return res.render("activity_inserted", {activity: activity});
    });

});

app.post('/api/activity', function(req, res){
    //var dressC = req.body.dressCode;
    //var dress = dressC.split(";");

    var activity = new Activity({
        name: req.body.name,
        city: req.body.city,
        ageRequirement: req.body.ageRequirement,
        maxGroupCount: req.body.maxGroup,
        dressCode: dress
    });

    activity.save(function(err){
        if(err) throw err;
        return res.render("activity_inserted", {activity: activity});
    });

});

app.get('/api/activity', function(req, res){
    Activity.find({}, function(err, activities){
        if(err) throw err;
        res.send(activities);
    });
});

app.listen(3000, function() {
    console.log('Maryland Activities listening on port 3000!');
});
