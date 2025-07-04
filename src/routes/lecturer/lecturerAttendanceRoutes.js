const express = require('express');
const router = express.Router();
const LecturerAttendanceController = require('../../controllers/lecturer/lecturerAttendanceController');
const { authenticateToken } = require('../../middleware/auth');

// Get attendance list for a specific date
router.get(
    '/attendance',
    authenticateToken,
    LecturerAttendanceController.getAttendanceList
);

// Mark student attendance
router.post(
    '/attendance',
    authenticateToken,
    LecturerAttendanceController.markAttendance
);

module.exports = router;
