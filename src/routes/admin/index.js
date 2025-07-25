const express = require('express');
const router = express.Router();

const userRoutes = require('./userRoutes');
const measurementRoutes = require('./measurementRoutes');
const intermediaryRoutes = require('./intermediaryRoutes');
const examinationRoutes = require('./examinationRoutes');
const bridgeDayRoutes = require('./bridgeDayRoutes');
const paragraphRoutes = require('./paragraphRoutes');
const studentRoutes = require('./studentRoutes');
const examRoutes = require('./examRoutes');
const contactRoutes = require('./contactRoutes');
const sickLeaveRoutes = require('./sickLeaveRoutes');
const studentInvoiceRoutes = require('./studentInvoiceRoutes');
const assessmentRoutes = require('./assessmentRoutes');
const dataCollectionRoutes = require('./dataCollectionRoutes');
const lecturerRoutes = require('./lecturerRoutes');
const lecturerAuthRoutes = require('./lecturerAuthRoutes');
const studentResultSheetRoutes = require('./studentResultSheetRoutes');
const dashboardRoutes = require('./dashboardRoutes');
const pdfRoutes = require('./pdfRoutes');
const attendanceRoutes = require('./attendanceRoutes');
const studentReportRoutes = require('./studentReportRoutes');
const qualificationMatrixRoutes = require('./qualificationMatrixRoutes');
const trainingRoutes = require('./trainingRoutes');
const organizationRoutes = require('./organizationRoutes');
const certificateOfAbsenceRoutes = require('./certificateOfAbsenceRoutes');
const attendanceListRoutes = require('./attendanceListRoutes');
const successPlacementStatisticsRoutes = require('./successPlacementStatisticsRoutes');
const documentsRoutes = require('./documents');
const missingSignaturesRoutes = require('./missingSignaturesRoutes');
const studentFileRoutes = require('./studentFileRoutes');
// Mount routes
router.use('/', userRoutes); // This includes the /login endpoint for both admin and lecturer

// Remove the separate lecturer auth routes since they're now handled by admin auth
// router.use('/lecturer', lecturerAuthRoutes);
router.use('/', measurementRoutes);
router.use('/', intermediaryRoutes);
router.use('/', examinationRoutes);
router.use('/', bridgeDayRoutes);
router.use('/', paragraphRoutes);
router.use('/', studentRoutes);
router.use('/', examRoutes);
router.use('/', contactRoutes);
router.use('/', sickLeaveRoutes);
router.use('/', studentInvoiceRoutes);
router.use('/', assessmentRoutes);
router.use('/', dataCollectionRoutes);
router.use('/', lecturerRoutes);
router.use('/lecturer', lecturerAuthRoutes);
router.use('/', studentResultSheetRoutes);
router.use('/', dashboardRoutes);
router.use('/', pdfRoutes);
router.use('/attendance', attendanceRoutes);
router.use('/', studentReportRoutes);
router.use('/qualification-matrix', qualificationMatrixRoutes);
router.use('/', trainingRoutes);
router.use('/organization', organizationRoutes);
router.use('/certificates-of-absence', certificateOfAbsenceRoutes);
router.use('/attendance-lists', attendanceListRoutes);
router.use('/success-placement-statistics', successPlacementStatisticsRoutes);
router.use('/documents', documentsRoutes);
router.use('/', studentFileRoutes);
router.use('/missing-signatures', missingSignaturesRoutes);

module.exports = router;
