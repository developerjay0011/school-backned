const express = require('express');
const router = express.Router();
const TrainingReportController = require('../../controllers/lecturer/trainingReportController');
const { authenticateToken } = require('../../middleware/auth');
const validate = require('../../middleware/validate');
const { trainingReportValidation } = require('../../middleware/trainingReportValidation');

// All routes require authentication
router.use(authenticateToken);

// GET /api/lecturer/training-reports
router.get('/training-reports', TrainingReportController.getAll);

// GET /api/lecturer/training-reports/:id
router.get('/training-reports/:id', TrainingReportController.getOne);

// POST /api/lecturer/training-reports
router.post(
    '/training-reports',
    validate(trainingReportValidation.create),
    TrainingReportController.create
);

// PUT /api/lecturer/training-reports/:id
router.put(
    '/training-reports/:id',
    validate(trainingReportValidation.update),
    TrainingReportController.update
);

// DELETE /api/lecturer/training-reports/:id
router.delete('/training-reports/:id', TrainingReportController.delete);

module.exports = router;
