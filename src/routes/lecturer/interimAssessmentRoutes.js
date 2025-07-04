const express = require('express');
const router = express.Router();
const InterimAssessmentController = require('../../controllers/lecturer/interimAssessmentController');
const { authenticateToken } = require('../../middleware/auth');

// Create interim assessment
router.post(
    '/interim-assessments',
    authenticateToken,
    InterimAssessmentController.create
);

// Update interim assessment
router.put(
    '/interim-assessments/:id',
    authenticateToken,
    InterimAssessmentController.update
);

// Get interim assessment by student
router.get(
    '/interim-assessments/student/:student_id',
    authenticateToken,
    InterimAssessmentController.getByStudent
);

// Get all interim assessments
router.get(
    '/interim-assessments',
    authenticateToken,
    InterimAssessmentController.getAll
);

// Get all PDFs by student ID
router.get(
    '/students/:studentId/interim-assessment-pdfs',
    authenticateToken,
    InterimAssessmentController.getAllPdfsByStudentId
);

// Delete interim assessment
router.delete(
    '/interim-assessments/:id',
    authenticateToken,
    InterimAssessmentController.delete
);

module.exports = router;
