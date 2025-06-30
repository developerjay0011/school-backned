const validate = (schema) => (req, res, next) => {
    if (!schema) return next();

    const validationOptions = {
        abortEarly: false, // include all errors
        allowUnknown: true, // ignore unknown props
        stripUnknown: true // remove unknown props
    };

    // Validate request body, query, and params
    const toValidate = {};
    if (schema.body) toValidate.body = req.body;
    if (schema.query) toValidate.query = req.query;
    if (schema.params) toValidate.params = req.params;

    let error;
    let value;

    if (schema.body) {
        const result = schema.body.validate(req.body, validationOptions);
        error = result.error;
        value = result.value;
    }
    
    if (error) {
        const errors = error.details.map(detail => ({
            path: detail.path.join('.'),
            message: detail.message
        }));

        return res.status(400).json({
            success: false,
            message: 'Validation error',
            errors
        });
    }

    // Replace request body with validated data
    req.body = value;
    return next();
};

module.exports = validate;
