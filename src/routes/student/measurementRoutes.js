const express = require('express');
const router = express.Router();
const MeasurementController = require('../../controllers/admin/measurementController');


// Get all measurements
router.get('/measurements', MeasurementController.getAll);


module.exports = router;
