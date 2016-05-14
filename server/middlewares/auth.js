'use strict'

//models
var models  = require('./../models/v1');

//modules
var jwt = require('jsonwebtoken');
var config = require('./../../config');


class Auth {
    /**
     * auth user
     *
     * @param req
     * @param res
     * @param next
     * @returns {*}
     */
    static authentication (req, res, next) {

        try {
            var tokenData = jwt.verify(req.headers.authorization, config.jwtKey);
        } catch (err) {
            let error = new Error();
            error.status = 401;
            error.message = 'not valid token!';
            return next(error);
        }

        if (tokenData.createTime + (86400 * 180) < Date.now()) {
            let error = new Error();
            error.status = 401;
            error.message = 'token expired!';
            return next(error);
        }
        models.users.findById(tokenData.id, function(err, user) {

            if (err) {
                return next(err);
            }

            if (!user || user.length === 0) {

                let error = new Error();
                error.status = 404;
                error.message = 'user not found!';
                return next(error);
            }

            req.user = user;

            next();
        });
    }
}

module.exports = Auth;