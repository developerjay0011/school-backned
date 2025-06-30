const express = require('express');
const router = express.Router();
const ParagraphController = require('../../controllers/admin/paragraphController');
const { authenticateToken } = require('../../middleware/auth');

// Protect all routes with authentication
router.use(authenticateToken);

// Get all according to paragraph options
router.get('/according-to-paragraph', ParagraphController.getAll);

// Get a single according to paragraph option
router.get('/according-to-paragraph/:id', ParagraphController.getOne);

module.exports = router;
