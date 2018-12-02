var mongoose = require('mongoose');

var activitySchema = new mongoose.Schema({
    name: {
        type: String
    },
    city: {
        type: String
    },
    ageRequirement: {
        type: String
    },
    maxGroupCount:{
        type: Number
    },
    dressCode: [String]
});

var Activity = mongoose.model('Activity', activitySchema);
module.exports = Activity;