const Joi = require('joi');

const studentValidation = {
    create: Joi.object({
        // Student Data
        voucher_type: Joi.string().valid('BGS', 'AVGS','PRIVAT').required(),
        salutation: Joi.string().valid('Herr', 'Frau', 'Drivers').required(),
        first_name: Joi.string().required(),
        last_name: Joi.string().required(),
        date_of_entry: Joi.date().required(),
        date_of_exit: Joi.date().allow(null),
        measures: Joi.string().required(),
        measures_id: Joi.number().integer().allow(null),
        intermediary_internal: Joi.string().required(),
        lecturer: Joi.string().allow(null, ''),

        // Settings Data
        settings: Joi.object({
            permission_to_sign_retroactively: Joi.boolean().default(false),
            receive_teaching_materials: Joi.boolean().default(false),
            face_to_face_instruction: Joi.boolean().default(false),
            online_instruction: Joi.boolean().default(false),
            surveyed_after_6_months: Joi.boolean().default(false),
            mediated: Joi.boolean().default(false)
        }).required(),

        // Authority Data
        authority: Joi.object({
            name: Joi.string().allow('', null),
            bg_number: Joi.string().required(),
            team: Joi.string().allow('', null),
            contact_person: Joi.string().allow('', null),
            routing_id: Joi.number().allow(null),
            email: Joi.string().email().allow('', null),
            tel: Joi.string().allow('', null),
            street: Joi.string().allow('', null),
            postal_code: Joi.string().allow('', null),
            city: Joi.string().allow('', null)
        }).required()
    }),

    update: Joi.object({
        // Student Data
        voucher_type: Joi.string().valid('BGS', 'AVGS','PRIVAT'),
        salutation: Joi.string().valid('Herr', 'Frau', 'Drivers'),
        first_name: Joi.string(),
        last_name: Joi.string(),
        date_of_entry: Joi.date(),
        date_of_exit: Joi.date().allow(null),
        measures: Joi.string(),
        measures_id: Joi.number().integer().allow(null),
        intermediary_internal: Joi.string(),
        lecturer: Joi.string().allow(null, ''),

        // Settings Data
        settings: Joi.object({
            permission_to_sign_retroactively: Joi.boolean(),
            receive_teaching_materials: Joi.boolean(),
            face_to_face_instruction: Joi.boolean(),
            online_instruction: Joi.boolean(),
            surveyed_after_6_months: Joi.boolean(),
            mediated: Joi.boolean()
        }),

        // Authority Data
        authority: Joi.object({
            name: Joi.string(),
            bg_number: Joi.string(),
            team: Joi.string().allow('', null),
            contact_person: Joi.string().allow('', null),
            routing_id: Joi.number().allow(null),
            email: Joi.string().email().allow('', null),
            tel: Joi.string().allow('',null),
            street: Joi.string(),
            postal_code: Joi.string(),
            city: Joi.string()
        }),

        // Invoice Recipient Data
        invoice_recipient: Joi.object({
            company: Joi.string().allow('', null),
            contact_person: Joi.string().allow('', null),
            routing_id: Joi.string().allow('', null),
            email: Joi.string().email().allow('', null),
            street: Joi.string().allow('', null),
            postal_code: Joi.string().allow('', null),
            city: Joi.string().allow('', null)
        })
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
    studentValidation,
    validate
};
