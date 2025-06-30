const express = require('express');
const router = express.Router();
const StudentController = require('../../controllers/student/studentController');
const { authenticateStudentToken } = require('../../middleware/auth');

// Get student data using token
router.get('/me', authenticateStudentToken, StudentController.getStudentByToken);

module.exports = router;
