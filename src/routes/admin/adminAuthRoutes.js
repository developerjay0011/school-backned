const express = require('express');
const router = express.Router();
const AdminAuthController = require('../../controllers/admin/adminAuthController');

// POST /api/admin/auth/login
router.post('/login', AdminAuthController.login);

module.exports = router;
