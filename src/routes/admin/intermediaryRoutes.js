const express = require('express');
const router = express.Router();
const IntermediaryController = require('../../controllers/admin/intermediaryController');
const { authenticateToken } = require('../../middleware/auth');
const { intermediaryValidation, validate } = require('../../middleware/intermediaryValidation');

// Protect all routes with authentication
router.use(authenticateToken);

// Create a new intermediary
router.post('/intermediaries', validate(intermediaryValidation.create), IntermediaryController.create);

// Get all intermediaries
router.get('/intermediaries', IntermediaryController.getAll);

// Get a single intermediary
router.get('/intermediaries/:id', IntermediaryController.getOne);

// Update an intermediary
router.put('/intermediaries/:id', validate(intermediaryValidation.update), IntermediaryController.update);

// Delete an intermediary
router.delete('/intermediaries/:id', IntermediaryController.delete);

module.exports = router;
