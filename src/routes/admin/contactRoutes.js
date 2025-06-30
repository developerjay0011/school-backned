const express = require('express');
const router = express.Router();
const ContactController = require('../../controllers/admin/contactController');
const { authenticateToken } = require('../../middleware/auth');
const { contactValidation, validate } = require('../../middleware/contactValidation');

// Protected routes
router.use(authenticateToken);

// Contact details management routes
router.get('/students/:studentId/contact', ContactController.getByStudent);
router.put('/students/:studentId/contact', validate(contactValidation.update), ContactController.update);

module.exports = router;
