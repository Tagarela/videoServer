"use strict";

class Controller {
    constructor (version) {
    this.version = version;

    /**
     * validate skip and count parameters for getting any resource
     * @param req
     * @param res
     * @param next
     * @returns {*}
     * @private
     */
    this.validateLimits  = function (req, res, next) {
        req.query.count = parseInt(req.query.count) ? parseInt(req.query.count) : 50;
        req.query.skip = parseInt(req.query.skip) ? parseInt(req.query.skip) : 0;

        return next();
    };
}
}

module.exports = Controller;