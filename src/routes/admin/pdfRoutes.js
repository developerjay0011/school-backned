const express = require('express');
const router = express.Router();
const PDFController = require('../../controllers/admin/pdfController');
const { authenticateToken } = require('../../middleware/auth');

// Protected routes - require authentication
router.use(authenticateToken);

// Generate Feedback Sheet PDF
router.post('/generate-feedback-sheet', PDFController.generateFeedbackSheet);

// Generate Success and Placement Statistics PDF
router.get('/generate-success-statistics', authenticateToken, PDFController.generateSuccessAndPlacementStatistics);

// Generate Qualifizierungsplan PDF
router.get('/generate-qualifizierungsplan', authenticateToken, PDFController.generateQualifizierungsplan);

// Get list of generated Qualifizierungsplan PDFs
router.get('/qualifizierungsplan', authenticateToken, PDFController.getQualifizierungsplanList);

// Delete a Qualifizierungsplan PDF
router.delete('/qualifizierungsplan/:id', authenticateToken, PDFController.deleteQualifizierungsplan);

module.exports = router;
