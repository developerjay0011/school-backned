const StudentResultSheetModel = require('../../models/studentResultSheetModel');
const ResultSheetPdfModel = require('../../models/resultSheetPdfModel');
const PDFGenerator = require('../../utils/pdfGenerator');

class StudentResultSheetController {
    static async deletePdf(req, res) {
        try {
            const { id } = req.params;
            const success = await ResultSheetPdfModel.delete(id);

            if (!success) {
                return res.status(404).json({
                    success: false,
                    message: 'PDF record not found'
                });
            }

            res.json({
                success: true,
                message: 'PDF record deleted successfully'
            });
        } catch (error) {
            console.error('Error deleting PDF record:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }

    static async sendPdfByEmail(req, res) {
        try {
            const { id } = req.params;
            const { email } = req.body;

            // TODO: Add email sending logic here
            // For now, just update the sent info
            const success = await ResultSheetPdfModel.updateSentInfo(id, email);

            if (!success) {
                return res.status(404).json({
                    success: false,
                    message: 'PDF record not found'
                });
            }

            res.json({
                success: true,
                message: 'PDF sent successfully'
            });
        } catch (error) {
            console.error('Error sending PDF:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }

    static async getPdfs(req, res) {
        try {
            const { studentId } = req.params;
            const pdfs = await ResultSheetPdfModel.getByStudentId(studentId);

            // Add full URL to each PDF
            const pdfList = pdfs.map(pdf => ({
                ...pdf,
                pdf_url: process.env.BACKEND_URL + pdf.pdf_url
            }));

            res.json({
                success: true,
                data: pdfList
            });
        } catch (error) {
            console.error('Error fetching PDFs:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }

    static async getByStudentId(req, res) {
        try {
            const { studentId } = req.params;
            const resultSheet = await StudentResultSheetModel.getByStudentId(studentId);

            if (!resultSheet) {
                return res.status(200).json({
                    success: true,
                    data: null,
                    message: 'Result sheet not found for this student'
                });
            }

            res.json({
                success: true,
                data: resultSheet
            });
        } catch (error) {
            console.error('Error fetching result sheet:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }

    static async create(req, res) {
        try {
            const { studentId } = req.params;
            const data = { student_id: studentId, ...req.body };

            const id = await StudentResultSheetModel.create(data);
            
            res.status(201).json({
                success: true,
                message: 'Result sheet created successfully',
                data: { id }
            });
        } catch (error) {
            console.error('Error creating result sheet:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }

    static async update(req, res) {
        try {
            const { studentId } = req.params;
            const success = await StudentResultSheetModel.update({ student_id: studentId, ...req.body });

            if (!success) {
                return res.status(404).json({
                    success: false,
                    message: 'Result sheet not found or no changes made'
                });
            }

            res.json({
                success: true,
                message: 'Result sheet updated successfully'
            });
        } catch (error) {
            console.error('Error updating result sheet:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }

    static async delete(req, res) {
        try {
            const { studentId } = req.params;
            const success = await StudentResultSheetModel.delete(studentId);

            if (!success) {
                return res.status(404).json({
                    success: false,
                    message: 'Result sheet not found'
                });
            }

            res.json({
                success: true,
                message: 'Result sheet deleted successfully'
            });
        } catch (error) {
            console.error('Error deleting result sheet:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }

    static async generatePDF(req, res) {
        try {
            const { studentId } = req.params;
            const data = req.body;

            // Generate PDF first
            const pdfResult = await PDFGenerator.generateResultSheetPDF(data);

            // Update result sheet with the PDF URL
            await StudentResultSheetModel.update({
                student_id: studentId,
                pdf_url: pdfResult.url
            });

            // Create PDF entry
            await ResultSheetPdfModel.create({
                student_id: studentId,
                pdf_url: pdfResult.url
            });

            res.json({
                success: true,
                message: 'PDF generated successfully',
                data: {
                    ...pdfResult,
                    studentId
                }
            });
        } catch (error) {
            console.error('Error generating PDF:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }
}

module.exports = StudentResultSheetController;
