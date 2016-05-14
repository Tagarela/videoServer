var fs = require('fs');
var config = require('../../config');

function renderStaticHtmlFile (path) {
    return function (req, res, next) {
        fs.createReadStream(__dirname + '/../../frontend/' + path)
            .pipe(res);
    }
}

module.exports = {
    frontendApp: renderStaticHtmlFile('swagger/index.html')
};