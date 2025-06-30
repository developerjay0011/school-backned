const StudentFile = require('../../models/studentFileModel');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure multer for file upload
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadDir = path.join(process.cwd(), 'uploads', 'student-files');
        // Create directory if it doesn't exist
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        // Generate unique filename: timestamp-originalname
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const fileFilter = (req, file, cb) => {
    // Allow only specific file types
    const allowedTypes = ['.pdf', '.doc', '.docx', '.jpg', '.jpeg', '.png'];
    const ext = path.extname(file.originalname).toLowerCase();
    
    if (allowedTypes.includes(ext)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only PDF, DOC, DOCX, JPG, JPEG, and PNG files are allowed.'));
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB limit
    }
});

const studentFileController = {
    getAllDocuments: async (req, res) => {
        try {
            const baseUrl = process.env.BACKEND_URL;
            const documents = await StudentFile.getAllDocuments(req.params.studentId);
            
            // Add full URLs to all document types
            const addFullUrls = (docs) => docs.map(doc => ({
                ...doc,
                file_path: `${baseUrl}${doc.file_path}`
            }));
            const addFullUrlsResultSheets = (docs) => docs.map(doc => ({
                ...doc,
                pdf_url: `${baseUrl}${doc.pdf_url}`
            }));

            const documentsWithUrls = {
                feedback_forms: addFullUrls(documents.feedback_forms),
                certificate_of_absences: addFullUrls(documents.certificate_of_absences),
                invoices: addFullUrls(documents.invoices),
                result_sheets: addFullUrlsResultSheets(documents.result_sheets),
                training_reports: addFullUrls(documents.training_reports),
                student_reports: addFullUrls(documents.student_reports),
                other_files: addFullUrls(documents.other_files)
            };
            
            res.json({
                success: true,
                data: documentsWithUrls
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    },

    uploadFile: async (req, res) => {
        try {
            console.log('User:', req.user);
            console.log('File:', req.file);
            console.log('Body:', req.body);
            console.log('Params:', req.params);
            if (!req.file) {
                return res.status(400).json({
                    success: false,
                    message: 'No file uploaded'
                });
            }

            // Get relative path from uploads directory
            const relativePath = path.relative(
                path.join(process.cwd(), 'uploads'),
                req.file.path
            );

            const fileData = {
                student_id: req.params.studentId,
                file_name: req.file.originalname,
                file_path: relativePath,
                file_type: path.extname(req.file.originalname).toLowerCase(),
                description: req.body.description || null,
                uploaded_by: req.user.id
            };

            const fileId = await StudentFile.create(fileData);

            res.status(201).json({
                success: true,
                message: 'File uploaded successfully',
                data: {
                    id: fileId,
                    ...fileData,
                    file_path: `/uploads/${fileData.file_path}`
                }
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    },

    getFiles: async (req, res) => {
        try {
            const baseUrl = `${req.protocol}://${req.get('host')}`;
            const files = await StudentFile.findByStudentId(req.params.studentId);
            
            // Add full URL to file paths
            const filesWithFullUrls = files.map(file => ({
                ...file,
                file_path: `${baseUrl}${file.file_path}`
            }));
            
            res.json({
                success: true,
                data: filesWithFullUrls
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    },

    deleteFile: async (req, res) => {
        try {
            const success = await StudentFile.delete(req.params.fileId);
            
            if (!success) {
                return res.status(404).json({
                    success: false,
                    message: 'File not found'
                });
            }

            res.json({
                success: true,
                message: 'File deleted successfully'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }
};

module.exports = {
    studentFileController,
    upload
};
