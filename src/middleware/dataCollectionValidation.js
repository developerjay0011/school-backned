const Joi = require('joi');

const languageLevelSchema = Joi.string().valid('Mother Tongue', 'Verhandlungssicher', 'Very good', 'Good', 'Basic knowledge');

const dataCollectionValidation = {
    generateLink: Joi.object({}).allow(null),
    
    submitResponses: {
        body: Joi.object({
            basic_info: Joi.object({
                interested_measure: Joi.string().required(),
                entry_date: Joi.date().required(),
                departure_date: Joi.date().required(),
                measures_id: Joi.number().integer().allow(null),
                first_name: Joi.string().required(),
                last_name: Joi.string().required(),
                street: Joi.string().required(),
                house_number: Joi.string().required(),
                plz: Joi.string().required(),
                city: Joi.string().required(),
                birth_date: Joi.date().required(),
                place_of_birth: Joi.string().required(),
                country_of_birth: Joi.string().required(),
                email: Joi.string().email().required()
            }).required(),

            languages: Joi.object({
                german: languageLevelSchema.required(),
                english: languageLevelSchema.required(),
                french: languageLevelSchema.required(),
                turkish: languageLevelSchema.required(),
                arabic: languageLevelSchema.required(),
                other: languageLevelSchema.required()
            }).optional(),

            special_knowledge: Joi.object({
                knowledge_1: Joi.string().required(),
                knowledge_2: Joi.string().allow('').optional(),
                knowledge_3: Joi.string().allow('').optional()
            }).required(),

            personal_suitability: Joi.object({
                shift_system: Joi.boolean().required(),
                working_hours: Joi.boolean().required(),
                health_restrictions: Joi.boolean().required(),
                furniture_transport: Joi.boolean().required(),
                miscellaneous: Joi.string().required(),
            }).required(),
            professional_suitability: Joi.object({
                has_internet_device: Joi.boolean().required(),
                b1_level_available: Joi.boolean().required(),
                job_board_access: Joi.boolean().required(),
                good_conduct_was_available: Joi.boolean().required()
            }).required(),
            personal_information: Joi.object({
               security_sector_experience: Joi.boolean().required(),
                last_employment: Joi.string().required(),
                current_employment: Joi.boolean().required()
            }).required(),

            personal_suitability_applicant_signature: Joi.string().required(),
            professional_information_applicant_signature1: Joi.string().required(),
            professional_information_applicant_signature2: Joi.string().required(),
            assessment: Joi.object({
                measure_target_achievable: Joi.boolean().allow(null).optional(),
                clerk_name: Joi.string().allow('', null).optional(),
                clerk_date: Joi.alternatives().try(
                    Joi.date(),
                    Joi.string().allow('', null)
                ).optional(),
                submited_date: Joi.alternatives().try(
                    Joi.date(),
                    Joi.string().allow('', null)
                ).optional()
            }).optional(),

            notes: Joi.object({
                good_conduct_was_available: Joi.string().valid('Relevant entry', 'Not relevant entry','No entries').optional(),
                submission_date: Joi.alternatives().try(
                    Joi.date(),
                    Joi.string().allow('', null)
                ).optional(),
                will_be_submitted: Joi.boolean().required(),
                date_of_entry: Joi.alternatives().try(
                    Joi.date(),
                    Joi.string().allow('', null)
                ).optional(),
                reminder_set: Joi.boolean().required(),
                clerk_remarks: Joi.string().allow('').optional(),
            }).optional()
        })
    },

    editResponse: {
        params: Joi.object({
            id: Joi.number().required()
        }),
        body: Joi.object({
            basic_info: Joi.object({
                interested_measure: Joi.string().required(),
                entry_date: Joi.date().required(),
                departure_date: Joi.date().required(),
                measures_id: Joi.number().integer().allow(null),
                first_name: Joi.string().required(),
                last_name: Joi.string().required(),
                street: Joi.string().required(),
                house_number: Joi.string().required(),
                plz: Joi.string().required(),
                city: Joi.string().required(),
                birth_date: Joi.date().required(),
                place_of_birth: Joi.string().required(),
                country_of_birth: Joi.string().required(),
                email: Joi.string().email().required()
            }).required(),

            languages: Joi.object({
                german: languageLevelSchema.required(),
                english: languageLevelSchema.required(),
                french: languageLevelSchema.required(),
                turkish: languageLevelSchema.required(),
                arabic: languageLevelSchema.required(),
                other: languageLevelSchema.required()
            }).optional(),

            special_knowledge: Joi.object({
                knowledge_1: Joi.string().required(),
                knowledge_2: Joi.string().allow('').optional(),
                knowledge_3: Joi.string().allow('').optional()
            }).required(),

            personal_suitability: Joi.object({
                shift_system: Joi.boolean().required(),
                working_hours: Joi.boolean().required(),
                health_restrictions: Joi.boolean().required(),
                furniture_transport: Joi.boolean().required(),
                miscellaneous: Joi.string().required(),
            }).required(),
            professional_suitability: Joi.object({
                has_internet_device: Joi.boolean().required(),
                b1_level_available: Joi.boolean().required(),
                job_board_access: Joi.boolean().required(),
                good_conduct_was_available: Joi.boolean().required()
            }).required(),
            personal_information: Joi.object({
               security_sector_experience: Joi.boolean().required(),
                last_employment: Joi.string().required(),
                current_employment: Joi.boolean().required()
            }).required(),

            personal_suitability_applicant_signature: Joi.string().required(),
            professional_information_applicant_signature1: Joi.string().required(),
            professional_information_applicant_signature2: Joi.string().required(),
            assessment: Joi.object({
                measure_target_achievable: Joi.boolean().allow(null).optional(),
                clerk_name: Joi.string().allow('', null).optional(),
                clerk_date: Joi.alternatives().try(
                    Joi.date(),
                    Joi.string().allow('', null)
                ).optional(),
                submited_date: Joi.alternatives().try(
                    Joi.date(),
                    Joi.string().allow('', null)
                ).optional()
            }).optional(),

            notes: Joi.object({
                good_conduct_was_available: Joi.string().valid('Relevant entry', 'Not relevant entry','No entries').optional(),
                submission_date: Joi.alternatives().try(
                    Joi.date(),
                    Joi.string().allow('', null)
                ).optional(),
                will_be_submitted: Joi.boolean().required(),
                date_of_entry: Joi.alternatives().try(
                    Joi.date(),
                    Joi.string().allow('', null)
                ).optional(),
                reminder_set: Joi.boolean().required(),
                clerk_remarks: Joi.string().allow('').optional(),
            }).optional()
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

module.exports = { dataCollectionValidation, validate };
