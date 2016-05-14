// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
var videoSchema = new Schema({
    name: String,
    userId: String,
    status: String,
    originName: String,
    type: String,
    startTime: String,
    endTime: String
});

// create a model
var Video = mongoose.model('Video', videoSchema);

module.exports = Video;