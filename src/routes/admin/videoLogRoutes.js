const express = require('express');
const router = express.Router();
const { validateToken } = require('../../middleware/auth');
const { getAllVideoLogs } = require('../../controllers/admin/videoLogController');
const { authenticateToken } = require('../../middleware/auth');

// Protected routes - require admin authentication
router.use(authenticateToken);

// Get all video logs (with optional studentId query param)
router.get('/video-logs', getAllVideoLogs);

module.exports = router;
