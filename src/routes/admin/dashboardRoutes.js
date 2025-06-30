const express = require('express');
const router = express.Router();
const DashboardController = require('../../controllers/admin/dashboardController');
const { authenticateToken } = require('../../middleware/auth');

// Protected routes - require authentication
router.use(authenticateToken);

// GET dashboard statistics
router.get('/dashboard/stats', DashboardController.getDashboardStats);

module.exports = router;
