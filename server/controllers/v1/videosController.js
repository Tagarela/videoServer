"use strict";
var Controller = require('./../../utils/controller');
var log = require('./../../utils/logger');
var ffmpeg = require('fluent-ffmpeg');
var fs = require('fs-extra');
var Video = require('./../../models/v1').videos;
var moment = require('moment');
var Validator = require('./../../validators/v1').video;

/**
 * Video controller
 */
class VideosController extends Controller {

    constructor(version){
        super(version);
        this.create = [Validator.create, Validator.videoTime, this._createUserFolders, this._loadVideo];
        this.getVideoStatus = [this._createUserFolders, this._getVideoStatus];
        this.getVideo = [this._getVideo];
        this.restartUploadVideo = [Validator.videoTime, this._createUserFolders, this._restartUploadVideo]
    }

    /**
     * create user folders
     */
    _createUserFolders(req, res, next){
        //get user folder
        var userFolderPath = process.cwd() + '/uploads/' + req.user.id;
        //create folders if not exist
        if (!fs.existsSync(userFolderPath)){
            fs.mkdirSync(userFolderPath);
            fs.mkdirSync(userFolderPath + '/videos');
            fs.mkdirSync(userFolderPath + '/videos/tmp');
            fs.mkdirSync(userFolderPath + '/videos/video');
        }
        let startTime = moment(req.body.startTime, 'hh:mm:ss');
        let endTime = moment(req.body.endTime, 'hh:mm:ss');
        let duration = endTime.diff(startTime, 'seconds');
        if(duration <= 0){
            var err = new Error();
            err.status = 400;
            err.message = 'endTime must be bigger then start time';
            return next(err);
        }
        req.duration = duration;

        next();
    }

    /**
     * load video on server
     *
     * @param {object} req
     * @param {object} res
     * @param {function} next
     *
     * @private
     */
    _loadVideo(req, res, next){
        let video = req.files.video;
        //get tmp path
        let videoFolderPath = process.cwd() + '/uploads/' + req.user.id + '/videos';

        let newVideoName = req.user.id + '_' + moment().unix() + '_' + '.'+(video.type.split('/'))[1];
        /** create video model **/
        let videoModel = {
            userId: req.user._id,
            name: newVideoName,
            originName: video.name,
            type: video.type,
            startTime: req.body.startTime,
            endTime: req.body.endTime,
            status: 0
        };

        /** copy origin video as it can be removed by the system **/
        fs.copySync(video.path, videoFolderPath + '/tmp/ ' + newVideoName);

        Video.create(videoModel, function (err, result) {
            if (err) return next(err);
            try {
                ffmpeg(video.path)
                    .setStartTime(req.body.startTime)
                    .setDuration(req.duration)
                    .output(videoFolderPath + '/video/' + newVideoName)
                    .on('end', function (err) {
                        if (!err) {
                            console.log('conversion Done');
                        }
                        result.status = 1;
                        result.save();
                        /** remove tmp video as we not need it **/
                        fs.unlinkSync(videoFolderPath + '/tmp/ ' + newVideoName);
                    })
                    .on('error',function (err) {
                        result.status = 2;
                        result.save();
                        console.log('error: ', + err);
                    }).run();
            } catch (e) {
                console.log(e);
            }

            res.send({id: result._id});
        });

    }

    /**
     * get video status
     */
    _getVideoStatus(req, res, next){
        if (!req.params.id) {
            var err = new Error();
            err.status = 422;
            err.message = 'video Id is empty!';
            return next(err);
        }
        Video.findById(req.params.id, function (err, video) {
            if (err) return next(err);

            if (!video) {
                let error = new Error();
                error.message = 'not found';
                error.status = 401;
                return next(error);
            }

            res.send({status: video.status});
        });
    }

    /**
     * get video by id
     */
    _getVideo(req, res, next){
        if (!req.params.id) {
            var err = new Error();
            err.status = 422;
            err.message = 'video Id is empty!';
            return next(err);
        }

        Video.findById(req.params.id, function (err, video) {
            if (err) return next(err);

            if (!video) {
                let error = new Error();
                error.message = 'not found';
                error.status = 401;
                return next(error);
            }

//            video.link = config.server.baseUrl+'/tmp/'+video.name;
//            console.log(config.server.baseUrl+'/tmp/'+video.name);
            res.send(video);
        });
    }

    /**
     * restart upload video
     */
    _restartUploadVideo(req, res, next){
        let videoFolderPath = process.cwd() + '/uploads/' + req.user.id + '/videos';
        if (!req.params.id) {
            var err = new Error();
            err.status = 422;
            err.message = 'video Id is empty!';
            return next(err);
        }
        Video.findById(req.params.id, function (err, video) {
            if (err) return next(err);

            if (!video) {
                let error = new Error();
                error.message = 'not found';
                error.status = 404;
                return next(error);
            }

            if(video.status != 2){
                let error = new Error();
                error.message = 'video uploading was success';
                error.status = 409;
                return next(error);
            }

            video.status = 0;
            video.startTime = req.body.startTime;
            video.endTime = req.body.endTime;

            video.save();

            try {
                ffmpeg(videoFolderPath + '/tmp/' + video.name)
                    .setStartTime(req.body.startTime)
                    .setDuration(req.duration)
                    .output(videoFolderPath + '/video/' +  video.name)
                    .on('end', function (err) {
                        if (!err) {
                            console.log('conversion Done');
                            video.status = 1;
                            video.save();
                            /** remove tmp video as we not need it **/
                            fs.unlinkSync(videoFolderPath + '/tmp/ ' + newVideoName);
                        }else{
                            log.error(err);
                        }
                    })
                    .on('error',function (err) {
                        console.log(err);
                        log.error('error on upload video');
                        video.status = 2;
                        video.save();
                    }).run();
            } catch (e) {
                console.log(e);
            }

            res.send({video});

        });

    }
}

module.exports = VideosController;
