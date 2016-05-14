'use strict';
var Base = require('./base');
var validator = require('./../../utils/bodyValidator');

class SigninValidator extends Base{
    static basic (req, res, next){
        return validator({
            properties: {
                password: {
                    required: true,
                    allowEmpty: false,
                    type: 'string',
                    minLength: 5,
                    maxLength: 30
                },
                email: {
                    required: true,
                    allowEmpty: false,
                    type: 'string',
                    format: 'email',
                    minLength: 5,
                    maxLength: 100
                }
            }
        })(req, res, next);
    }
}

module.exports = SigninValidator;