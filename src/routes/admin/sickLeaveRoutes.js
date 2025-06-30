const express = require('express');
const router = express.Router();
const SickLeaveController = require('../../controllers/admin/sickLeaveController');
const { sickLeaveValidation, validate } = require('../../middleware/sickLeaveValidation');
const { authenticateToken } = require('../../middleware/auth');

// All routes are protected with authentication
router.use(authenticateToken);

// Create a new sick leave for a student
router.post(
    '/students/:studentId/sick-leaves',
    validate(sickLeaveValidation.create),
    SickLeaveController.create
);

// Update a sick leave
router.put(
    '/sick-leaves/:id',
    validate(sickLeaveValidation.update),
    SickLeaveController.update
);

// Delete a sick leave
router.delete(
    '/sick-leaves/:id',
    SickLeaveController.delete
);

// Get all sick leaves for a student
router.get(
    '/students/:studentId/sick-leaves',
    SickLeaveController.getByStudentId
);

// Get leaves by month with student and authority details
router.get(
    '/students/:studentId/sick-leaves/monthly/:month/:year',
    SickLeaveController.getLeavesByMonth
);

module.exports = router;
