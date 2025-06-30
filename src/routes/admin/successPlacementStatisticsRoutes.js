const express = require('express');
const router = express.Router();
const SuccessPlacementStatisticsController = require('../../controllers/admin/successPlacementStatisticsController');
const { authenticateToken } = require('../../middleware/auth');

// Protected routes
router.use(authenticateToken);

// Generate statistics
router.post('/generate', SuccessPlacementStatisticsController.generateStatistics);

// Get all statistics
router.get('/', SuccessPlacementStatisticsController.getAllStatistics);

// Get specific statistics
router.get('/:id', SuccessPlacementStatisticsController.getStatistics);

// Delete statistics
router.delete('/:id', SuccessPlacementStatisticsController.deleteStatistics);

module.exports = router;
