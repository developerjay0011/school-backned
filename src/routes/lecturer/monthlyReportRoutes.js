const express = require('express');
const router = express.Router();
const MonthlyReportController = require('../../controllers/lecturer/monthlyReportController');
const { authenticateToken } = require('../../middleware/auth');
const validate = require('../../middleware/validate');
const { monthlyReportValidation } = require('../../middleware/monthlyReportValidation');

// All routes are protected with authentication
router.use(authenticateToken);

// Generate monthly report
router.post(
    '/monthly-reports',
    validate(monthlyReportValidation.generate),
    MonthlyReportController.generate
);

// Get all monthly reports
router.get('/monthly-reports', MonthlyReportController.getAll);

// Delete monthly report
router.delete('/monthly-reports/:id', MonthlyReportController.delete);

module.exports = router;
