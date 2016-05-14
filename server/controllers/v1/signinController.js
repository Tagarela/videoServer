'use strict';

var Controller = require('./../../utils/controller');
var Validator = require('./../../validators/v1').signin;
var config = require('./../../../config');
var models  = require('../../models/v1');
var Format = require('./../../utils/format');
var Password = require('./../../utils/password');
var jwt = require('jsonwebtoken');

class SigninController extends Controller {
    constructor(version) {
        super(version);

        var self = this;
        this.strategies = {
            basic: [Validator.basic, this._getUserByEmail, this._createToken]
        };
    }

    /**
     * get user by email
     * @param req
     * @param res
     * @param next
     * @private
     */
    _getUserByEmail (req, res, next) {
        models.users.findOne({ email: req.body.email }, function(err, user) {

            if (err) return console.error(err);
            if(!user){
                let error = new Error();
                error.status = 404;
                error.message = 'User not found';
                return next(error);
            }

            if(!Password.compare(req.body.password, user.password)){
                let error = new Error();
                error.status = 401;
                error.message = 'Password does not match';
                return next(error);
            }

            req.user = user;
            next();
        });
    }

    _createToken (req, res, next) {
        let user = Format.user(req.user);
        //let user = req.user;
        let tokenParams = {
            createTime: Date.now(),
            id: user.id
        };

        user.token = jwt.sign(tokenParams, config.jwtKey);
    console.log(user.token);
        res.send(user)
    }

    /**
     * choose signin strategy
     * @param req
     * @param res
     * @param next
     * @returns {*}
     * @private
     */
    signin(req, res, next) {
        var self = this;
        if (!this.strategies[req.params.action]) {
            var error = new Error();
            error.status = 404;
            return next(error);
        }

        var operations = this.strategies[req.params.action].map(function (middleware) {
            return middleware.bind(self, req, res);
        });

        require('async').series(operations, next);
    }

}

module.exports = SigninController;