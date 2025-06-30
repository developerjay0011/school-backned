const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const ExamController = require('../../controllers/admin/examController');
const { authenticateToken } = require('../../middleware/auth');
const { examValidation, validate } = require('../../middleware/examValidation');

// Configure multer for certificate uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../../../uploads'));
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'exam-certificate-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    },
    fileFilter: function (req, file, cb) {
        // Accept PDF files only
        if (file.mimetype === 'application/pdf') {
            cb(null, true);
        } else {
            cb(new Error('Only PDF files are allowed'), false);
        }
    }
});

// Protected routes
router.use(authenticateToken);

// Exam management routes
router.post('/students/:studentId/exams', validate(examValidation.create), ExamController.create);
router.put('/exams/:examId', validate(examValidation.update), ExamController.update);
router.delete('/exams/:examId', ExamController.delete);
router.get('/students/:studentId/exams', ExamController.getByStudent);
// Update exam result
router.put('/exams/:examId/result/:exam_result', ExamController.updateExamResult);

// Update exam done date
router.put('/exams/:examId/done/:done_on', ExamController.updateDoneOn);


// Certificate upload route
router.post('/exams/:examId/certificate', upload.single('certificate'), ExamController.uploadCertificate);

module.exports = router;
