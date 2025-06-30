const express = require('express');
const router = express.Router();
const CertificateOfAbsenceController = require('../../controllers/admin/certificateOfAbsenceController');
const { authenticateToken } = require('../../middleware/auth');

// Get all certificates of absence
router.get('/', authenticateToken, CertificateOfAbsenceController.getAll);

// Get certificates by student ID
router.get('/student/:studentId', authenticateToken, CertificateOfAbsenceController.getByStudentId);

// Delete a certificate of absence
router.delete('/:id', authenticateToken, CertificateOfAbsenceController.delete);

module.exports = router;
