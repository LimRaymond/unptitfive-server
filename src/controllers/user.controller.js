const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/user.model');
const config = require('../../config/config.json');

async function register(req, res) {
  const hash = await bcrypt.hash(req.body.password, 10);

  const newuser = new User({
    username: req.body.username,
    password: hash,
    email: req.body.email,
  });

  await newuser.save();

  return res.status(201).json({ message: 'User created' });
}

async function login(req, res) {
  const newtoken = jwt.sign(req.user._id.toHexString(), config.JWT_SECRET);
  await User.updateOne({ _id: req.user._id }, { token: newtoken });

  return res.status(200).cookie('auth', newtoken).json({
    message: 'Successful login',
    user: {
      id: req.user._id,
      username: req.user.username,
      email: req.user.email,
      is_admin: req.user.is_admin,
      is_mute: req.user.is_mute,
      is_ban: req.user.is_ban,
    },
  });
}

async function logout(req, res) {
  await User.updateOne({ _id: req.user._id }, { $unset: { token: 1 } });
  return res.status(200).json({ message: 'Successful logout' });
}

async function profile(req, res) {
  return res.status(200).json({
    user: {
      id: req.user._id,
      username: req.user.username,
      email: req.user.email,
      is_admin: req.user.is_admin,
      is_mute: req.user.is_mute,
      is_ban: req.user.is_ban,
    },
  });
}

async function editProfile(req, res) {
  const updates = {};

  if (req.body.username) {
    updates.username = req.body.username;
  }
  if (req.body.email) {
    updates.email = req.body.email;
  }
  if (req.body.password) {
    updates.password = await bcrypt.hash(req.body.password, 10);
  }
  await User.updateOne({ _id: req.user._id }, updates);
  return res.status(200).json({ message: 'Profile updated' });
}

exports.register = register;
exports.login = login;
exports.logout = logout;
exports.profile = profile;
exports.editProfile = editProfile;
