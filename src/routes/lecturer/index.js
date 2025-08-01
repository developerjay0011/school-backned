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

module.exports = router;
