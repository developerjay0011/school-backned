const express = require('express');
const router = express.Router();
const LecturerController = require('../../controllers/admin/lecturerController');

// POST /api/admin/lecturer/login
router.post('/login', LecturerController.login);

module.exports = router;
