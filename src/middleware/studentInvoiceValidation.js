const Joi = require('joi');

const studentInvoiceValidation = {
    toggleAutoDispatch: {
        body: Joi.object({
            enabled: Joi.boolean().required()
        })
    },
    create: {
        body: Joi.object({
            invoice_number: Joi.string().required(),
            invoice_date: Joi.date().required(),
            amount: Joi.number().precision(2).required(),
            invoice_type: Joi.string().required(),
            reminder_sent: Joi.boolean(),
            reminder_auto_dispatch: Joi.boolean(),
            pdf_url: Joi.string().uri().allow(null),
            paid: Joi.boolean(),
            paid_date: Joi.date().allow(null)
        })
    },
    update: {
        body: Joi.object({
            invoice_number: Joi.string(),
            invoice_date: Joi.date(),
            amount: Joi.number().precision(2),
            invoice_type: Joi.string().required(),
            reminder_sent: Joi.boolean(),
            reminder_auto_dispatch: Joi.boolean(),
            pdf_url: Joi.string().uri().allow(null),
            paid: Joi.boolean(),
            paid_date: Joi.date().allow(null)
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

module.exports = { studentInvoiceValidation, validate };
