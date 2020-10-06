const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const config = require('../config.json');

function getUserByToken(token) {
    return new Promise((resolve, reject) => {
        jwt.verify(token, config.JWT_SECRET, (err, decode) => {
            User.findOne({ _id: decode, token }, (err, user) => {
                if (err) reject(err);
                resolve(user);
            });
        });
    });
}

exports.getUserByToken = getUserByToken;
