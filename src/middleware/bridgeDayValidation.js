const Joi = require('joi');

const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

const bridgeDayValidation = {
  create: Joi.object({
    bridge_days: Joi.string().required().trim().min(1).max(255)
      .messages({
        'string.empty': 'Bridge days cannot be empty',
        'string.min': 'Bridge days must be at least 1 character long',
        'string.max': 'Bridge days cannot exceed 255 characters'
      }),
    date: Joi.string().required().pattern(dateRegex)
      .messages({
        'string.pattern.base': 'Date must be in YYYY-MM-DD format'
      })
  }),

  update: Joi.object({
    bridge_days: Joi.string().required().trim().min(1).max(255)
      .messages({
        'string.empty': 'Bridge days cannot be empty',
        'string.min': 'Bridge days must be at least 1 character long',
        'string.max': 'Bridge days cannot exceed 255 characters'
      }),
    date: Joi.string().required().pattern(dateRegex)
      .messages({
        'string.pattern.base': 'Date must be in YYYY-MM-DD format'
      })
  })
};

const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error) {
      const errorMessage = error.details.map(detail => detail.message).join(', ');
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: errorMessage
      });
    }
    next();
  };
};

module.exports = { bridgeDayValidation, validate };
