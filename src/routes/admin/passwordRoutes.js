const express = require('express');
const router = express.Router();
const PasswordController = require('../../controllers/admin/passwordController');
const { authenticateToken } = require('../../middleware/auth');

// Route to change student password (admin only)
router.put('/students/:student_id/password', authenticateToken, (req, res) => {
    PasswordController.changeStudentPassword(req, res);
});

// Route to change lecturer password (admin only)
router.put('/lecturers/:lecturer_id/password', authenticateToken, (req, res) => {
    PasswordController.changeLecturerPassword(req, res);
});

module.exports = router;
