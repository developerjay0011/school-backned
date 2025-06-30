const express = require('express');
const router = express.Router();
const FeedbackEvaluationController = require('../../controllers/admin/feedbackEvaluationController');
const { authenticateToken } = require('../../middleware/auth');

// Protected routes
router.use(authenticateToken);

// Generate feedback evaluation
router.post('/generate', FeedbackEvaluationController.generateFeedbackSheet);

// Get all evaluations
router.get('/', FeedbackEvaluationController.getAllEvaluations);

// Get specific evaluation
router.get('/:id', FeedbackEvaluationController.getEvaluation);

// Delete evaluation
router.delete('/:id', FeedbackEvaluationController.deleteEvaluation);

module.exports = router;
