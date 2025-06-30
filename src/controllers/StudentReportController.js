const PDFGenerator = require('../utils/pdfGenerator');
const Student = require('../models/studentModel');
const StudentReport = require('../models/studentReportModel');

class StudentReportController {
    static async createDischargeReport(req, res) {
        try {
            const { studentId } = req.params;
            const reportData = req.body;

            // Get student data
            const student = await Student.getById(studentId);
            if (!student) {
                return res.status(404).json({
                    success: false,
                    message: 'Student not found'
                });
            }

            // Combine student data with report data
            const pdfData = {
                ...reportData,
                first_name: `${student.first_name} ${student.last_name}`,
                birth_date: student.birth_date,
                bg_number: student.bg_number,
                type: 'discharge',
                measures_name: student.measures_title,
                measures: student.measures_number,
                date_of_entry: student.date_of_entry,
                date_of_exit: student.date_of_exit,
                intermediary_internal: student.intermediary_internal,
                lecturer: student.lecturer,
            };
            console.log("student PDF data2:", pdfData);

            // Generate PDF
            const pdfResult = await PDFGenerator.generateReportPDF(pdfData);
            console.log('PDF generation result:', pdfResult);

            // Create full URL for PDF
            const baseUrl = process.env.BACKEND_URL || 'http://localhost:3000';
            const pdfUrl = `${baseUrl}${pdfResult.url}`;
            console.log('Generated PDF URL:', { baseUrl, pdfResult, pdfUrl });

            // Prepare report data
            const reportDataToSave = {
                ...reportData,
                early_exam_success: reportData.exam_status === 'passed',
                exam_not_passed: reportData.exam_status === 'failed'
            };
            console.log('Saving report with data:', { reportDataToSave, pdfUrl });

            // Save report details to database
            const reportId = await StudentReport.createDischargeReport(studentId, reportDataToSave, pdfUrl);

            // Fetch the saved report to verify
            const savedReport = await StudentReport.getById(reportId);
            console.log('Saved report:', savedReport);

            res.json({
                success: true,
                message: 'Discharge report generated successfully',
                data: pdfResult
            });

        } catch (error) {
            console.error('Error generating discharge report:', error);
            res.status(500).json({
                success: false,
                message: 'Error generating discharge report',
                error: error.message
            });
        }
    }

    static async createTerminationReport(req, res) {
        try {
            const { studentId } = req.params;
            const reportData = req.body;

            // Get student data
            const student = await Student.getById(studentId);
            if (!student) {
                return res.status(404).json({
                    success: false,
                    message: 'Student not found'
                });
            }

            // Combine student data with report data
            const pdfData = {
                ...reportData,
                first_name: `${student.first_name} ${student.last_name}`,
                birth_date: student.birth_date,
                bg_number: student.bg_number,
                type: 'termination',
                measures_name: student.measures_title,
                measures: student.measures_number,
                date_of_entry: student.date_of_entry,
                date_of_exit: student.date_of_exit,
                intermediary_internal: student.intermediary_internal,
                lecturer: student.lecturer,
            };

            // Generate PDF
            const pdfResult = await PDFGenerator.generateReportPDF(pdfData);
            console.log('PDF generation result:', pdfResult);

            // Create full URL for PDF
            const baseUrl = process.env.BACKEND_URL || 'http://localhost:3000';
            const pdfUrl = `${baseUrl}${pdfResult.url}`;
            console.log('Generated PDF URL:', { baseUrl, pdfResult, pdfUrl });

            // Prepare report data
            const reportDataToSave = {
                ...reportData,
                insufficient_performance: reportData.insufficient_performance || false,
                longer_periods_absence: reportData.longer_periods_absence || false,
                other_reasons: reportData.other_reasons || false
            };
            console.log('Saving report with data:', { reportDataToSave, pdfUrl });

            // Save report details to database
            const reportId = await StudentReport.createTerminationReport(studentId, reportDataToSave, pdfUrl);

            // Fetch the saved report to verify
            const savedReport = await StudentReport.getById(reportId);
            console.log('Saved report:', savedReport);

            res.json({
                success: true,
                message: 'Termination report generated successfully',
                data: pdfResult
            });

        } catch (error) {
            console.error('Error generating termination report:', error);
            res.status(500).json({
                success: false,
                message: 'Error generating termination report',
                error: error.message
            });
        }
    }
}

module.exports = StudentReportController;
