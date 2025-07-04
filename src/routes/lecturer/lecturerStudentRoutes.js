const express = require('express');
const router = express.Router();
const LecturerStudentController = require('../../controllers/lecturer/lecturerStudentController');
const { authenticateToken } = require('../../middleware/auth');

// Get all students linked to the logged-in lecturer
router.get(
    '/students',
    authenticateToken,
    LecturerStudentController.getStudents
);

module.exports = router;
