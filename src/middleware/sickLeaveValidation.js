const Joi = require('joi');

const sickLeaveValidation = {
    create: {
        body: Joi.object({
            date_from: Joi.date().required(),
            date_until: Joi.date().required().min(Joi.ref('date_from')),
            status: Joi.string().valid('E', 'UE', 'K', 'S').required()
                .messages({
                    'any.only': 'Status must be one of: E (excused), UE (unexcused), K (sick), S (other)'
                }),
            description: Joi.string().allow(null, '')
        })
    },
    update: {
        body: Joi.object({
            date_from: Joi.date(),
            date_until: Joi.date().min(Joi.ref('date_from')),
            status: Joi.string().valid('E', 'UE', 'K', 'S')
                .messages({
                    'any.only': 'Status must be one of: E (excused), UE (unexcused), K (sick), S (other)'
                }),
            description: Joi.string().allow(null, '')
        })
    }
};

const validate = (schema) => {
    return (req, res, next) => {
        const validationResults = {};
        ['body', 'query', 'params'].forEach(key => {
            if (schema[key]) {
                const validation = schema[key].validate(req[key]);
                if (validation.error) {
                    validationResults[key] = validation.error.details;
                }
            }
        });

        if (Object.keys(validationResults).length > 0) {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: validationResults
            });
        }

        next();
    };
};

module.exports = { sickLeaveValidation, validate };
