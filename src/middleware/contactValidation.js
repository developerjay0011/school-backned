const Joi = require('joi');

const contactValidation = {
    update: Joi.object({
        street_name: Joi.string().allow(null, '').optional(),
        postal_code: Joi.string().allow(null, '').optional(),
        city: Joi.string().allow(null, '').optional(),
        birth_date: Joi.alternatives().try(
            Joi.date(),
            Joi.string().allow(null, '', 'Invalid Date')
        ).optional(),
        place_of_birth: Joi.string().allow(null, '').optional(),
        country_of_birth: Joi.string().allow(null, '').optional(),
        phone: Joi.string().allow(null, '').optional(),
        email: Joi.string().email().allow(null, '').optional(),
        street_number: Joi.string().allow(null, '').optional(),
        remarks: Joi.string().allow(null, '').optional()
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

module.exports = {
    contactValidation,
    validate
};
