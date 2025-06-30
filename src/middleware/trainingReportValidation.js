const Joi = require('joi');

const trainingReportValidation = {
    create: {
        body: Joi.object({
            nr: Joi.number().required(),
            title: Joi.string().required(),
            description: Joi.string().required(),
            ue: Joi.string().required(),
            signature: Joi.string().pattern(/^data:image\/(png|jpeg|jpg|gif);base64,/).required().messages({
                'string.pattern.base': 'Signature must be a valid base64 encoded image'
            })
        })
    },
    update: {
        body: Joi.object({
            nr: Joi.number().required(),
            title: Joi.string().required(),
            description: Joi.string().required(),
            ue: Joi.string().required(),
            signature: Joi.string().pattern(/^data:image\/(png|jpeg|jpg|gif);base64,/).required().messages({
                'string.pattern.base': 'Signature must be a valid base64 encoded image'
            })
        })
    }
};

module.exports = { trainingReportValidation };
