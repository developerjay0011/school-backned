const express = require('express');
const router = express.Router();
const LecturerRemarkController = require('../../controllers/lecturer/lecturerRemarkController');
const { authenticateToken } = require('../../middleware/auth');

// Add or update remark for a student
router.post(
    '/remarks',
    authenticateToken,
    LecturerRemarkController.addRemark
);

// Get remark for a specific student
router.get(
    '/remarks/:student_id',
    authenticateToken,
    LecturerRemarkController.getRemark
);

// Get all remarks for lecturer's students
router.get(
    '/remarks',
    authenticateToken,
    LecturerRemarkController.getAllRemarks
);

module.exports = router;
