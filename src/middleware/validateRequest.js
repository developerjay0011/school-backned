/**
 * Middleware for validating request data using Joi schemas
 * @param {Object} schema - Joi validation schema with body, query, and/or params
 */
const validateRequest = (schema) => {
    return (req, res, next) => {
        const validationErrors = {};

        // Validate request body if schema exists
        if (schema.body) {
            const { error } = schema.body.validate(req.body, { abortEarly: false });
            if (error) {
                validationErrors.body = error.details.map(detail => detail.message);
            }
        }

        // Validate query parameters if schema exists
        if (schema.query) {
            const { error } = schema.query.validate(req.query, { abortEarly: false });
            if (error) {
                validationErrors.query = error.details.map(detail => detail.message);
            }
        }

        // Validate URL parameters if schema exists
        if (schema.params) {
            const { error } = schema.params.validate(req.params, { abortEarly: false });
            if (error) {
                validationErrors.params = error.details.map(detail => detail.message);
            }
        }

        // If there are validation errors, return them
        if (Object.keys(validationErrors).length > 0) {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: validationErrors
            });
        }

        next();
    };
};

module.exports = validateRequest;
