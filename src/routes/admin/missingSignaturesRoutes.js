const express = require('express');
const router = express.Router();
const MissingSignaturesController = require('../../controllers/admin/missingSignaturesController');
const { authenticateToken } = require('../../middleware/auth');

// Protected routes
router.use(authenticateToken);

// Get missing signatures
router.get('/', MissingSignaturesController.getMissingSignatures);

module.exports = router;
