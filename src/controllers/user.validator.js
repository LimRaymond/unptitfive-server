const Joi = require('joi');
const bcrypt = require('bcrypt');
const User = require('../models/user.model');

const registerSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(30)
    .required(),
  password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
  password2: Joi.ref('password'),
  email: Joi.string().email().required(),
}).with('password', 'password2');

async function register(req, res, next) {
  try {
    await registerSchema.validateAsync(req.body);

    if (await User.findOne({ username: req.body.username })) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    if (await User.findOne({ email: req.body.email })) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    return next();
  } catch (err) {
    return res.status(400).json({ message: 'Invalid parameters', reason: err.message });
  }
}

const loginSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
});

async function login(req, res, next) {
  try {
    await loginSchema.validateAsync(req.body);
    const user = await User.findOne({ username: req.body.username });

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
    req.user = user;
    return next();
  } catch (err) {
    return res.status(400).json({ message: 'Invalid parameters', reason: err.message });
  }
}

const editProfileSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(30)
    .optional(),
  password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).optional(),
  email: Joi.string().email().optional(),
}).min(1);

async function editProfile(req, res, next) {
  try {
    await editProfileSchema.validateAsync(req.body);

    if (req.body.username) {
      if (await User.findOne({ username: req.body.username })) {
        return res.status(400).json({ message: 'Username already exists' });
      }
    }
    if (req.body.email) {
      if (await User.findOne({ email: req.body.email })) {
        return res.status(400).json({ message: 'Email already exists' });
      }
    }
    return next();
  } catch (err) {
    return res.status(400).json({ message: 'Invalid parameters', reason: err.message });
  }
}

exports.register = register;
exports.login = login;
exports.editProfile = editProfile;
