const express = require('express');
const router = express.Router();
const StudentReportController = require('../../controllers/admin/studentReportController');
const { authenticateToken } = require('../../middleware/auth');

// Protected routes - require authentication
router.use(authenticateToken);

// Create discharge report
router.post('/students/:studentId/reports/discharge', StudentReportController.createDischargeReport);

// Create termination report
router.post('/students/:studentId/reports/termination', StudentReportController.createTerminationReport);

// Get all reports for a student
router.get('/students/:studentId/reports', StudentReportController.getStudentReports);

// Delete a report
router.delete('/reports/:reportId', StudentReportController.deleteReport);

module.exports = router;
