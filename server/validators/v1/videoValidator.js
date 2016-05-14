'use strict';
var Base = require('./base');
var validator = require('./../../utils/bodyValidator');
var config = require('./../../../config');

class VideoValidator extends Base{

    static videoTime (req, res, next){
        /** validate time **/
        if (!req.body.startTime || !req.body.endTime) {
            var err = new Error();
            err.status = 400;
            err.message = 'startTime and endTime can not be empty!';
            return next(err);
        }else{
            let re = /^\d{1,2}:\d{1,2}:\d{2}$/;
            if(!req.body.startTime.match(re) || !req.body.endTime.match(re)){
                var err = new Error();
                err.status = 400;
                err.message = 'Invalid format of startTime and endTime. Must be 00:00:00';
                return next(err);
            }
        }
        next();
    }

    static create (req, res, next){
        /** validate file exist**/
        if(!req.files){
            var err = new Error();
            err.status = 400;
            err.message = 'File can not be empty!';
            return next(err);
         }

        if (!req.files.length && !req.files.video) {
            var err = new Error();
            err.status = 400;
            err.message = 'Video can not be empty!';
            return next(err);
        }

        /** validate file format **/
        if (config.uploadFiles.supporVideoTypes.indexOf(req.files.video.type) === -1) {
            var err = new Error();
            err.status = 400;
            err.message = 'Invalid format of file!';
            return next(err);
        }

        next();
    }


}

module.exports = VideoValidator;