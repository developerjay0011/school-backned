const Joi = require('joi');

const userValidation = {
    create: Joi.object({
        position: Joi.object({
            position: Joi.string().required(),
            responsibility_authority: Joi.string().allow('', null),
            internal_external: Joi.string().valid('Internal', 'External', 'internal', 'external').insensitive().default('internal'),
            hierarchically_assigned_to: Joi.number().allow(null)
        }).required(),

        first_name: Joi.string().required().min(2).max(255),
        last_name: Joi.string().required().min(2).max(255),
        phone_number: Joi.string().required(),
        email: Joi.string().required().email(),
        street: Joi.string().required().min(5).max(255),
        pincode: Joi.string().required(),
        city: Joi.string().required().min(2).max(100),
        country: Joi.string().required().min(2).max(100),
        password: Joi.string().required().min(8).max(255),
        role: Joi.string().valid('super_admin', 'admin'),
        status: Joi.string().valid('Active', 'Inactive'),
        reason_non_participation: Joi.string().allow(null, '')
    }),

    update: Joi.object({
        position: Joi.object({
            id: Joi.number(),
            position: Joi.string().required(),
            responsibility_authority: Joi.string().allow('', null),
            internal_external: Joi.string().valid('Internal', 'External', 'internal', 'external').insensitive().default('internal'),
            hierarchically_assigned_to: Joi.number().allow(null)
        }),

        training: Joi.object({
            id: Joi.number(),
            topic: Joi.string().required(),
            quarter: Joi.string().valid('Q1', 'Q2', 'Q3', 'Q4').required(),
            year: Joi.number().integer().min(2000).max(2100).required(),
            actual_date: Joi.date().iso().required(),
            participation: Joi.string(),
            reason_non_participation: Joi.string().allow(null, ''),
            effectiveness: Joi.string().allow(null, ''),
            feedback_assessment: Joi.string().allow(null, '')
        }),

        first_name: Joi.string().min(2).max(255),
        last_name: Joi.string().min(2).max(255),
        phone_number: Joi.string().required(),
        email: Joi.string().email(),
        street: Joi.string().min(5).max(255),
        pincode: Joi.string().required(),
        city: Joi.string().min(2).max(100),
        country: Joi.string().min(2).max(100),
        password: Joi.string().min(8).max(255),
        role: Joi.string().valid('super_admin', 'admin'),
        status: Joi.string().valid('Active', 'Inactive'),
        reason_non_participation: Joi.string().allow(null, '')
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

module.exports = { userValidation, validate };
