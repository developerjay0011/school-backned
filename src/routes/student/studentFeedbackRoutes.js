const express = require('express');
const router = express.Router();
const StudentFeedbackController = require('../../controllers/student/studentFeedbackController');
const { authenticateStudentToken } = require('../../middleware/auth');
const validate = require('../../middleware/validate');
const resultSheetValidation = require('../../middleware/studentResultSheetValidation');

// Protected routes - require authentication
router.use(authenticateStudentToken);
router.get('/feedback-sheet', StudentFeedbackController.getByStudentId);
// POST create result sheet for a student
router.post('/feedback-sheet', validate(resultSheetValidation.create), StudentFeedbackController.create);
router.put('/feedback-sheet', validate(resultSheetValidation.update), StudentFeedbackController.update);



module.exports = router;
