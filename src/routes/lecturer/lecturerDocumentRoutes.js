const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const LecturerDocumentController = require('../../controllers/lecturer/lecturerDocumentController');
const { authenticateToken } = require('../../middleware/auth');

// Configure multer for file upload
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/lecturer-documents/');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB limit
    },
    fileFilter: function (req, file, cb) {
        // Allow common document types
        const allowedTypes = [
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'application/vnd.ms-excel',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'text/plain'
        ];
        
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type. Only PDF, DOC, DOCX, XLS, XLSX, and TXT files are allowed.'));
        }
    }
});

// Upload document
router.post(
    '/documents',
    authenticateToken,
    upload.single('document'),
    LecturerDocumentController.uploadDocument
);

// Get all documents
router.get(
    '/documents',
    authenticateToken,
    LecturerDocumentController.getDocuments
);

// Delete document
router.delete(
    '/documents/:id',
    authenticateToken,
    LecturerDocumentController.deleteDocument
);

module.exports = router;
