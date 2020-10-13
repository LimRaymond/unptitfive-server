const Joi = require('joi');
const { customString, customObject } = require('../utils/joi');

const usernameSchema = customString.alphanum().min(3).max(30);
const passwordSchema = customString.pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'));
const emailSchema = customString.email();

async function register(req, res, next) {
  try {
    const registerSchema = customObject.append({
      username: usernameSchema.required(),
      password: passwordSchema.required(),
      password2: Joi.valid(Joi.ref('password')).messages({ 'any.only': 'Passwords must match' }),
      email: emailSchema.required(),
    });

    await registerSchema.validateAsync(req.body);

    return next();
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
}

async function login(req, res, next) {
  try {
    const loginSchema = customObject.append({
      username: customString.required(),
      password: customString.required(),
    });

    await loginSchema.validateAsync(req.body);

    return next();
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
}

async function editProfile(req, res, next) {
  try {
    const editProfileSchema = customObject.append({
      username: usernameSchema.optional(),
      password: passwordSchema.optional(),
      email: emailSchema.optional(),
    }).min(1);

    await editProfileSchema.validateAsync(req.body);

    return next();
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
}

exports.register = register;
exports.login = login;
exports.editProfile = editProfile;
