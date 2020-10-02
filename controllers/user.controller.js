const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/User.model');

async function register(req, res) {
    if (req.body.password !== req.body.password2) {
        return res.status(400).json({ message: 'Password not match' });
    }

    return User.findOne({ username: req.body.username }, (err, user) => {
        if (err) {
            return res.status(400).json({ message: 'Error' });
        }

        if (user) {
            return res.status(400).json({ message: 'Username already exits' });
        }

        return bcrypt.hash(req.body.password, 10, (err, hash) => {
            if (err) {
                return res.status(400).json({ message: 'Error' });
            }

            const newuser = new User({
                username: req.body.username,
                password: hash,
            });

            return newuser.save((err) => {
                if (err) {
                    return res.status(400).json({ message: 'Error' });
                }

                return res.status(200).json({ message: 'User created' });
            });
        });
    });
}

async function login(req, res) {
    const token = req.cookies.auth;

    return jwt.verify(token, 'secret', (err, decode) => {
        return User.findOne({ _id: decode, token }, (err, user) => {
            if (user) {
                return res.status(400).json({ message: 'User already logged in' });
            }

            return User.findOne({ username: req.body.username }, (err, user) => {
                if (!user) return res.status(400).json({ message: 'Unknown username' });

                return bcrypt.compare(req.body.password, user.password, (err, result) => {
                    if (!result) return res.status(400).json({ message: 'Wrong password' });

                    const newtoken = jwt.sign(user._id.toHexString(), 'secret');
                    return User.updateOne({ _id: user._id }, { token: newtoken }, () => {
                        return res.status(200).cookie('auth', newtoken).json({
                            isAuth: true,
                            id: user._id,
                            username: user.username,
                        });
                    });
                });
            });
        });
    });
}

async function logout(req, res) {
    const token = req.cookies.auth;

    return jwt.verify(token, 'secret', (err, decode) => {
        return User.findOne({ _id: decode, token }, (err, user) => {
            if (user) {
                return User.updateOne({ _id: user._id }, { $unset: { token: 1 } }, (err) => {
                    if (err) return res.status(400).json({ message: 'Error' });
                    return res.status(200).json({ message: 'Successful logout' });
                });
            }
            return res.status(400).json({ message: 'Not logged in' });
        });
    });
}

async function profile(req, res) {
    const token = req.cookies.auth;

    return jwt.verify(token, 'secret', (err, decode) => {
        return User.findOne({ _id: decode, token }, (err, user) => {
            if (user) {
                return res.status(200).json({
                    isAuth: true,
                    id: user._id,
                    username: user.username,
                });
            }
            return res.status(400).json({ message: 'Not logged in' });
        });
    });
}

exports.register = register;
exports.login = login;
exports.logout = logout;
exports.profile = profile;
