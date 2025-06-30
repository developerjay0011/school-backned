const Joi = require('joi');

const adminAuthValidation = {
    login: {
        body: Joi.object({
            username: Joi.string().required(),
            password: Joi.string().required()
        })
    }
};

module.exports = { adminAuthValidation };
