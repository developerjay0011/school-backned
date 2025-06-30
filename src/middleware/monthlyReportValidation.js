const Joi = require('joi');

const monthlyReportValidation = {
    generate: {
        body: Joi.object({
            month: Joi.number().required().min(1).max(12),
            year: Joi.number().required().min(2000).max(2100)
        })
    }
};

module.exports = { monthlyReportValidation };
