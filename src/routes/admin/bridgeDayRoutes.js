const express = require('express');
const router = express.Router();
const BridgeDayController = require('../../controllers/admin/bridgeDayController');
const { authenticateToken } = require('../../middleware/auth');
const { bridgeDayValidation, validate } = require('../../middleware/bridgeDayValidation');

// Protect all routes with authentication
router.use(authenticateToken);

// Create a new bridge day
router.post('/bridge-days', validate(bridgeDayValidation.create), BridgeDayController.create);

// Get all bridge days
router.get('/bridge-days', BridgeDayController.getAll);

// Get a single bridge day
router.get('/bridge-days/:id', BridgeDayController.getOne);

// Update a bridge day
router.put('/bridge-days/:id', validate(bridgeDayValidation.update), BridgeDayController.update);

// Delete a bridge day
router.delete('/bridge-days/:id', BridgeDayController.delete);

module.exports = router;
