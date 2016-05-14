var revalidator = require('revalidator');

function createError(code, message) {
    var err = new Error();
    err.status = code;
    err.message = message;
    return err;
}

function getRequestBody(req) {
    switch (req.method) {
        case 'GET':
            return req.query || {};

        case 'POST':
        case 'PUT':
        case 'PATCH':
            return req.body || {};
        case 'DELETE':
            return req.query || {};
    }

    return false;
}

module.exports = function bodyValidator(schema) {
    return function (req, res, next) {
        if (schema) {
            var data = getRequestBody(req);
            if (!data) {
                res.status(400).json({
                    error: 400,
                    message:'bodyValidator does not support ' + req.method + ' requests'
                })
            } else {
                var result = revalidator.validate(data, schema);
                var message;
                if (!result.valid) {
                    if (schema.properties[result.errors[0].property].messages &&
                        schema.properties[result.errors[0].property].messages[result.errors[0].attribute]) {
                        message = result.errors[0].message
                    } else {
                        message = [
                            result.errors[0].property,
                            result.errors[0].message
                        ].join(' ');
                    }

                    res.status(400).json({
                        error: 400,
                        message: message
                    })

                } else {
                    next();
                }
            }
        } else {
            next();
        }
    }
}
