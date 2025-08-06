const express = require('express');
const router = express.Router();
const { getStudentResults } = require('../../controllers/lecturer/quizController');
const { authenticateLecturer } = require('../../middleware/auth');

// Apply authentication middleware to all routes
router.use(authenticateLecturer);

// Get quiz results for a specific student
router.get('/students/:studentId/results', getStudentResults);

module.exports = router;
