const express = require('express');
const router = express.Router();
const { getStudentVideoLogs } = require('../../controllers/lecturer/videoLogController');
const { authenticateLecturer } = require('../../middleware/auth');

// Apply authentication middleware to all routes
router.use(authenticateLecturer);

// Get video logs for a specific student
router.get('/', getStudentVideoLogs);

module.exports = router;
