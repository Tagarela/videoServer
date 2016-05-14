'use strict';
var Base = require('./base');
var validator = require('./../../utils/bodyValidator');

class SignupValidator extends Base{

    static validateBase (req, res, next) {
        return validator({
            properties: {
                firstName: {
                    required: true,
                    allowEmpty: false,
                    type: 'string',
                    maxLength: 30
                },
                lastName: {
                    required: true,
                    allowEmpty: false,
                    type: 'string',
                    maxLength: 30
                },
                password: {
                    required: true,
                    allowEmpty: false,
                    type: 'string',
                    minLength: 5,
                    maxLength: 30
                },
                confirmPassword: {
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

module.exports = SignupValidator;