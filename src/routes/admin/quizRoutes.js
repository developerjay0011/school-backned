const express = require('express');
const router = express.Router();
const quizController = require('../../controllers/admin/quizController');
// const { authenticateAdminToken } = require('../../middleware/auth');
const { authenticateToken } = require('../../middleware/auth');
// All routes are protected and require admin authentication
router.use(authenticateToken);

// Get all quiz results with filtering and pagination
// Example: GET /api/admin/quizzes/results?topic=Topic1&isExam=true&page=1&limit=50
router.get('/results', quizController.getAllResults);

// Get quiz results for a specific student
// Example: GET /api/admin/quizzes/students/123/results
router.get('/students/:studentId/results', quizController.getStudentResults);

module.exports = router;
