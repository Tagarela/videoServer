var config = require('./config');
var logger = require('./server/utils/logger');
var app = require('./server/api');
var mongoose = require('mongoose');

mongoose.connect(config.db.url, function(err) {
    if(err) {
        console.log('connection error', err);
    } else {
        console.log('connection successful');
    }
});

require('http').createServer(app).listen(config.server.port, function () {
    logger.log('info', "Web server successfully started at port %d", config.server.port);
});


