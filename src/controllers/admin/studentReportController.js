const StudentReport = require('../../models/studentReportModel');
const Student = require('../../models/studentModel');
const PDFGenerator = require('../../utils/pdfGenerator');
const path = require('path');
const fs = require('fs');
const db = require('../../config/database');
const EmailService = require('../../utils/emailService');

class StudentReportController {
    static async createDischargeReport(req, res) {
     let connection;
        try {
            connection = await db.getConnection();
            const { studentId } = req.params;
            
            // Validate student exists
            const student = await Student.getByStudentId(studentId);
            if (!student) {
                return res.status(404).json({
                    success: false,
                    message: 'Student not found'
                });
            }

            // Validate required fields
            const { first_day_attendance, last_day_attendance } = req.body;
            if (!first_day_attendance || !last_day_attendance) {
                return res.status(400).json({
                    success: false,
                    message: 'First and last day of attendance are required'
                });
            }

            // Get authority data
            console.log('Getting authority data for student:', studentId);
            const [authorities] = await connection.query(
                'SELECT * FROM authorities WHERE student_id = ?',
                [studentId]
            );
            console.log('Found authorities:', authorities);
            const authorityEmail = authorities?.[0]?.email || null;
            console.log('Authority email:', authorityEmail);

            // Generate PDF
            const pdfData = {
                ...req.body,
                first_name: student.first_name ? `${student.first_name} ${student.last_name || ''}` : '',
                birth_date: student?.birth_date || null,
                bg_number: student?.authority.bg_number || '',
                type: 'discharge',
                measures_name: student?.measures_title,
                measures: student?.measures_number,
                created_at: req.body?.created_at || new Date().toISOString(),
                date_of_entry: student?.date_of_entry || null,
                date_of_exit: student?.date_of_exit || null,
                intermediary_internal: student?.intermediary_internal || '',
                lecturer: student?.lecturer || '',
                authority_email: authorityEmail,
            };
            console.log('Preparing PDF data:', pdfData);

            // Generate PDF
            const pdfResult = await PDFGenerator.generateReportPDF(pdfData);
            if (!pdfResult || !pdfResult.url) {
                throw new Error('Failed to generate PDF');
            }
            console.log('PDF generation result:', pdfResult);

            // Create full URL for PDF
            const baseUrl = process.env.BACKEND_URL || 'http://localhost:3000';
            const pdfUrl = `${baseUrl}${pdfResult.url}`;
            console.log('Generated PDF URL:', { baseUrl, pdfResult, pdfUrl });

            // Save report with PDF URL
            const reportId = await StudentReport.createDischargeReport(studentId, { ...req.body, authority_email: authorityEmail }, pdfUrl);
            
            const report = await StudentReport.getById(reportId);
            console.log('Saved report:', report);

            // Send discharge report email
            if (authorityEmail) {
                try {
                    await EmailService.sendDischargeReportEmail({
                        email: authorityEmail,
                        bgNumber: student.authority.bg_number,
                        measureTitle: student.measures_title,
                        measureNumber: student.measures_number,
                        pdfPath: pdfResult.path
                    });
                    console.log('Discharge report email sent successfully');
                } catch (emailError) {
                    console.error('Error sending discharge report email:', emailError);
                    // Don't fail the request if email fails
                }
            } else {
                console.log('No authority email found, skipping discharge report email');
            }
            
            res.status(201).json({
                success: true,
                data: report
            });
        } catch (error) {
            console.error('Error creating discharge report:', error);
            res.status(500).json({
                success: false,
                message: 'Error creating discharge report'
            });
        } finally {
            if (connection) {
                try {
                    connection.release();
                    console.log('Connection released in User.delete');
                } catch (releaseError) {
                    console.error('Error releasing connection in User.delete:', releaseError);
                }
            }
        }
    }

    static async createTerminationReport(req, res) {
     let connection;
        try {
            connection = await db.getConnection();
            const { studentId } = req.params;
            
            // Validate student exists
            const student = await Student.getByStudentId(studentId);
            if (!student) {
                return res.status(404).json({
                    success: false,
                    message: 'Student not found'
                });
            }

            // Validate required fields
            const { first_day_attendance, last_day_attendance } = req.body;
            if (!first_day_attendance || !last_day_attendance) {
                return res.status(400).json({
                    success: false,
                    message: 'First and last day of attendance are required'
                });
            }
            console.log('student PDF data:', student);
            // Get authority data
            console.log('Getting authority data for student:', studentId);
            const [authorities] = await connection.query(
                'SELECT * FROM authorities WHERE student_id = ?',
                [studentId]
            );
            console.log('Found authorities:', authorities);
            const authorityEmail = authorities?.[0]?.email || null;
            console.log('Authority email:', authorityEmail);

            // Generate PDF
            const pdfData = {
                ...req.body,
                first_name: student?.first_name ? `${student.first_name} ${student.last_name || ''}` : '',
                birth_date: student?.birth_date || null,
                bg_number: student?.authority.bg_number || '',
                type: 'termination',
                measures_name: student?.measures_title,
                measures: student?.measures_number,
                created_at: req.body?.created_at || new Date().toISOString(),
                date_of_entry: student?.date_of_entry || null,
                date_of_exit: student?.date_of_exit || null,
                intermediary_internal: student?.intermediary_internal || '',
                lecturer: student?.lecturer || '',
                authority_email: authorityEmail,
            };
            console.log('Preparing PDF data:', pdfData);

            // Generate PDF
            const pdfResult = await PDFGenerator.generateReportPDF(pdfData);
            if (!pdfResult || !pdfResult.url) {
                throw new Error('Failed to generate PDF');
            }
            console.log('PDF generation result:', pdfResult);

            // Create full URL for PDF
            const baseUrl = process.env.BACKEND_URL || 'http://localhost:3000';
            const pdfUrl = `${baseUrl}${pdfResult.url}`;
            console.log('Generated PDF URL:', { baseUrl, pdfResult, pdfUrl });

            // Save report with PDF URL
            const reportId = await StudentReport.createTerminationReport(studentId, { ...req.body, authority_email: authorityEmail }, pdfUrl);
            
            const report = await StudentReport.getById(reportId);
            console.log('Saved report:', report);

            // Send termination report email
            if (authorityEmail) {
                try {
                    await EmailService.sendTerminationReportEmail({
                        email: authorityEmail,
                        bgNumber: student.authority.bg_number,
                        measureTitle: student.measures_title,
                        measureNumber: student.measures_number,
                        pdfPath: pdfResult.path
                    });
                    console.log('Termination report email sent successfully');
                } catch (emailError) {
                    console.error('Error sending termination report email:', emailError);
                    // Don't fail the request if email fails
                }
            } else {
                console.log('No authority email found, skipping termination report email');
            }
            
            res.status(201).json({
                success: true,
                data: report
            });
        } catch (error) {
            console.error('Error creating termination report:', error);
            res.status(500).json({
                success: false,
                message: 'Error creating termination report'
            });
        } finally {
            if (connection) {
                try {
                    connection.release();
                    console.log('Connection released in User.delete');
                } catch (releaseError) {
                    console.error('Error releasing connection in User.delete:', releaseError);
                }
            }
        }
    }

    static async getStudentReports(req, res) {
     let connection;
        try {
            connection = await db.getConnection();
            const { studentId } = req.params;
            
            // Validate student exists
            const student = await Student.getByStudentId(studentId);
            if (!student) {
                return res.status(200).json({
                    success: true,
                    data: []
                });
            }

            const reports = await StudentReport.getStudentReports(studentId);
            
            res.json({
                success: true,
                data: reports
            });
        } catch (error) {
            console.error('Error getting student reports:', error);
            res.status(500).json({
                success: false,
                message: 'Error getting student reports'
            });
        } finally {
            if (connection) {
                try {
                    connection.release();
                    console.log('Connection released in User.delete');
                } catch (releaseError) {
                    console.error('Error releasing connection in User.delete:', releaseError);
                }
            }
        }
    }
    static async deleteReport(req, res) {
     let connection;
        try {
            connection = await db.getConnection();
            const { reportId } = req.params;
            
            // Delete report and get the PDF URL
            const result = await StudentReport.deleteReport(reportId);
            
            if (result.success) {
                // Delete the PDF file
                const pdfPath = path.join(__dirname, '../..', result.pdf_url);
                if (fs.existsSync(pdfPath)) {
                    fs.unlinkSync(pdfPath);
                }
                
                res.json({
                    success: true,
                    message: 'Report deleted successfully'
                });
            } else {
                res.status(404).json({
                    success: false,
                    message: 'Report not found'
                });
            }
        } catch (error) {
            console.error('Error deleting report:', error);
            res.status(500).json({
                success: false,
                message: 'Error deleting report'
            });
        } finally {
            if (connection) {
                try {
                    connection.release();
                    console.log('Connection released in User.delete');
                } catch (releaseError) {
                    console.error('Error releasing connection in User.delete:', releaseError);
                }
            }
        }
    }
}

module.exports = StudentReportController;
