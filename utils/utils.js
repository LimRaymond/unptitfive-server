const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const config = require('../config.json');

function getUserByToken(token) {
    return new Promise((resolve, reject) => {
        jwt.verify(token, config.JWT_SECRET, (err, decode) => {
            // if (err) reject(err);
            User.findOne({ _id: decode, token }, (err, user) => {
                if (err) reject(err);
                resolve(user);
            });
        });
    });
}

function convertDate(str) {
    const date = new Date(str);
    const year = date.getFullYear();
    let month = date.getMonth();
    let day = date.getDate();
    let hours = date.getHours();
    let minutes = date.getMinutes();
    month = (month < 10) ? `0${month}` : month;
    day = (day < 10) ? `0${day}` : day;
    hours = (hours < 10) ? `0${hours}` : hours;
    minutes = (minutes < 10) ? `0${minutes}` : minutes;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (date.getTime() >= today.getTime()) {
        return (`${hours}:${minutes}`);
    }
    if ((date.getTime() < today.getTime())
    && (date.getTime() >= today.getTime() - (24 * 60 * 60 * 1000))) {
        return (`Hier ${hours}:${minutes}`);
    }
    return (`${day}/${month}/${year} ${hours}:${minutes}`);
}

exports.getUserByToken = getUserByToken;
exports.convertDate = convertDate;
