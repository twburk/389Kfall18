var express = require('express');
var bodyParser = require('body-parser');
var fs = require('fs');
var pokeDataUtil = require("./poke-data-util");
var _ = require("underscore");
var app = express();
var PORT = 3000;

// Restore original data into poke.json. 
// Leave this here if you want to restore the original dataset 
// and reverse the edits you made. 
// For example, if you add certain weaknesses to Squirtle, this
// will make sure Squirtle is reset back to its original state 
// after you restard your server. 
pokeDataUtil.restoreOriginalData();

// Load contents of poke.json into global variable. 
var _DATA = pokeDataUtil.loadData().pokemon;

/// Setup body-parser. No need to touch this.
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/", function(req, res) {
    var contents = "";
    var count = 1;

    _.each(_DATA, function(i){
        contents += "<tr><td>" + count + "</td><td><a href='/pokemon/" + count + "'>" + i.name + "</a></td></tr>\n";
        count++;
    })
    var html = "<html>\n<body>\n<table>\n" + contents + "</table>\n</body>\n</html>";
    res.send(html);
});

app.get("/pokemon/:pokemon_id", function(req, res) {
    // HINT : 
    // <tr><td>${i}</td><td>${JSON.stringify(result[i])}</td></tr>\n`;
    var contents = "";
    var _id = parseInt(req.params.pokemon_id);
    var result = _.findWhere(_DATA, { id: _id });
    
    if(!result){
        var html = "<html>\n<body>\nError: Pokemon not found\n</body>\n</html>";
    }else{
        contents = "<tr><td>id" + "</td><td>" + result.id + "</td></tr>\n";
        contents += "<tr><td>num" + "</td><td>" + JSON.stringify(result.num) + "</td></tr>\n";
        contents += "<tr><td>name" + "</td><td>" + JSON.stringify(result.name) + "</td></tr>\n";
        contents += "<tr><td>img" + "</td><td>" + JSON.stringify(result.img) + "</td></tr>\n";
        contents += "<tr><td>type" + "</td><td>" + JSON.stringify(result.type) + "</td></tr>\n";
        contents += "<tr><td>height" + "</td><td>" + JSON.stringify(result.height) + "</td></tr>\n";
        contents += "<tr><td>weight" + "</td><td>" + JSON.stringify(result.weight) + "</td></tr>\n";
        contents += "<tr><td>candy" + "</td><td>" + JSON.stringify(result.candy) + "</td></tr>\n";
        contents += "<tr><td>candy_count" + "</td><td>" + result.candy_count + "</td></tr>\n";
        contents += "<tr><td>egg" + "</td><td>" + JSON.stringify(result.egg) + "</td></tr>\n";
        contents += "<tr><td>spawn_chance" + "</td><td>" + result.spawn_chance + "</td></tr>\n";
        contents += "<tr><td>avg_spawn" + "</td><td>" + JSON.stringify(result.avg_spawns) + "</td></tr>\n";
        contents += "<tr><td>spawn_time" + "</td><td>" + JSON.stringify(result.spawn_time) + "</td></tr>\n";
        contents += "<tr><td>multipliers" + "</td><td>" + JSON.stringify(result.multipliers) + "</td></tr>\n";
        contents += "<tr><td>weakness" + "</td><td>" + JSON.stringify(result.weaknesses) + "</td></tr>\n";
        contents += "<tr><td>prev_evolution" + "</td><td>" + JSON.stringify(result.prev_evolution) + "</td></tr>\n";
        contents += "<tr><td>next_evolution" + "</td><td>" + JSON.stringify(result.next_evolution) + "</td></tr>\n";

        var html = "<html>\n<body>\n<table>" + contents + "</table>\n</body>\n</html>";
    }

    res.send(html);
});

app.get("/pokemon/image/:pokemon_id", function(req, res) {
    var contents = "";
    var _id = parseInt(req.params.pokemon_id);
    var result = _.findWhere(_DATA, { id: _id });

    if(!result){
        var html = "<html>\n<body>\nError: Pokemon not found\n</body>\n</html>";
    }else{
        contents = "<img src=" + result.img + ">\n";
        var html = "<html>\n<body>\n" + contents + "\n</body>\n</html>";
    }
    res.send(html);
});

app.get("/api/id/:pokemon_id", function(req, res) {
    // This endpoint has been completed for you.  
    var _id = parseInt(req.params.pokemon_id);
    var result = _.findWhere(_DATA, { id: _id })
    if (!result) return res.json({});
    res.json(result);
});

app.get("/api/evochain/:pokemon_name", function(req, res) {
    var evolutionArray = [];
    var _name = req.params.pokemon_name;
    var result = _.findWhere(_DATA, {name : _name});

    if(result){
        var curName = result.name;
        evolutionArray.push(curName);
        var prev = result.prev_evolution;
        var next = result.next_evolution;

        if(prev != undefined){
            var objPrev = prev[0];
            var prevName = objPrev.name;
            evolutionArray.push(prevName);
        }

        if(next != undefined){
            var objNext = next[0];
            var nextName = objNext.name;
            evolutionArray.push(nextName);
        }
    }



    res.send(evolutionArray.sort());

});

app.get("/api/type/:type", function(req, res) {
    var typeArray = [];
    var type = req.params.type;
    
    _.each(_DATA, function(i){
        for(var j = 0; j < i.type.length; j++){
            if(i.type[j] == type){
                typeArray.push(i.name);
            }
        }
    })

    res.send(typeArray);
});

app.get("/api/type/:type/heaviest", function(req, res) {
    var name;
    var weight = 0;
    var type = req.params.type;

    _.each(_DATA, function(i){
        for(var j = 0; j < i.type.length; j++){
            if(i.type[j] == type){
                if(parseInt(i.weight) > weight){
                    weight = parseInt(i.weight);
                    name = i.name;
                }
            }
        }
    })

    if(weight > 0){
        var obj = {
            name: name,
            weight: weight
        }
    }else{
        var obj = {};
    }

    res.send(obj);
});

app.post("/api/weakness/:pokemon_name/add/:weakness_name", function(req, res) {
    // HINT: 
    // Use `pokeDataUtil.saveData(_DATA);`
    var _name = req.params.pokemon_name;
    var weakness = req.params.weakness_name;
    var result = _.findWhere(_DATA, { name: _name });
    var notIn = true;
    
    if(!result){
        var obj = {};
        res.send(obj);
    }else{
        var weak = result.weaknesses;
        for(var i = 0; i < weak.length; i++){
            if(weak[i] == weakness){
                notIn = false;
            }
        }

        if(notIn){
            result.weaknesses.push(weakness);
        }

        var obj = {
            name: result.name,
            weaknesses: result.weaknesses
        }

        pokeDataUtil.saveData(_DATA);
        res.send(obj);
    }
});

app.delete("/api/weakness/:pokemon_name/remove/:weakness_name", function(req, res) {
    var _name = req.params.pokemon_name;
    var weakness = req.params.weakness_name;
    var result = _.findWhere(_DATA, { name: _name });
    
    if(!result){
        var obj = {};
        res.send(obj);
    }else{
        var newArr = [];
        var weak = result.weaknesses;
        for(var i = 0; i < weak.length; i++){
            if(weak[i] != weakness){
                newArr.push(weak[i]);
            }
        }

        result.weaknesses = newArr;

        var obj = {
            name: result.name,
            weaknesses: result.weaknesses
        }

        pokeDataUtil.saveData(_DATA);
        res.send(obj);
    }
});


// Start listening on port PORT
app.listen(PORT, function() {
    console.log('Server listening on port:', PORT);
});

// DO NOT REMOVE (for testing purposes)
exports.PORT = PORT
