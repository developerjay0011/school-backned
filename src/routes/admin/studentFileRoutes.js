const express = require('express');
const router = express.Router();
const { studentFileController, upload } = require('../../controllers/admin/studentFileController');
const { authenticateToken } = require('../../middleware/auth');

// All routes are protected and require authentication
router.use(authenticateToken);

// Upload a file for a student
router.post('/students/:studentId/files', 
    upload.single('file'), 
    studentFileController.uploadFile
);

// Get all documents for a student (from all sources)
router.get('/students/:studentId/documents',
    studentFileController.getAllDocuments
);

// Get all uploaded files for a student
router.get('/students/:studentId/files', 
    studentFileController.getFiles
);

// Delete a file
router.delete('/files/:fileId', 
    studentFileController.deleteFile
);

module.exports = router;
