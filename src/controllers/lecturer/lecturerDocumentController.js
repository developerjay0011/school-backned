const LecturerDocumentModel = require('../../models/lecturerDocumentModel');
const path = require('path');
const fs = require('fs').promises;

class LecturerDocumentController {
    static async uploadDocument(req, res) {
        try {
            if (!req.file) {
                return res.status(400).json({
                    success: false,
                    message: 'No file uploaded'
                });
            }

            const { description } = req.body;
            const lecturerId = req.user.lecturer_id;
            
            // Save file details to database
            const documentId = await LecturerDocumentModel.create({
                lecturer_id: lecturerId,
                file_name: req.file.originalname,
                file_path: req.file.path,
                description: description || null
            });
            
            return res.json({
                success: true,
                message: 'Document uploaded successfully',
                data: {
                    id: documentId,
                    file_name: req.file.originalname,
                    description: description
                }
            });
        } catch (error) {
            // Clean up uploaded file if database operation fails
            if (req.file && req.file.path) {
                await fs.unlink(req.file.path).catch(console.error);
            }

            console.error('Error uploading document:', error);
            return res.status(500).json({
                success: false,
                message: 'Error uploading document',
                error: error.message
            });
        }
    }

    static async getDocuments(req, res) {
        try {
            const lecturerId = req.user.lecturer_id;
            const documents = await LecturerDocumentModel.getByLecturerId(lecturerId);
            documents.forEach(doc => {
                doc.file_path = `${process.env.BACKEND_URL}/${doc.file_path}`;
            });
            return res.json({
                success: true,
                message: 'Documents retrieved successfully',
                data: documents
            });
        } catch (error) {
            console.error('Error retrieving documents:', error);
            return res.status(500).json({
                success: false,
                message: 'Error retrieving documents',
                error: error.message
            });
        }
    }

    static async deleteDocument(req, res) {
        try {
            const { id } = req.params;
            const lecturerId = req.user.lecturer_id;

            const success = await LecturerDocumentModel.delete(id, lecturerId);
            
            if (!success) {
                return res.status(404).json({
                    success: false,
                    message: 'Document not found or already deleted'
                });
            }

            return res.json({
                success: true,
                message: 'Document deleted successfully'
            });
        } catch (error) {
            console.error('Error deleting document:', error);
            return res.status(500).json({
                success: false,
                message: 'Error deleting document',
                error: error.message
            });
        }
    }
}

module.exports = LecturerDocumentController;
