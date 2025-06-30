const Assessment = require('../../models/assessmentModel');

class AssessmentController {
    static async generateLink(req, res) {
        try {
            const link = await Assessment.generateLink();

            res.status(201).json({
                success: true,
                message: 'Assessment link generated successfully',
                data: {
                    token: link.token,
                    expiry_date: link.expiryDate,
                    assessment_url: `${process.env.FRONTEND_URL}/assessment-suitability-form?token=${link.token}`
                }
            });
        } catch (error) {
            console.error('Error generating assessment link:', error);
            res.status(500).json({
                success: false,
                message: 'Error generating assessment link',
                error: error.message
            });
        }
    }

    static async validateToken(req, res) {
        try {
            const { token } = req.params;
            const link = await Assessment.validateToken(token);

            if (!link) {
                return res.status(404).json({
                    success: false,
                    message: 'Invalid or expired assessment link'
                });
            }

            res.json({
                success: true,
                message: 'Valid assessment link',
                data: {
                    first_name: link.first_name,
                    last_name: link.last_name,
                    expiry_date: link.expiry_date
                }
            });
        } catch (error) {
            console.error('Error validating token:', error);
            res.status(500).json({
                success: false,
                message: 'Error validating token',
                error: error.message
            });
        }
    }

    static async getQuestions(req, res) {
        try {
            const { token } = req.params;
            const link = await Assessment.validateToken(token);

            if (!link) {
                return res.status(404).json({
                    success: false,
                    message: 'Invalid or expired assessment link'
                });
            }

            const questions = await Assessment.getQuestions();

            res.json({
                success: true,
                message: 'Questions retrieved successfully',
                data: questions
            });
        } catch (error) {
            console.error('Error retrieving questions:', error);
            res.status(500).json({
                success: false,
                message: 'Error retrieving questions',
                error: error.message
            });
        }
    }

    static async submitResponses(req, res) {
        try {
            const { token } = req.params;
            const link = await Assessment.validateToken(token);

            if (!link) {
                return res.status(404).json({
                    success: false,
                    message: 'Invalid or expired assessment link'
                });
            }

            const { first_name, last_name, signature_image, responses } = req.body;
            await Assessment.submitResponses(link.id, first_name, last_name, signature_image, responses);
            const results = await Assessment.getResults(link.id);

            // Generate PDF
            const PDFGenerator = require('../../utils/pdfGenerator');
            const pdfResult = await PDFGenerator.generateAssessmentPDF({
                first_name,
                last_name,
                signature_image,
                responses,
                ...results
            });

            // Update response with PDF URL
            const pdfUrl = `/uploads/${pdfResult.filename}`;
            await Assessment.updatePdfUrl(link.id, pdfUrl);

            // Include full URL in response
            const fullPdfUrl = `${process.env.BACKEND_URL}${pdfUrl}`;

            res.json({
                success: true,
                message: 'Assessment submitted successfully',
                data: {
                    ...results,
                    pdf_url: fullPdfUrl
                }
            });
        } catch (error) {
            console.error('Error submitting responses:', error);
            res.status(500).json({
                success: false,
                message: 'Error submitting responses',
                error: error.message
            });
        }
    }

    static async getResults(req, res) {
        try {
            const { token } = req.params;
            const link = await Assessment.validateToken(token);

            if (!link) {
                return res.status(404).json({
                    success: false,
                    message: 'Invalid or expired assessment link'
                });
            }

            const results = await Assessment.getResults(link.id);

            res.json({
                success: true,
                message: 'Results retrieved successfully',
                data: results
            });
        } catch (error) {
            console.error('Error retrieving results:', error);
            res.status(500).json({
                success: false,
                message: 'Error retrieving results',
                error: error.message
            });
        }
    }

    static async getAllAssessments(req, res) {
        try {
            const assessments = await Assessment.getAllAssessments();

            res.json({
                success: true,
                message: 'Assessments retrieved successfully',
                data: assessments
            });
        } catch (error) {
            console.error('Error retrieving assessments:', error);
            res.status(500).json({
                success: false,
                message: 'Error retrieving assessments',
                error: error.message
            });
        }
    }

    static async addComment(req, res) {
        try {
            const { id } = req.params;
            const { comment } = req.body;

            // Add comment to assessment
            const assessment = await Assessment.addComment(id, comment);

            if (!assessment) {
                return res.status(404).json({
                    success: false,
                    message: 'Assessment not found'
                });
            }

            // Get all assessment data needed for PDF
            const results = await Assessment.getResults(id);
            if (!results) {
                return res.status(404).json({
                    success: false,
                    message: 'Assessment results not found'
                });
            }

            // Generate new PDF with updated comment
            const PDFGenerator = require('../../utils/pdfGenerator');
            const pdfResult = await PDFGenerator.generateAssessmentPDF({
                first_name: results.first_name,
                last_name: results.last_name,
                signature_image: results.signature_image,
                responses: results.responses,
                comment: comment,
                ...results
            });

            // Update PDF URL
            const pdfUrl = `/uploads/${pdfResult.filename}`;
            await Assessment.updatePdfUrl(id, pdfUrl);

            // Include full URL in response
            const fullPdfUrl = `${process.env.BACKEND_URL}${pdfUrl}`;

            res.json({
                success: true,
                message: 'Comment added successfully',
                data: {
                    ...assessment,
                    pdf_url: fullPdfUrl
                }
            });
        } catch (error) {
            console.error('Error adding comment:', error);
            res.status(500).json({
                success: false,
                message: 'Error adding comment',
                error: error.message
            });
        }
    }

    static async deleteAssessment(req, res) {
        try {
            const { id } = req.params;
            const deleted = await Assessment.deleteAssessment(id);

            if (!deleted) {
                return res.status(404).json({
                    success: false,
                    message: 'Assessment not found'
                });
            }

            res.json({
                success: true,
                message: 'Assessment deleted successfully'
            });
        } catch (error) {
            console.error('Error deleting assessment:', error);
            res.status(500).json({
                success: false,
                message: 'Error deleting assessment',
                error: error.message
            });
        }
    }
}

module.exports = AssessmentController;
