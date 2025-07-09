const FeedbackEvaluationModel = require('../../models/feedbackEvaluationModel');
const FeedbackModel = require('../../models/feedbackModel');
const MeasurementModel = require('../../models/measurementModel');
const PDFGenerator = require('../../utils/pdfGenerator');
const DateTimeUtils = require('../../utils/dateTimeUtils');
const path = require('path');
const fs = require('fs');

class FeedbackEvaluationController {
    static async generateFeedbackSheet(req, res) {
        try {
            const { dateFrom, dateUntil, courseId } = req.body;

            // Validate input
            if (!dateFrom || !dateUntil || !courseId) {
                return res.status(400).json({
                    success: false,
                    message: 'Date from, date until, and course ID are required'
                });
            }

            // Parse dates using DateTimeUtils
            const fromDate = DateTimeUtils.parseToDateTime(dateFrom);
            const untilDate = DateTimeUtils.parseToDateTime(dateUntil);

            if (!fromDate.isValid() || !untilDate.isValid()) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid date format. Please use YYYY-MM-DD format'
                });
            }

            // Convert to YYYY-MM format for PDF generation
            const monthFrom = fromDate.format('YYYY-MM');  // YYYY-MM format
            const monthUntil = untilDate.format('YYYY-MM');  // YYYY-MM format

            // Get measure info by course number
            const measureInfo = await MeasurementModel.findById(courseId);
            if (!measureInfo) {
                return res.status(404).json({
                    success: false,
                    message: 'Course not found'
                });
            }
            console.log("measureInfo", measureInfo);

            // Get feedbacks for the period
            const feedbacks = await FeedbackModel.getFeedbacksByDateRangeAndMeasure(
                fromDate,
                untilDate,
                courseId
            );
            console.log("feedbacks", feedbacks);
            
            // Generate PDF with feedback data
            const pdfData = { 
                dateFrom: monthFrom,  // YYYY-MM format for PDF generation
                dateUntil: monthUntil,  // YYYY-MM format for PDF generation
                feedbacks
            };
            const pdfResult = await PDFGenerator.generateFeedbackSheetPDF(
                pdfData,
                feedbacks,
                measureInfo
            );
            console.log("measureInfo.id", measureInfo.id);
            
            // Save to database
            const data = {
                dateFrom: DateTimeUtils.formatToSQLDate(fromDate),
                dateUntil: DateTimeUtils.formatToSQLDate(untilDate),
                measures_id: measureInfo.id,
                pdfUrl: pdfResult.url,
                description: `3 Monatige Maßnahmen ${measureInfo.measures_title} Unterricht 09:00 bis 16:15 Uhr`
            };

            const evaluationId = await FeedbackEvaluationModel.create(data);
            const evaluation = await FeedbackEvaluationModel.getById(evaluationId);

            res.json({
                success: true,
                message: 'Feedback evaluation generated successfully',
                data: evaluation
            });
        } catch (error) {
            console.error('Error generating feedback sheet:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }

    static async getAllEvaluations(req, res) {
        try {
            const evaluations = await FeedbackEvaluationModel.getAll();
            res.json({
                success: true,
                data: evaluations
            });
        } catch (error) {
            console.error('Error fetching evaluations:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }

    static async getEvaluation(req, res) {
        try {
            const { id } = req.params;

            const evaluation = await FeedbackEvaluationModel.getById(id);
            if (!evaluation) {
                return res.status(404).json({
                    success: false,
                    message: 'Feedback evaluation not found'
                });
            }

            res.json({
                success: true,
                data: evaluation
            });
        } catch (error) {
            console.error('Error fetching evaluation:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }

    static async deleteEvaluation(req, res) {
        try {
            const { id } = req.params;

            // First check if the evaluation exists
            const evaluation = await FeedbackEvaluationModel.getById(id);
            if (!evaluation) {
                return res.status(404).json({
                    success: false,
                    message: 'Feedback evaluation not found'
                });
            }

            // Delete the PDF file if it exists
            if (evaluation.pdfUrl) {
                const pdfPath = path.join(__dirname, '../..', evaluation.pdfUrl);
                if (fs.existsSync(pdfPath)) {
                    fs.unlinkSync(pdfPath);
                }
            }

            // Delete from database
            const deleted = await FeedbackEvaluationModel.deleteById(id);
            
            if (!deleted) {
                return res.status(404).json({
                    success: false,
                    message: 'Failed to delete feedback evaluation'
                });
            }

            res.json({
                success: true,
                message: 'Feedback evaluation deleted successfully'
            });
        } catch (error) {
            console.error('Error deleting evaluation:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }
}

module.exports = FeedbackEvaluationController;
