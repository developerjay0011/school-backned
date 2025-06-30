const express = require('express');
const router = express.Router();
const attendanceController = require('../../controllers/student/attendanceController');
const { authenticateStudentToken } = require('../../middleware/auth');

// Mark attendance when student clicks zoom link
router.post('/mark', authenticateStudentToken, (req, res) => attendanceController.markAttendance(req, res));

// Get student's attendance history
router.get('/my-attendance', authenticateStudentToken, (req, res) => attendanceController.getMyAttendance(req, res));

module.exports = router;
