const express = require('express');
const router = express.Router();
const MeasuresZoomLinksController = require('../../controllers/lecturer/measuresZoomLinksController');
const auth = require('../../middleware/auth');

// Apply authentication middleware to all routes
router.use(auth.authenticateLecturer);

// Get all zoom links for the lecturer
router.get('/', MeasuresZoomLinksController.getByLecturer);

// Create a new zoom link
router.post('/', MeasuresZoomLinksController.create);

// Update a zoom link
router.put('/:id', MeasuresZoomLinksController.update);

// Delete a zoom link
router.delete('/:id', MeasuresZoomLinksController.delete);

module.exports = router;
