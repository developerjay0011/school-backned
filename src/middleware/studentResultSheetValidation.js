const Joi = require('joi');

const skillSchema = Joi.object({
    id: Joi.number().required(),
    label: Joi.string().required(),
    value: Joi.string().required()
});

const languageSkillSchema = Joi.object({
    id: Joi.number().required(),
    language: Joi.string().required(),
    level: Joi.string().required()
});

const applicationSchema = Joi.object({
    id: Joi.number().required(),
    application_to: Joi.string().allow('', null),
    to: Joi.string().allow('', null),
    status: Joi.string().allow('', null)
});

const mobilitySchema = Joi.object({
    id: Joi.number().required(),
    willing_to_be_mobile: Joi.string().required(),
    maximum_commuting_time: Joi.string().required(),
    regional_wishes: Joi.string().required()
});

const internshipSchema = Joi.object({
    id: Joi.number().required(),
    from: Joi.string().required(),
    to: Joi.string().required(),
    activity_as: Joi.string().required(),
    at: Joi.string().required()
});

const itSkillSchema = Joi.object({
    id: Joi.number().required(),
    label: Joi.string().required(),
    value: Joi.string().required()
});
const generatePdfSchema = Joi.object({
    nameFirstName: Joi.string().required(),
    placeOfResidence: Joi.string().required(),
    orgNumber: Joi.string().required(),
    referenceNumber: Joi.string().required(),
    carrierOfTheMeasure: Joi.string().required(),
    nameOfTheMeasure: Joi.string().required(),
    measureNumber: Joi.string().required(),
    contactPersonInclTel: Joi.string().required(),
    skills: Joi.array().items(skillSchema).default([]),
    it_skills: Joi.array().items(itSkillSchema).default([]),
    language_skills: Joi.array().items(languageSkillSchema).default([]),
    mobility: mobilitySchema.default({}),
    internships: Joi.array().items(internshipSchema).default([]),
    applications: Joi.array().items(applicationSchema).default([]),
    future_application: Joi.string().allow('', null),
    alternatives: Joi.string().allow('', null),
    other_comments: Joi.string().allow('', null),
    signature: Joi.string().required(),
    date_of_participation: Joi.date().allow('', null),
    reference_no: Joi.string().allow('', null)
});
const resultSheetValidation = {
    create: {
        body: Joi.object({
            skills: Joi.array().items(skillSchema).default([]),
            it_skills: Joi.array().items(itSkillSchema).default([]),
            language_skills: Joi.array().items(languageSkillSchema).default([]),
            mobility: mobilitySchema.default({}),
            internships: Joi.array().items(internshipSchema).default([]),
            applications: Joi.array().items(applicationSchema).default([]),
            future_application: Joi.string().allow('', null),
            alternatives: Joi.string().allow('', null),
            other_comments: Joi.string().allow('', null),
            signature: Joi.string().allow('', null).default(''),
            date_of_participation: Joi.string().allow('', null),
            reference_no: Joi.string().allow('', null)
        })
    },
    update: {
        body: Joi.object({
            skills: Joi.array().items(skillSchema).optional(),
            it_skills: Joi.array().items(itSkillSchema).optional(),
            language_skills: Joi.array().items(languageSkillSchema).optional(),
            mobility: mobilitySchema.optional(),
            internships: Joi.array().items(internshipSchema).optional(),
            applications: Joi.array().items(applicationSchema).optional(),
            future_application: Joi.string().allow('', null).optional(),
            alternatives: Joi.string().allow('', null).optional(),
            other_comments: Joi.string().allow('', null).optional(),
            date_of_participation: Joi.string().allow('', null).optional(),
            reference_no: Joi.string().allow('', null).optional()
        }).min(1)
    },
    generatePdf: {
        body: generatePdfSchema
    },
    sendMail: {
        body: Joi.object({
            email: Joi.string().email().required()
        })
    }
};

module.exports = resultSheetValidation;
