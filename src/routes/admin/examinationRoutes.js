const express = require('express');
const router = express.Router();
const ExaminationController = require('../../controllers/admin/examinationController');
const { authenticateToken } = require('../../middleware/auth');
const { examinationValidation, validate } = require('../../middleware/examinationValidation');

// Protect all routes with authentication
router.use(authenticateToken);

// Create a new examination
router.post('/examination', validate(examinationValidation.create), ExaminationController.create);

// Get all examinations
router.get('/examination', ExaminationController.getAll);

// Get a single examination
router.get('/examination/:id', ExaminationController.getOne);

// Update an examination
router.put('/examination/:id', validate(examinationValidation.update), ExaminationController.update);

// Delete an examination
router.delete('/examination/:id', ExaminationController.delete);

module.exports = router;
