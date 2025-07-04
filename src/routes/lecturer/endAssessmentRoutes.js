const express = require('express');
const router = express.Router();
const EndAssessmentController = require('../../controllers/lecturer/endAssessmentController');
const { authenticateToken } = require('../../middleware/auth');

// Create end assessment
router.post(
    '/end-assessments',
    authenticateToken,
    EndAssessmentController.create
);

// Update end assessment
router.put(
    '/end-assessments/:id',
    authenticateToken,
    EndAssessmentController.update
);

// Get all PDFs by student ID
router.get(
    '/students/:studentId/end-assessment-pdfs',
    authenticateToken,
    EndAssessmentController.getAllPdfsByStudentId
);

// Get end assessment by student
router.get(
    '/end-assessments/student/:student_id',
    authenticateToken,
    EndAssessmentController.getByStudent
);

// Get all end assessments
router.get(
    '/end-assessments',
    authenticateToken,
    EndAssessmentController.getAll
);

// Delete end assessment
router.delete(
    '/end-assessments/:id',
    authenticateToken,
    EndAssessmentController.delete
);

module.exports = router;
