var async = require('async');
var getController = function (controller, version) {
    var Controller = require('./' + version + '/' + controller);
    return new Controller(version);
};

var versions = {
    v1: {
        users: getController.apply(this, ['usersController', 'v1']),
        signup: getController.apply(this, ['signupController', 'v1']),
        signin: getController.apply(this, ['signinController', 'v1']),
        videos: getController.apply(this, ['videosController', 'v1'])
    }
};

module.exports = {
    static:          require('./staticController'),
    callAction: function (route) {
        return function (req, res, next) {
            var error = new Error();
            if (!versions[req.params.version]) {
                error.message = 'Unsupported API version';
                error.status = 403;
                return next(error);
            }

            var controller = route.split('.')[0];
            var action = route.split('.')[1];
            if (!versions[req.params.version][controller]) {
                error.message = 'Controller not implemented';
                error.status = 405;
                return next(error);
            }

            if (!versions[req.params.version][controller][action]) {
                error.message = 'Action not implemented';
                error.status = 405;
                return next(error);
            }

            var operations = Array.isArray(versions[req.params.version][controller][action])
                ? versions[req.params.version][controller][action]
                : [versions[req.params.version][controller][action]];
            operations = operations.map(function (middleware) {
                return middleware.bind(versions[req.params.version][controller], req, res);
            });

            async.series(operations, next);
        }
    }
};