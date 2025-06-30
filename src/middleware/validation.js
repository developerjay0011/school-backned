const Joi = require('joi');

const userValidation = {
  create: Joi.object({
    username: Joi.string().required(),
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    phoneNumber: Joi.string().required(),
    email: Joi.string().email().required(),
    address: Joi.string().required(),
    password: Joi.string().min(6).required(),
    status: Joi.string().valid('Active', 'Inactive').required()
  }),

  update: Joi.object({
    username: Joi.string(),
    firstName: Joi.string(),
    lastName: Joi.string(),
    phoneNumber: Joi.string(),
    email: Joi.string().email(),
    address: Joi.string(),
    status: Joi.string().valid('Active', 'Inactive')
  }),

  login: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
  }),

  changePassword: Joi.object({
    password: Joi.string().min(6).required(),
    confirmPassword: Joi.string().valid(Joi.ref('password')).required()
  })
};

const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    next();
  };
};

module.exports = { userValidation, validate };
