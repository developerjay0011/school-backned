const express = require('express');
const router = express.Router();
const StudentAuthController = require('../../controllers/auth/studentAuthController');
const validate = require('../../middleware/validate');
const studentAuthValidation = require('../../middleware/studentAuthValidation');

// POST /api/auth/student/login
router.post('/login', validate(studentAuthValidation.login), StudentAuthController.login);

module.exports = router;
