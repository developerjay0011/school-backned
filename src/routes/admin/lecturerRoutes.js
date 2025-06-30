const express = require('express');
const router = express.Router();
const LecturerController = require('../../controllers/admin/lecturerController');
const { authenticateToken } = require('../../middleware/auth');

// Protected routes - require authentication
router.use(authenticateToken);

// GET all lecturers
router.get('/lecturers', LecturerController.getAllLecturers);

// GET a specific lecturer
router.get('/lecturers/:id', LecturerController.getLecturerById);

// POST create a new lecturer
router.post('/lecturers', LecturerController.uploadFiles, LecturerController.createLecturer);

// PUT update an existing lecturer
router.put('/lecturers/:id', LecturerController.uploadFiles, LecturerController.updateLecturer);

// DELETE a lecturer
router.delete('/lecturers/:id', LecturerController.deleteLecturer);

// DELETE a certificate from a lecturer
router.delete('/lecturers/:id/certificates', LecturerController.deleteCertificate);

module.exports = router;
