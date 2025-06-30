const Joi = require('joi');

const examinationValidation = {
  create: Joi.object({
    examination: Joi.string().required().trim().min(2).max(255)
      .messages({
        'string.min': 'Examination name must be at least 2 characters long',
        'string.max': 'Examination name cannot exceed 255 characters'
      })
  }),

  update: Joi.object({
    examination: Joi.string().required().trim().min(2).max(255)
      .messages({
        'string.min': 'Examination name must be at least 2 characters long',
        'string.max': 'Examination name cannot exceed 255 characters'
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

module.exports = { examinationValidation, validate };
