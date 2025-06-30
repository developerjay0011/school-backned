const express = require('express');
const router = express.Router();
const CourseFeedbackController = require('../../controllers/student/courseFeedbackController');
const { courseFeedbackValidation } = require('../../middleware/courseFeedbackValidation');
const { authenticateStudentToken } = require('../../middleware/auth');
const validateRequest = require('../../middleware/validateRequest');

// Protected routes - require authentication
router.use(authenticateStudentToken);

// Submit course feedback
router.post('/course-feedback', 
    validateRequest(courseFeedbackValidation.create),
    CourseFeedbackController.create
);

// Get all feedbacks for the authenticated student
router.get('/course-feedbacks',
    CourseFeedbackController.getByStudentId
);

// Update feedback
router.put('/course-feedback',
    validateRequest(courseFeedbackValidation.update),
    CourseFeedbackController.update
);

module.exports = router;
