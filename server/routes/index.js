var controllers = require('../controllers');
var express = require('express');
var app = express.Router();
var middlewares = require('../middlewares');
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();

/*<___________| USER ROUTES |___________>*/
app.post('/:version/signin/:action', controllers.callAction('signin.signin'));

app.post('/:version/signup/:action', controllers.callAction('signup.signup'));

/*<___________| ONLY AUTHORIZED USERS ROUTES |___________>*/
app.use(middlewares.auth.authentication);

app.route('/:version/users')
    .get(controllers.callAction('users.get'));


app.route('/:version/videos')
    .post(multipartMiddleware, controllers.callAction('videos.create'));

app.route('/:version/videos/:id')
    .get(controllers.callAction('videos.getVideo'));

app.route('/:version/videos/:id/restart')
    .patch(controllers.callAction('videos.restartUploadVideo'));

app.route('/:version/videos/:id/status')
    .get(controllers.callAction('videos.getVideoStatus'));

app.use('*', function (req, res, next) {
    var err = new Error();
    err.status = 404;
    return next(err);
});

module.exports = {
    default: app
};