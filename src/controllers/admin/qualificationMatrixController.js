const QualificationMatrix = require('../../models/qualificationMatrixModel');
const PDFGenerator = require('../../utils/pdfGenerator');
const path = require('path');
const db = require('../../config/database');
const { getAllLecturers } = require('../../controllers/admin/lecturerController');
const LecturerModel = require('../../models/lecturerModel');

class QualificationMatrixController {
    static async generateMatrix(req, res) {
        try {
            const description = 'Qualifizierungsmatrix';

            // Get all lecturers
            const lecturers = await LecturerModel.getAllLecturers();
            
            // Generate PDF
            const pdfResult = await PDFGenerator.generateQualificationMatrixPDF(lecturers);

            // Construct PDF URL
            const pdfUrl = pdfResult.url;

            // Save to database
            const matrixId = await QualificationMatrix.create(description, pdfUrl);
            
            // Get created record
            const matrix = await QualificationMatrix.getById(matrixId);

            res.status(201).json({
                success: true,
                data: matrix
            });
        } catch (error) {
            console.error('Error generating qualification matrix:', error);
            res.status(500).json({
                success: false,
                message: 'Error generating qualification matrix',
                error: error.message
            });
        }
    }

    static async getAllMatrices(req, res) {
        try {
            const matrices = await QualificationMatrix.getAll();
            // matrices.map((matrix) => {
            //     matrix.pdf_url = process.env.BACKEND_URL + matrix.pdf_url;
            // });
            
            res.json({
                success: true,
                data: matrices
            });
        } catch (error) {
            console.error('Error fetching qualification matrices:', error);
            res.status(500).json({
                success: false,
                message: 'Error fetching qualification matrices',
                error: error.message
            });
        }
    }

    static async getMatrixById(req, res) {
        try {
            const { id } = req.params;
            const matrix = await QualificationMatrix.getById(id);
            
            if (!matrix) {
                return res.status(404).json({
                    success: false,
                    message: 'Qualification matrix not found'
                });
            }

            res.json({
                success: true,
                data: matrix
            });
        } catch (error) {
            console.error('Error fetching qualification matrix:', error);
            res.status(500).json({
                success: false,
                message: 'Error fetching qualification matrix',
                error: error.message
            });
        }
    }

    static async deleteMatrix(req, res) {
        try {
            const { id } = req.params;
            const result = await QualificationMatrix.delete(id);
            
            if (!result.success) {
                return res.status(404).json({
                    success: false,
                    message: result.message
                });
            }

            res.json({
                success: true,
                message: result.message
            });
        } catch (error) {
            console.error('Error deleting qualification matrix:', error);
            res.status(500).json({
                success: false,
                message: 'Error deleting qualification matrix',
                error: error.message
            });
        }
    }
}

module.exports = QualificationMatrixController;
