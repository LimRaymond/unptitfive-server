const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/user.model');
const config = require('../../config/config.json');
const utils = require('../utils/utils');

async function register(req, res) {
  if (!req.body.username || !req.body.password || !req.body.password2) {
    return res.status(400).json({ message: 'Missing parameters' });
  }

  if (req.body.password !== req.body.password2) {
    return res.status(400).json({ message: 'Password not match' });
  }

  const user = await User.findOne({ username: req.body.username });

  if (user) {
    return res.status(400).json({ message: 'Username already exists' });
  }

  const hash = await bcrypt.hash(req.body.password, 10);

  const newuser = new User({
    username: req.body.username,
    password: hash,
  });

  await newuser.save();

  return res.status(201).json({ message: 'User created' });
}

async function login(req, res) {
  const token = req.cookies.auth;

  let user = await utils.getUserByToken(token);
  if (user) {
    return res.status(400).json({ message: 'Already logged in' });
  }

  user = await User.findOne({ username: req.body.username });
  if (!user) {
    return res.status(400).json({ message: 'Unknown username' });
  }

  const match = await bcrypt.compare(req.body.password, user.password);
  if (!match) {
    return res.status(400).json({ message: 'Wrong password' });
  }

  if (user.is_ban) {
    return res.status(400).json({ message: 'You are currently banned' });
  }

  const newtoken = jwt.sign(user._id.toHexString(), config.JWT_SECRET);
  await User.updateOne({ _id: user._id }, { token: newtoken });

  return res.status(200).cookie('auth', newtoken).json({
    isAuth: true,
    id: user._id,
    username: user.username,
    is_admin: user.is_admin,
    is_mute: user.is_mute,
    is_ban: user.is_ban,
  });
}

async function logout(req, res) {
  const token = req.cookies.auth;
  const user = await utils.getUserByToken(token);

  if (!user) {
    return res.status(400).json({ message: 'Not logged in' });
  }
  await User.updateOne({ _id: user._id }, { $unset: { token: 1 } });
  return res.status(200).json({ message: 'Successful logout' });
}

async function profile(req, res) {
  const token = req.cookies.auth;
  const user = await utils.getUserByToken(token);

  if (!user) {
    return res.status(400).json({ message: 'Not logged in' });
  }
  return res.status(200).json({
    isAuth: true,
    id: user._id,
    username: user.username,
    is_admin: user.is_admin,
    is_mute: user.is_mute,
    is_ban: user.is_ban,
  });
}

async function editProfile(req, res) {
  const token = req.cookies.auth;
  let user = await utils.getUserByToken(token);

  if (!user) {
    return res.status(400).json({ message: 'Not logged in' });
  }
  const updates = {};

  if (req.body.username && req.body.username !== user.username) {
    user = await User.findOne({ username: req.body.username });
    if (user) {
      return res.status(400).json({ message: 'Username already exits' });
    }
    updates.username = req.body.username;
  }
  if (req.body.password) {
    updates.password = await bcrypt.hash(req.body.password, 10);
  }
  await User.updateOne({ _id: user._id }, updates);
  return res.status(200).json({ message: 'Profile updated' });
}

exports.register = register;
exports.login = login;
exports.logout = logout;
exports.profile = profile;
exports.editProfile = editProfile;
