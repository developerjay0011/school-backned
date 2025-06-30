const express = require('express');
const router = express.Router();
const DocumentsController = require('../../controllers/admin/documentsController');
const { authenticateToken } = require('../../middleware/auth');

// Get all documents
router.get('/', authenticateToken, DocumentsController.getAllDocuments);

module.exports = router;
