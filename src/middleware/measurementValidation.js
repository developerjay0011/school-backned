const Joi = require('joi');

const measurementValidation = {
  create: Joi.object({
    measures_number: Joi.string().required(),
    measures_title: Joi.string().required().trim(),
    months: Joi.number().required().positive(),
    according_to_paragraph: Joi.string().required().trim(),
    show_in_documents: Joi.boolean().default(true)
  }),

  update: Joi.object({
    measures_number: Joi.string().optional(),
    measures_title: Joi.string().trim(),
    months: Joi.number().positive(),
    according_to_paragraph: Joi.string().trim(),
    show_in_documents: Joi.boolean()
  }).min(1) // At least one field must be provided for update
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

module.exports = { measurementValidation, validate };
