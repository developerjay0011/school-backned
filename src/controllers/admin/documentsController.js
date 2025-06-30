const QualificationMatrixModel = require('../../models/qualificationMatrixModel');
const QualifizierungsplanModel = require('../../models/qualifizierungsplanModel');
const FeedbackEvaluationModel = require('../../models/feedbackEvaluationModel');
const SuccessPlacementStatisticsModel = require('../../models/successPlacementStatisticsModel');
const MonthlyReportModel = require('../../models/monthlyReportModel');

class DocumentsController {
    static async getAllDocuments(req, res) {
        try {
            // Get all documents in parallel
            const [
                qualificationMatrix,
                qualifizierungsplan,
                feedbackEvaluation,
                successPlacementStats,
                monthlyReports
            ] = await Promise.all([
                // Get all qualification matrix documents
                QualificationMatrixModel.getAll(),
                
                // Get all Qualifizierungsplan documents
                QualifizierungsplanModel.getAll(),
                
                // Get all feedback evaluation documents
                FeedbackEvaluationModel.getAll(),
                
                // Get all success and placement statistics
                SuccessPlacementStatisticsModel.getAll(),

                // Get all monthly reports grouped by lecturer
                MonthlyReportModel.getAllGroupedByLecturer()
            ]);

            // Format response with counts and data
            return res.status(200).json({
                success: true,
                data: {
                    // Qualification Matrix documents
                    qualificationMatrix: {
                        count: qualificationMatrix.length,
                        documents: qualificationMatrix
                    },
                    // Qualifizierungsplan documents
                    qualifizierungsplan: {
                        count: qualifizierungsplan.length,
                        documents: qualifizierungsplan
                    },
                    // Feedback Evaluation documents
                    feedbackEvaluation: {
                        count: feedbackEvaluation.length,
                        documents: feedbackEvaluation
                    },
                    // Success and Placement Statistics
                    successPlacementStats: {
                        count: successPlacementStats.length,
                        documents: successPlacementStats
                    },
                    // Monthly Reports grouped by lecturer
                    monthlyReports: {
                        lecturerCount: monthlyReports.length,
                        totalReports: monthlyReports.reduce((sum, lecturer) => sum + lecturer.reports.length, 0),
                        lecturers: monthlyReports
                    }
                }
            });
        } catch (error) {
            console.error('Error getting documents:', error);
            return res.status(500).json({
                success: false,
                message: 'Failed to get documents',
                error: error.message
            });
        }
    }
}

module.exports = DocumentsController;
