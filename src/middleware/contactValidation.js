const Joi = require('joi');

const contactValidation = {
    update: Joi.object({
        street_name: Joi.string(),
        postal_code: Joi.string(),
        city: Joi.string(),
        birth_date: Joi.date().allow(null),
        place_of_birth: Joi.string().allow('', null),
        country_of_birth: Joi.string().allow('', null),
        phone: Joi.string().pattern(/^\+?[1-9]\d{1,14}$/).allow('', null),
        email: Joi.string().email(),
        street_number: Joi.string().allow('', null),
        remarks: Joi.string().allow('', null)
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
