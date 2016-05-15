process.env.NODE_ENV = 'test';
var app = require('../../server/api');
var config = require('../../config');
var request = require('supertest')(app);
var chai = require('../helpers/chai');
var DB = require('../helpers/connection');

var baseUrl = '/api/v1';

var User = {
    email: 'test@gmail.com',
    password: 'developer'
};


before(function (done) {
    DB.prepare(done);
});

describe('LOGIN', function () {
    it('user login', function (done) {
        request
            .post(baseUrl + '/signin/basic')
            .send(User)
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.isNotNull(res.body.token);
                assert.isDefined(res.body.token);
                done();
            })
    });
});