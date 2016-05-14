var Signup = require('./signupValidator');
var Signin = require('./signinValidator');
var Video = require('./videoValidator');

module.exports = {
    signup: Signup,
    signin: Signin,
    video: Video
};