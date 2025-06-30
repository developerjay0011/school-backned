const express = require('express');
const router = express.Router();
const AttendanceListController = require('../../controllers/admin/attendanceListController');
const { authenticateToken } = require('../../middleware/auth');

// Generate attendance list
router.post('/', authenticateToken, AttendanceListController.generateList);

// Get all attendance lists
router.get('/', authenticateToken, AttendanceListController.getAll);

module.exports = router;
