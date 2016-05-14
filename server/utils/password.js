"use strict";

var bcrypt = require('bcrypt-nodejs');
class Password {
    hash(password){
    return bcrypt.hashSync(password);
}
    compare(password, hashedPassword){
    return bcrypt.compareSync(password, hashedPassword);
}
}
module.exports = new Password();