const LecturerModel = require('../../models/lecturerModel');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadPath = file.fieldname === 'photo' 
            ? path.join(__dirname, '../../../uploads/photos')
            : path.join(__dirname, '../../../uploads/certificates');
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const fileFilter = (req, file, cb) => {
    if (file.fieldname === 'photo') {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed for photos!'), false);
        }
    } else if (file.fieldname === 'certificates') {
        if (file.mimetype === 'application/pdf') {
            cb(null, true);
        } else {
            cb(new Error('Only PDF files are allowed for certificates!'), false);
        }
    } else {
        cb(new Error('Unexpected field'), false);
    }
};

const upload = multer({ 
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    }
});

class LecturerController {
    static async getAllLecturers(req, res) {
        try {
            const lecturers = await LecturerModel.getAllLecturers();
            res.json({ success: true, data: lecturers });
        } catch (error) {
            console.error('Error fetching lecturers:', error);
            res.status(500).json({ success: false, message: 'Internal server error' });
        }
    }

    static async getLecturerById(req, res) {
        try {
            const lecturer = await LecturerModel.getLecturerById(req.params.id);
            if (!lecturer) {
                return res.status(404).json({ success: false, message: 'Lecturer not found' });
            }
            res.json({ success: true, data: lecturer });
        } catch (error) {
            console.error('Error fetching lecturer:', error);
            res.status(500).json({ success: false, message: 'Internal server error' });
        }
    }

    static async createLecturer(req, res) {
        try {
            const lecturerData = {
                ...req.body,
                start_time: req.body.start_time,  // Store just the time
                end_time: req.body.end_time,     // Store just the time
                joining_date: req.body.joining_date,
                photo: req.files['photo'] ? '/uploads/photos/' + req.files['photo'][0].filename : '',
                certificates: req.files['certificates'] ? req.files['certificates'].map(file => '/uploads/certificates/' + file.filename) : [],
                measures_id: req.body.measures_id || null
            };

            const lecturerId = await LecturerModel.createLecturer(lecturerData);
            res.status(201).json({ 
                success: true, 
                message: 'Lecturer created successfully',
                data: { lecturer_id: lecturerId }
            });
        } catch (error) {
            console.error('Error creating lecturer:', error);
            res.status(500).json({ success: false, message: 'Internal server error' });
        }
    }

    static async updateLecturer(req, res) {
        try {
            const lecturerId = req.params.id;
            const existingLecturer = await LecturerModel.getLecturerById(lecturerId);
            
            if (!existingLecturer) {
                return res.status(404).json({ success: false, message: 'Lecturer not found' });
            }

            // Use time fields as is
            if (req.body.start_time) {
                req.body.start_time = req.body.start_time;
            }
            if (req.body.end_time) {
                req.body.end_time = req.body.end_time;
            }

            let updatedCertificates = existingLecturer.certificates;

            // Handle certificate deletion if certificatesToDelete is provided
            if (req.body.certificatesToDelete) {
                // Parse the JSON string if it's sent as a string
                const certificatesToDelete = typeof req.body.certificatesToDelete === 'string' 
                    ? JSON.parse(req.body.certificatesToDelete)
                    : req.body.certificatesToDelete;

                if (Array.isArray(certificatesToDelete)) {
                    // Remove base URL from both the certificates to delete and existing certificates
                    const certificatesWithoutBaseUrl = certificatesToDelete.map(cert => 
                        cert.replace(new RegExp(`^${process.env.BACKEND_URL}+`), '')
                    );
                    
                    // Filter out the certificates that should be deleted
                    updatedCertificates = existingLecturer.certificates.map(cert => 
                        cert.replace(new RegExp(`^${process.env.BACKEND_URL}+`), '')
                    ).filter(
                        cert => !certificatesWithoutBaseUrl.includes(cert)
                    );
                }
            }

            // Handle new certificates if uploaded
            if (req.files && req.files['certificates']) {
                const newCertificates = req.files['certificates'].map(
                    file => '/uploads/certificates/' + file.filename
                );
                updatedCertificates = [...updatedCertificates, ...newCertificates];
            }

            const lecturerData = {
                ...req.body,
                photo: req.files && req.files['photo'] 
                    ? '/uploads/photos/' + req.files['photo'][0].filename 
                    : (existingLecturer.photo.replace(process.env.BACKEND_URL, '')) || '',
                certificates: updatedCertificates
            };

            // Remove certificatesToDelete from the data to be saved
            delete lecturerData.certificatesToDelete;

            const success = await LecturerModel.updateLecturer(lecturerId, lecturerData);
            if (success) {
                res.json({ 
                    success: true, 
                    message: 'Lecturer updated successfully',
                    data: {
                        ...lecturerData,
                        lecturer_id: lecturerId
                    }
                });
            } else {
                res.status(400).json({ success: false, message: 'Failed to update lecturer' });
            }
        } catch (error) {
            console.error('Error updating lecturer:', error);
            res.status(500).json({ success: false, message: 'Internal server error' });
        }
    }

    static async deleteLecturer(req, res) {
        try {
            const success = await LecturerModel.deleteLecturer(req.params.id);
            if (success) {
                res.json({ success: true, message: 'Lecturer deleted successfully' });
            } else {
                res.status(404).json({ success: false, message: 'Lecturer not found' });
            }
        } catch (error) {
            console.error('Error deleting lecturer:', error);
            res.status(500).json({ success: false, message: 'Internal server error' });
        }
    }

    static async deleteCertificate(req, res) {
        try {
            const { id } = req.params;
            const { certificateUrl } = req.body;

            if (!certificateUrl) {
                return res.status(400).json({ 
                    success: false, 
                    message: 'Certificate URL is required' 
                });
            }

            const success = await LecturerModel.deleteCertificate(id, certificateUrl);
            
            if (success) {
                res.json({ 
                    success: true, 
                    message: 'Certificate deleted successfully' 
                });
            } else {
                res.status(404).json({ 
                    success: false, 
                    message: 'Lecturer not found or certificate does not exist' 
                });
            }
        } catch (error) {
            console.error('Error deleting certificate:', error);
            res.status(500).json({ 
                success: false, 
                message: 'Internal server error' 
            });
        }
    }

    static async login(req, res) {
        try {
            const { lecturer_id, password } = req.body;
            console.log('Login request body:', { lecturer_id, password });

            // Validate input
            if (!lecturer_id || !password) {
                console.log('Missing required fields');
                return res.status(400).json({
                    success: false,
                    message: 'Lecturer ID and password are required'
                });
            }

            console.log('Attempting lecturer login with username:', lecturer_id);
            // Attempt login
            const lecturer = await LecturerModel.login(lecturer_id, password);
            console.log('Login result:', lecturer);
            
            if (!lecturer) {
                return res.status(401).json({
                    success: false,
                    message: 'Invalid credentials'
                });
            }

            // Generate JWT token
            const token = jwt.sign(
                { 
                    lecturer_id: lecturer.lecturer_id,
                    role: 'lecturer'
                },
                process.env.JWT_SECRET,
                { expiresIn: '24h' }
            );

            res.json({
                success: true,
                message: 'Login successful',
                data: {
                    token,
                    lecturer
                }
            });
        } catch (error) {
            console.error('Error during login:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }

    static uploadFiles = upload.fields([
        { name: 'photo', maxCount: 1 },
        { name: 'certificates', maxCount: 5 }
    ]);
}

module.exports = {
    getAllLecturers: LecturerController.getAllLecturers,
    getLecturerById: LecturerController.getLecturerById,
    createLecturer: LecturerController.createLecturer,
    updateLecturer: LecturerController.updateLecturer,
    deleteLecturer: LecturerController.deleteLecturer,
    deleteCertificate: LecturerController.deleteCertificate,
    login: LecturerController.login,
    uploadFiles: LecturerController.uploadFiles
};
