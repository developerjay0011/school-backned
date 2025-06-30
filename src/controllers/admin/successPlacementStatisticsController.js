const SuccessPlacementStatisticsModel = require('../../models/successPlacementStatisticsModel');
const MeasurementModel = require('../../models/measurementModel');
const PDFGenerator = require('../../utils/pdfGenerator');
const path = require('path');
const fs = require('fs');

class SuccessPlacementStatisticsController {
    static async generateStatistics(req, res) {
        try {
            const { year, measureId } = req.body;

            // Validate input
            if (!year || !measureId) {
                return res.status(400).json({
                    success: false,
                    message: 'Year and measure ID are required'
                });
            }

            // Validate year
            const currentYear = new Date().getFullYear();
            if (year < 2000 || year > currentYear + 1) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid year provided'
                });
            }

            // Get measure info
            const measureInfo = await MeasurementModel.findById(measureId);
            if (!measureInfo) {
                return res.status(404).json({
                    success: false,
                    message: 'Measure not found'
                });
            }

            // Generate PDF
            // Generate PDF
            const pdfData = {
                year,
                measureInfo
            };
            
            const pdfResult = await PDFGenerator.generateSuccessAndPlacementStatisticsPDF(pdfData);
            
            if (!pdfResult || !pdfResult.url) {
                throw new Error('PDF generation failed - no URL returned');
            }

            // Ensure uploads directory exists
            const uploadsDir = path.join(__dirname, '../../../uploads');
            if (!fs.existsSync(uploadsDir)) {
                fs.mkdirSync(uploadsDir, { recursive: true });
            }

            // Save to database
            const data = {
                year,
                measures_id: measureId,
                pdf_url: pdfResult.url,
                description: `Success and Placement Statistics for ${measureInfo.measures_title} (${year})`
            };

            const statisticsId = await SuccessPlacementStatisticsModel.create(data);
            if (!statisticsId) {
                throw new Error('Failed to save statistics to database');
            }

            const statistics = await SuccessPlacementStatisticsModel.getById(statisticsId);
            if (!statistics) {
                throw new Error('Failed to retrieve saved statistics');
            }

            res.json({
                success: true,
                message: 'Success and placement statistics generated successfully',
                data: statistics
            });
        } catch (error) {
            console.error('Error generating statistics:', error);
            res.status(500).json({
                success: false,
                message: error.message || 'Internal server error',
                error: error.code || 'UNKNOWN_ERROR'
            });
        }
    }

    static async getAllStatistics(req, res) {
        try {
            const statistics = await SuccessPlacementStatisticsModel.getAll();
            res.json({
                success: true,
                data: statistics
            });
        } catch (error) {
            console.error('Error fetching statistics:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }

    static async getStatistics(req, res) {
        try {
            const { id } = req.params;

            const statistics = await SuccessPlacementStatisticsModel.getById(id);
            if (!statistics) {
                return res.status(404).json({
                    success: false,
                    message: 'Statistics not found'
                });
            }

            res.json({
                success: true,
                data: statistics
            });
        } catch (error) {
            console.error('Error fetching statistics:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }

    static async deleteStatistics(req, res) {
        try {
            const { id } = req.params;

            // First check if the statistics exists
            const statistics = await SuccessPlacementStatisticsModel.getById(id);
            if (!statistics) {
                return res.status(404).json({
                    success: false,
                    message: 'Statistics not found'
                });
            }

            // Delete the PDF file if it exists
            if (statistics.pdfUrl) {
                const pdfPath = path.join(__dirname, '../..', statistics.pdfUrl);
                if (fs.existsSync(pdfPath)) {
                    fs.unlinkSync(pdfPath);
                }
            }

            // Delete from database
            const deleted = await SuccessPlacementStatisticsModel.deleteById(id);
            if (!deleted) {
                return res.status(404).json({
                    success: false,
                    message: 'Failed to delete statistics'
                });
            }

            res.json({
                success: true,
                message: 'Statistics deleted successfully'
            });
        } catch (error) {
            console.error('Error deleting statistics:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }
}

module.exports = SuccessPlacementStatisticsController;
