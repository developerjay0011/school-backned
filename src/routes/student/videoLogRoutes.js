const express = require('express');
const router = express.Router();
const { validateToken } = require('../../middleware/auth');
const { createVideoLog, getMyVideoLogs } = require('../../controllers/student/videoLogController');
const auth = require('../../middleware/auth');

// Apply authentication middleware
router.use(auth.authenticateStudentToken);

// Create video log
router.post('/video-logs', createVideoLog);

// Get my video logs
router.get('/video-logs', getMyVideoLogs);

module.exports = router;
