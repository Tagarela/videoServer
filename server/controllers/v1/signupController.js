'use strict';

var User = require('./../../models/v1').users;
var Controller = require('./../../utils/controller');
var Validator = require('./../../validators/v1').signup;
var config = require('./../../../config');
var Format = require('./../../utils/format');
var Password = require('./../../utils/password');
var jwt = require('jsonwebtoken');

class SignupController extends Controller {
    constructor(version) {
        super(version);

        this.signup = this._chooseStrategy;
    }

    /**
     * choose signup strategy
     * @param req
     * @param res
     * @param next
     * @returns {*}
     * @private
     */
    _chooseStrategy(req, res, next) {
        var self = this;
        var strategies = {
            basic: [Validator.validateBase, this._checkUserExist, self._passwordHandler, self._saveUser]
        };

        if (!strategies[req.params.action]) {
            var error = new Error();
            error.status = 404;
            return next(error);
        }

        var operations = strategies[req.params.action].map(function (middleware) {
            return middleware.bind(self, req, res);
        });

        require('async').series(operations, next);
    }

    /**
     * check if user exist api
     *
     * @param req
     * @param res
     * @param next
     */
    _checkUserExist(req, res, next) {
        let email = req.user ? req.user.email : req.body.email;
        User.findOne({ email: req.body.email }, function(err, user) {
            if (err) return next(err);

            if (user) {
                let error = new Error();
                error.message = 'User with this email address has been already registered';
                error.status = 409;
                return next(error);
            }
            next();
        });
    }

    /**
     * Password handler
     * @param req
     * @param res
     * @param next
     * @returns {*}
     * @private
     */
    _passwordHandler(req, res, next) {

        if (req.body.password !== req.body.confirmPassword) {
            let error = new Error();
            error.message = 'Passwords do not match!';
            error.status = 403;
            return next(error);
        }
        req.body.password = Password.hash(req.body.password);

        next();
    }

    /**
     * Crete new user
     *
     * @param {object} req
     * @param {object} res
     * @param {function} next
     * @private
     */
    _saveUser(req, res, next) {

        //delete req.local.confirmPassword;
        User.create(req.body, function (err, result) {
            if (err) return next(err);

            let tokenParams = {};
            tokenParams.createTime = Date.now();
            tokenParams.id =  result._id;

            let user = Format.user(req.body);
            user.token = jwt.sign(tokenParams, config.jwtKey);

            res.status(201);
            res.send(user)
        });
    }
}

module.exports = SignupController;