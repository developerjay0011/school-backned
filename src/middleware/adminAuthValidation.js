const Joi = require('joi');

const adminAuthValidation = {
    login: {
        body: Joi.object({
            email: Joi.string().email().required(),
            password: Joi.string().required()
        })
    }
};

module.exports = { adminAuthValidation };
