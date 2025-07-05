const express = require('express');
const router = express.Router();
const StudentZoomLinksController = require('../../controllers/student/studentZoomLinksController');
const auth = require('../../middleware/auth');

// Apply authentication middleware
router.use(auth.authenticateStudentToken);

// Get zoom links for the authenticated student
router.get('/', StudentZoomLinksController.getZoomLinks);

module.exports = router;
