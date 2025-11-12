const jwt = require('jsonwebtoken');
const config = require('../config');

function generateToken(payload, opts = {expiresIn: '7d'}){
    return jwt.sign(payload,config.JWT_SECRET,opts);
}

module.exports = {
    generateToken
};