const MonthlyReportModel = require('../../models/monthlyReportModel');
const TrainingReportModel = require('../../models/trainingReportModel');
const PDFGenerator = require('../../utils/pdfGenerator');
const db = require('../../config/database');
const fs = require('fs');
const path = require('path');

class MonthlyReportController {
    static async generate(req, res) {
        try {
            const { month, year } = req.body;
            console.log('Generating monthly report for:', { month, year, lecturer: req.user });

            // Get all training reports for the specified month and year
            const startDate = new Date(year, month - 1, 1);
            const endDate = new Date(year, month, 0); // Last day of month
            
            const reports = await TrainingReportModel.getByDateRange(
                req.user.lecturer_id,
                startDate.toISOString().split('T')[0],
                endDate.toISOString().split('T')[0]
            );

            if (!reports || reports.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'No training reports found for the specified month'
                });
            }

            // Get lecturer details
            const [lecturer] = await db.execute(
                'SELECT first_name, last_name FROM lecturers WHERE lecturer_id = ? AND deleted_at IS NULL',
                [req.user.lecturer_id]
            );
            console.log('Lecturer details:', lecturer);
            if (!lecturer) {
                return res.status(404).json({
                    success: false,
                    message: 'Lecturer not found'
                });
            }

            // Generate PDF
            const monthNames = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 
                              'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'];
            const description = `Schulungsreport Monat: ${monthNames[month - 1]} ${year} Dozent: ${lecturer[0].first_name} ${lecturer[0].last_name}`;
            
            const pdfResult = await PDFGenerator.generateTrainingReport(reports);

            // Create monthly report record
            const monthlyReport = await MonthlyReportModel.create({
                lecturer_id: req.user.lecturer_id,
                description,
                pdf_url: pdfResult.url,
                month,
                year
            });

            res.json({
                success: true,
                data: {
                    id: monthlyReport,
                    pdf_url: pdfResult.url,
                    description
                }
            });
        } catch (error) {
            console.error('Error generating monthly report:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }

    static async getAll(req, res) {
        try {
            const reports = await MonthlyReportModel.getAll(req.user.lecturer_id);
            res.json({
                success: true,
                data: reports
            });
        } catch (error) {
            console.error('Error getting monthly reports:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }

    static async delete(req, res) {
        try {
            const deleted = await MonthlyReportModel.delete(req.params.id, req.user.lecturer_id);
            if (!deleted) {
                return res.status(404).json({
                    success: false,
                    message: 'Monthly report not found'
                });
            }

            res.json({
                success: true,
                message: 'Monthly report deleted successfully'
            });
        } catch (error) {
            console.error('Error deleting monthly report:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }
}

module.exports = MonthlyReportController;
