const Joi = require('joi');

const examValidation = {
    create: Joi.object({
        exam_from: Joi.date().required(),
        exam_to: Joi.date().required().min(Joi.ref('exam_from')),
        exam_type: Joi.string().required(),
        exam_result: Joi.string().valid('pass', 'fail').allow(null),
    }),

    update: Joi.object({
        exam_from: Joi.date(),
        exam_to: Joi.date().min(Joi.ref('exam_from')),
        exam_type: Joi.string().required(),
        exam_result: Joi.string().valid('pass', 'fail').allow(null),
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
    examValidation,
    validate
};
