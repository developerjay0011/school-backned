const Joi = require('joi');

const assessmentValidation = {
    generateLink: {
        body: Joi.object({
            first_name: Joi.string(),
            last_name: Joi.string()
        })
    },
    submitResponses: {
        body: Joi.object({
            first_name: Joi.string().required(),
            last_name: Joi.string().required(),
            signature_image: Joi.string().required(),
            responses: Joi.array().items(
                Joi.object({
                    questionId: Joi.number().required(),
                    selectedOptionId: Joi.number().required()
                })
            ).required()
        })
    },
    addComment: {
        params: Joi.object({
            id: Joi.number().required()
        }),
        body: Joi.object({
            comment: Joi.string().required()
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

module.exports = { assessmentValidation, validate };
