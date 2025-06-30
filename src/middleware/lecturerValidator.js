const Joi = require('joi');

const lecturerSchema = Joi.object({
    first_name: Joi.string()
        .required()
        .min(2)
        .max(255)
        .messages({
            'string.empty': 'First name is required',
            'string.min': 'First name must be at least 2 characters long',
            'string.max': 'First name cannot exceed 255 characters'
        }),

    last_name: Joi.string()
        .required()
        .min(2)
        .max(255)
        .messages({
            'string.empty': 'Last name is required',
            'string.min': 'Last name must be at least 2 characters long',
            'string.max': 'Last name cannot exceed 255 characters'
        }),

    start_time: Joi.string()
        .required()
        .pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
        .messages({
            'string.pattern.base': 'Start time must be in HH:mm format',
            'string.empty': 'Start time is required'
        }),

    end_time: Joi.string()
        .required()
        .pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
        .messages({
            'string.pattern.base': 'End time must be in HH:mm format',
            'string.empty': 'End time is required'
        }),

    course: Joi.string()
        .required()
        .max(255)
        .messages({
            'string.empty': 'Course is required',
            'string.max': 'Course name cannot exceed 255 characters'
        }),

    joining_date: Joi.date()
        .required()
        .messages({
            'date.base': 'Joining date must be a valid date',
            'any.required': 'Joining date is required'
        }),

    // Photo and certificates will be handled by multer middleware
    photo: Joi.string().allow(''),
    certificates: Joi.array().items(Joi.string()).default([])
});

module.exports = {
    validateLecturer: (data) => lecturerSchema.validate(data, { abortEarly: false })
};
