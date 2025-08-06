const express = require('express');
const router = express.Router();
const trainingReportRoutes = require('./trainingReportRoutes');
const monthlyReportRoutes = require('./monthlyReportRoutes');
const lecturerStudentRoutes = require('./lecturerStudentRoutes');
const lecturerAttendanceRoutes = require('./lecturerAttendanceRoutes');
const lecturerDocumentRoutes = require('./lecturerDocumentRoutes');
const lecturerRemarkRoutes = require('./lecturerRemarkRoutes');
const endAssessmentRoutes = require('./endAssessmentRoutes');
const interimAssessmentRoutes = require('./interimAssessmentRoutes');
const measuresZoomLinksRoutes = require('./measuresZoomLinksRoutes');
const quizRoutes = require('./quizRoutes');
const videoLogRoutes = require('./videoLogRoutes');

// Mount routes
router.use('/', trainingReportRoutes);
router.use('/', monthlyReportRoutes);
router.use('/', lecturerStudentRoutes);
router.use('/', lecturerAttendanceRoutes);
router.use('/', lecturerDocumentRoutes);
router.use('/', lecturerRemarkRoutes);
router.use('/', endAssessmentRoutes);
router.use('/', interimAssessmentRoutes);
router.use('/measures-zoom-links', measuresZoomLinksRoutes);
router.use('/quizzes', quizRoutes);
router.use('/video-logs', videoLogRoutes);

module.exports = router;
