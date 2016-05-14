var bodyParser = require('body-parser');
var controllers = require('./controllers');
var errorHandler = require('./utils/errorHandler');
var express = require('express');
var models = require("./models/v1");
var router = require('./routes');

//initialize the app
var app = module.exports = express();

app.use(express.static(__dirname + '/../frontend'));
app.use(express.static(__dirname + '/../frontend/swagger'));

app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.raw({limit: '50mb'}));
app.use(bodyParser.urlencoded({extended: true}));

app.use('/api', router.default);
app.get('/*', controllers.static.frontendApp);

//set up http error handler
app.use(errorHandler(app));