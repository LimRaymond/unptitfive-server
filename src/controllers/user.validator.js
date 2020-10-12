const Joi = require('joi');
const User = require('../models/user.model');

const schema = Joi.object({
  username: Joi.string().alphanum().min(3).max(30)
    .required(),
  password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
  password2: Joi.ref('password'),
  email: Joi.string().email().required(),
}).with('password', 'password2');

async function register(req, res, next) {
  try {
    await schema.validateAsync(req.body);

    const user = await User.findOne({ username: req.body.username });

    if (user) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    const email = await User.findOne({ email: req.body.email });

    if (email) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    return next();
  } catch (err) {
    return res.status(400).json({ message: 'Invalid parameters', reason: err.message });
  }
}

exports.register = register;
