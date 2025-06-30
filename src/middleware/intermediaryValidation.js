const Joi = require('joi');

const intermediaryValidation = {
  create: Joi.object({
    intermediary: Joi.string().required().trim(),
    agent_email: Joi.string().allow(null).email().trim(),
    agent_tel: Joi.number().integer().allow(null),
    internal_external: Joi.string().valid('Internal', 'External').required(),
  }),

  update: Joi.object({
    intermediary: Joi.string().optional().trim(),
    agent_email: Joi.string().allow(null).email().trim(),
    agent_tel: Joi.number().integer().allow(null),
    internal_external: Joi.string().valid('Internal', 'External').required(),
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

module.exports = { intermediaryValidation, validate };
