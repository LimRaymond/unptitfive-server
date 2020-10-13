const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/user.model');
const config = require('../../config/config.json');

async function register(req, res) {
  if (await User.findOne({ username: { $regex: `^${req.body.username}$`, $options: 'i' } })) {
    return res.status(400).json({ message: 'Username already exists' });
  }
  if (await User.findOne({ email: req.body.email.toLowerCase() })) {
    return res.status(400).json({ message: 'Email already exists' });
  }

  const hash = await bcrypt.hash(req.body.password, 10);

  const newuser = new User({
    username: req.body.username,
    password: hash,
    email: req.body.email.toLowerCase(),
  });

  await newuser.save();

  return res.status(201).json({ message: 'User created' });
}

async function login(req, res) {
  const user = await User.findOne({ username: req.body.username });

  if (!user || !await bcrypt.compare(req.body.password, user.password)) {
    return res.status(400).json({ message: 'Incorrect username or password' });
  }
  if (user.is_ban) {
    return res.status(400).json({ message: 'You are currently banned' });
  }

  const newtoken = jwt.sign(user._id.toHexString(), config.JWT_SECRET);
  await User.updateOne({ _id: user._id }, { token: newtoken });

  return res.status(200).cookie('auth', newtoken).json({
    message: 'Successful login',
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
      is_admin: user.is_admin,
      is_mute: user.is_mute,
      is_ban: user.is_ban,
      token: newtoken,
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
      token: req.user.token,
    },
  });
}

async function editProfile(req, res) {
  const updates = req.body;

  if (updates.username && await User.findOne({ username: { $regex: `^${updates.username}$`, $options: 'i' } })) {
    return res.status(400).json({ message: 'Username already exists' });
  }
  if (updates.email) {
    updates.email = updates.email.toLowerCase();
    if (await User.findOne({ email: updates.email })) {
      return res.status(400).json({ message: 'Email already exists' });
    }
  }

  if (updates.password) {
    updates.password = await bcrypt.hash(updates.password, 10);
  }
  await User.updateOne({ _id: req.user._id }, updates);
  return res.status(200).json({ message: 'Profile updated' });
}

exports.register = register;
exports.login = login;
exports.logout = logout;
exports.profile = profile;
exports.editProfile = editProfile;
