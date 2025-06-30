const express = require('express');
const router = express.Router();
const adminAttendanceController = require('../../controllers/admin/attendanceController');
const { authenticateToken } = require('../../middleware/auth');

// Get attendance list with sick leave info
router.get('/list', authenticateToken, adminAttendanceController.getAttendanceList);

// Get full day absences for a student
router.get('/full-day-absences/:studentId', authenticateToken, adminAttendanceController.getFullDayAbsences);

// Get attendance statistics for a period
router.get('/stats/:period', authenticateToken, adminAttendanceController.getAttendanceStats);

// Mark attendance for a student on a specific date
router.post('/students/:studentId', authenticateToken, adminAttendanceController.markAttendance);

module.exports = router;
