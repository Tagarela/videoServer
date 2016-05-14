var db = require('./db');

var defaults = {
    server: {
        port: parseInt(process.env.PORT) || 3001,
        host: process.env.HOST || 'localhost',
        https: {
            port: 8888
        }
    },
    db: db,
    jwtKey: 'JB15mAmB8894Zq2',
    "uploadFiles": {
        "supporVideoTypes":[
            "video/mp4",
            "video/quicktime"
        ]
    }
};

defaults.server.baseUrl = ['http://', defaults.server.host, ':', defaults.server.port].join('');

module.exports = defaults;