const express = require('express');
const router = express.Router();
const QualificationMatrixController = require('../../controllers/admin/qualificationMatrixController');

// Generate qualification matrix
router.post('/', QualificationMatrixController.generateMatrix);

// Get all qualification matrices
router.get('/', QualificationMatrixController.getAllMatrices);
    
// Get specific qualification matrix
router.get('/:id', QualificationMatrixController.getMatrixById);

// Delete qualification matrix
router.delete('/:id', QualificationMatrixController.deleteMatrix);

module.exports = router;
