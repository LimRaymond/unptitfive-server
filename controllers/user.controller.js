const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/User.model');
const config = require('../config.json');

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

    return User.findByToken(token, (err, user) => {
        if (user) {
            return res.status(400).json({ message: 'User already logged in' });
        }

        return User.findOne({ username: req.body.username }, (err, user) => {
            if (!user) return res.status(400).json({ message: 'Unknown username' });

            return bcrypt.compare(req.body.password, user.password, (err, result) => {
                if (!result) return res.status(400).json({ message: 'Wrong password' });

                if (user.is_ban) return res.status(400).json({ message: 'You are currently banned' });

                const newtoken = jwt.sign(user._id.toHexString(), config.JWT_SECRET);
                return User.updateOne({ _id: user._id }, { token: newtoken }, () => {
                    return res.status(200).cookie('auth', newtoken).json({
                        isAuth: true,
                        id: user._id,
                        username: user.username,
                        is_admin: user.is_admin,
                        is_mute: user.is_mute,
                        is_ban: user.is_ban,
                    });
                });
            });
        });
    });
}

async function logout(req, res) {
    const token = req.cookies.auth;

    return User.findByToken(token, (err, user) => {
        if (user) {
            return User.updateOne({ _id: user._id }, { $unset: { token: 1 } }, (err) => {
                if (err) return res.status(400).json({ message: 'Error' });
                return res.status(200).json({ message: 'Successful logout' });
            });
        }
        return res.status(400).json({ message: 'Not logged in' });
    });
}

async function profile(req, res) {
    const token = req.cookies.auth;

    return User.findByToken(token, (err, user) => {
        if (user) {
            return res.status(200).json({
                isAuth: true,
                id: user._id,
                username: user.username,
                is_admin: user.is_admin,
                is_mute: user.is_mute,
                is_ban: user.is_ban,
            });
        }
        return res.status(400).json({ message: 'Not logged in' });
    });
}

exports.register = register;
exports.login = login;
exports.logout = logout;
exports.profile = profile;
