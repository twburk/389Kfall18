var express = require('express');
var app = express();
var factorial = require('./factorial');

//https://www.cmsc389k.io/path?name=Chiraq&age=99


// landing page
app.get('/factorial', function(req, res){
    var number = req.query.number;
    if(!number){
        return res.send("Please sent a number");
    }

    res.send(factorial(number) + "");
});

app.listen(3000, function(){
    console.log('Server running on port 3000!');
});

//console.log(factorial(5));