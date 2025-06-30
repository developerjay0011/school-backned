const express = require('express');
const router = express.Router();
const trainingReportRoutes = require('./trainingReportRoutes');
const monthlyReportRoutes = require('./monthlyReportRoutes');

// Mount routes
router.use('/', trainingReportRoutes);
router.use('/', monthlyReportRoutes);

module.exports = router;
