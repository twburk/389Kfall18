var mongoose = require('mongoose');

<<<<<<< HEAD

=======
>>>>>>> upstream/master
var reviewSchema = new mongoose.Schema({
    rating:{
        type: Number,
        min: 0.0,
        max: 5.0,
        required: true,
    },
    comment:{
<<<<<<< HEAD
        type:String,
    },
    author:{
        type:String,
=======
        type: String,
    },
    author:{
        type: String,
>>>>>>> upstream/master
        required: true
    }
});

var movieSchema = new mongoose.Schema({
    title:{
<<<<<<< HEAD
        type:String,
        required: true,
    },
    year:{
        type:Number,
        min:0,
        max:2018,
        required:true,
    },
    genre:{
        type:String,
        required: true,
=======
        type: String,
        required: true
    },
    year:{
        type: Number,
        min: 0,
        max: 2018,
        required: true
    },
    genre: {
        type: String,
        required: true
>>>>>>> upstream/master
    },
    reviews: [reviewSchema]
});

<<<<<<< HEAD
var Movie = mongoose.model('Movie', movieSchema);

module.exports = Movie;
=======
var Movie = mongoose.model('Movie',movieSchema);

module.exports = Movie;
>>>>>>> upstream/master
