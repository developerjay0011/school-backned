const Joi = require('joi');

// Define the valid response types for different questions
const RESPONSE_TYPES = {
    SATISFACTION: ['Satisfied', 'Neutral', 'Not Satisfied'],
    YES_PARTIAL_NO: ['Yes', 'Partial', 'No'],
    DURATION: ['Just right', 'Too short', 'Too long','I can\'t say yet'],
    IMPACT: ['The training helps me to find a job more easily', 'My chances of getting a job have not changed', 'My chances of getting a job have not changed', "I cannot yet say whether something has changed"]
};

// Create validation schema for each question type
const createQuestionSchema = (validResponses) => {
    return Joi.string().valid(...validResponses).required().messages({
        'any.only': `Response must be one of: ${validResponses.join(', ')}`
    });
};

// Create validation schema for all questions
const responseSchemas = {
    // Questions 1-17: Satisfaction scale
    ...Array.from({length: 17}, (_, i) => i + 1).reduce((acc, num) => {
        acc[num] = createQuestionSchema(RESPONSE_TYPES.SATISFACTION);
        return acc;
    }, {}),
    // Question 18: Yes/Partial/No
    18: createQuestionSchema(RESPONSE_TYPES.YES_PARTIAL_NO),
    // Question 19: Impact assessment
    19: createQuestionSchema(RESPONSE_TYPES.IMPACT),
    // Question 20: Duration assessment
    20: createQuestionSchema(RESPONSE_TYPES.DURATION),
    // Question 21: Satisfaction scale
    21: createQuestionSchema(RESPONSE_TYPES.SATISFACTION)
};

const courseFeedbackValidation = {
    create: {
        body: Joi.object({
            course_id: Joi.string().required(),
            date: Joi.date().iso().required(),
            responses: Joi.object(responseSchemas).required()
                .messages({
                    'object.missing': 'All 21 questions must be answered'
                }),
            remarks: Joi.string().allow('', null)
        })
    },
    update: {
        body: Joi.object({
            course_id: Joi.string(),
            date: Joi.date().iso(),
            responses: Joi.object().pattern(
                Joi.number().min(1).max(21),
                Joi.string()
            ),
            remarks: Joi.string().allow('', null)
        }).min(1)
    }
};

module.exports = {
    courseFeedbackValidation,
    RESPONSE_TYPES
};
