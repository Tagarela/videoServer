var config = require('./../../config');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var fixtures = require('node-mongoose-fixtures');


function prepareDB(done) {
    var userSchema = new Schema({
        email: String,
        firstName: String,
        lastName: String,
        password: String
    });
    mongoose.model('users', userSchema);
    mongoose.connect(config.db.url, function (err) {
        //fixtures.reset();
        fixtures({
            users: [
                {
                    "email": "test@gmail.com",
                    "firstName": "test",
                    "lastName": "test",
                    "password": "$2a$10$jKuZd1ailBGdFico7vVbFu5MbJWzfCH7XEWnbvgBPZr4riGu0l0ju"
                }
            ]
        }, function (err, data) {
            done();
        });

    });
}

module.exports = {
    prepare: prepareDB
};
