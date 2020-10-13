const Joi = require('joi');

const customString = Joi.string()
  .messages({
    'string.base': '{#label} is not a valid string',
    'string.empty': '{#label} is empty',
    'string.email': '{#label} is not a valid email address',
    'string.pattern.base': '{#label} fails to match the required pattern: {#regex}',
    'string.alphanum': '{#label} must only contain alphanumeric characters',
    'string.min': '{#label} is shorter than expected (min: {#limit})',
    'string.max': '{#label} is longer than expected (max: {#limit})',
    'any.required': '{#label} is required',
  });

const customObject = Joi.object()
  .messages({
    'object.unknown': '{#label} is not allowed',
    'object.min': 'Not enough key provided (min: {#limit})',
  });

exports.customString = customString;
exports.customObject = customObject;
