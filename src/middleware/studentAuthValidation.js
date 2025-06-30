const Joi = require('joi');

const studentAuthValidation = {
    login: {
        body: Joi.object({
            student_id: Joi.string().required(),
            password: Joi.string().required()
        })
    }
};

module.exports = studentAuthValidation;
