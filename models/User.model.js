const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const config = require('../config.json');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    token: {
        type: String,
    },
    is_mute: {
        type: Boolean,
        default: false,
    },
    is_ban: {
        type: Boolean,
        default: false,
    },
    is_admin: {
        type: Boolean,
        default: false,
    },
});

userSchema.statics.findByToken = function findByToken(token, cb) {
    return jwt.verify(token, config.JWT_SECRET, (err, decode) => {
        return this.findOne({ _id: decode, token }, (err, user) => {
            if (err) return cb(err);
            return cb(null, user);
        });
    });
};

const User = mongoose.model('User', userSchema);

module.exports = User;
