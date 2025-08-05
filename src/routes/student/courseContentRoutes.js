const express = require('express');
const router = express.Router();
const CourseContentController = require('../../controllers/student/courseContentController');
const { authenticateStudentToken } = require('../../middleware/auth');

// All routes are protected with student authentication
router.use(authenticateStudentToken);

// Get supported languages (static list)
router.get('/course-content/languages', CourseContentController.getSupportedLanguages);

// Get all course content (info + topics with videos)
// Optional query param: language (e.g. /course-content?language=English)
// Supported languages: Arabic, English, Russian, Turkish, Ukrainian, German
router.get('/course-content', CourseContentController.getAllContent);

module.exports = router;
