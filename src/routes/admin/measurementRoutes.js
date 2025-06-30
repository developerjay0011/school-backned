const express = require('express');
const router = express.Router();
const MeasurementController = require('../../controllers/admin/measurementController');
const { authenticateToken } = require('../../middleware/auth');
const { measurementValidation, validate } = require('../../middleware/measurementValidation');

// Protect all routes with authentication
router.use(authenticateToken);

// Create a new measurement
router.post('/measurements', validate(measurementValidation.create), MeasurementController.create);

// Get all measurements
router.get('/measurements', MeasurementController.getAll);

// Get a single measurement
router.get('/measurements/:id', MeasurementController.getOne);

// Update a measurement
router.put('/measurements/:id', validate(measurementValidation.update), MeasurementController.update);

// Delete a measurement
router.delete('/measurements/:id', MeasurementController.delete);

// Toggle show in documents
router.patch('/measurements/:id/toggle-show', MeasurementController.toggleShowInDocuments);

module.exports = router;
