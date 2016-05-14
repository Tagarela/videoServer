"use strict";

var Controller = require('./../../utils/controller');


class UsersController extends Controller {
    constructor (version){
        super (version);
        this.get =  [this.getUsers];

    }

    /**
     * TODO get user api
     * get user by id
     * @param req
     * @param res
     * @param next
     * @private
     */
    getUsers (req, res, next){
        res.send({});
    }

}

module.exports = UsersController;
