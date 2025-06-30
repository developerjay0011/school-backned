const express = require('express');
const router = express.Router();
const AssessmentController = require('../../controllers/admin/assessmentController');
const { assessmentValidation, validate } = require('../../middleware/assessmentValidation');
const { authenticateToken } = require('../../middleware/auth');

// Protected admin routes
router.get(
    '/assessments',
    authenticateToken,
    AssessmentController.getAllAssessments
);

router.post(
    '/assessments/generate',
    authenticateToken,
    validate(assessmentValidation.generateLink),
    AssessmentController.generateLink
);

// Public assessment routes (no authentication required)
router.get(
    '/assessments/:token/validate',
    AssessmentController.validateToken
);

router.get(
    '/assessments/:token/questions',
    AssessmentController.getQuestions
);

router.post(
    '/assessments/:token/submit',
    validate(assessmentValidation.submitResponses),
    AssessmentController.submitResponses
);

router.get(
    '/assessments/:token/results',
    AssessmentController.getResults
);

router.post(
    '/assessments/:id/comment',
    authenticateToken,
    validate(assessmentValidation.addComment),
    AssessmentController.addComment
);

router.delete(
    '/assessments/:id',
    authenticateToken,
    AssessmentController.deleteAssessment
);

module.exports = router;
