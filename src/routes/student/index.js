const express = require('express');
const router = express.Router();


const assessmentRoutes = require('./assessmentRoutes');
const dataCollectionRoutes = require('./dataCollectionRoutes');
const measurementRoutes = require('./measurementRoutes');
const studentAuthRoutes = require('./studentAuthRoutes');
const studentRoutes = require('./studentRoutes');
const attendanceRoutes = require('./attendanceRoutes');
const studentResultSheetRoutes = require('./studentFeedbackRoutes');
const courseFeedbackRoutes = require('./courseFeedbackRoutes');
const studentZoomLinksRoutes = require('./studentZoomLinksRoutes');
const quizRoutes = require('./quizRoutes');
const courseContentRoutes = require('./courseContentRoutes');
const videoLogRoutes = require('./videoLogRoutes');
// Mount routes
router.use('/', assessmentRoutes);
router.use('/', dataCollectionRoutes);
router.use('/', measurementRoutes);
router.use('/', studentAuthRoutes);
router.use('/', studentRoutes);
router.use('/attendance', attendanceRoutes);
router.use('/', studentResultSheetRoutes);
router.use('/', courseFeedbackRoutes);
router.use('/zoom-links', studentZoomLinksRoutes);
router.use('/quizzes', quizRoutes);
router.use('/', courseContentRoutes);
router.use('/', videoLogRoutes);
module.exports = router;
