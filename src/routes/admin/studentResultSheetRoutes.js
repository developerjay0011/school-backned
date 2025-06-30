const express = require('express');
const router = express.Router();
const StudentResultSheetController = require('../../controllers/admin/studentResultSheetController');
const { authenticateToken } = require('../../middleware/auth');
const validate = require('../../middleware/validate');
const resultSheetValidation = require('../../middleware/studentResultSheetValidation');

// Protected routes - require authentication
router.use(authenticateToken);

// GET result sheet for a student
router.get('/students/:studentId/result-sheet', StudentResultSheetController.getByStudentId);

// POST create result sheet for a student
router.post('/students/:studentId/result-sheet', validate(resultSheetValidation.create), StudentResultSheetController.create);

// POST generate PDF for result sheet
router.post('/students/:studentId/result-sheet/generate-pdf', validate(resultSheetValidation.generatePdf), StudentResultSheetController.generatePDF);
router.get('/students/:studentId/result-sheet/pdfs', StudentResultSheetController.getPdfs);

// Delete PDF record
router.delete('/students/result-sheet/pdfs/:id', StudentResultSheetController.deletePdf);

// Send PDF by email
router.post('/students/result-sheet/pdfs/:id/send', validate(resultSheetValidation.sendMail), StudentResultSheetController.sendPdfByEmail);

// PUT update result sheet for a student
router.put('/students/:studentId/result-sheet', validate(resultSheetValidation.update), StudentResultSheetController.update);

// DELETE result sheet for a student
router.delete('/students/:studentId/result-sheet', StudentResultSheetController.delete);

module.exports = router;
