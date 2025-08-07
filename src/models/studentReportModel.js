const db = require('../config/database');

class StudentReport {
    static async createDischargeReport(studentId, reportData, pdfUrl) {
        const connection = await db.getConnection();
        try {
            console.log('Creating discharge report with:', { studentId, reportData, pdfUrl });
            
            // Validate required parameters
            if (!studentId || !reportData || !pdfUrl) {
                throw new Error('Missing required parameters');
            }

            const [result] = await connection.execute(
                `INSERT INTO student_reports (
                    student_id,
                    report_type,
                    first_day_attendance,
                    last_day_attendance,
                    early_exam_success,
                    exam_not_passed,
                    pdf_url,
                    employment_date,
                    reasons,
                    authority_email
                ) VALUES (?, 'discharge', ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    studentId,
                    reportData.first_day_attendance,
                    reportData.last_day_attendance,
                    reportData.early_exam_success || false,
                    reportData.exam_not_passed || false,
                    pdfUrl, // This should now always be defined
                    reportData.employment_date || null,
                    reportData.reasons || null,
                    reportData.authority_email || null
                ]
            );
            console.log('Report created with ID:', result.insertId);
            return result.insertId;
        } catch (error) {
            console.error('Error creating discharge report:', error);
            throw error;
        } finally {
            connection.release();
        }
    }

    static async createTerminationReport(studentId, reportData, pdfUrl) {
        const connection = await db.getConnection();
        try {
            console.log('Creating termination report with:', { studentId, reportData, pdfUrl });
            
            // Validate required parameters
            if (!studentId || !reportData || !pdfUrl) {
                throw new Error('Missing required parameters');
            }

            const [result] = await connection.execute(
                `INSERT INTO student_reports (
                    student_id,
                    report_type,
                    first_day_attendance,
                    last_day_attendance,
                    is_employment,
                    insufficient_performance,
                    longer_periods_absence,
                    other_reasons,
                    pdf_url,
                    employment_date,
                    reasons,
                    authority_email
                ) VALUES (?, 'termination', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    studentId,
                    reportData.first_day_attendance,
                    reportData.last_day_attendance,
                    reportData.is_employment || false,
                    reportData.insufficient_performance || false,
                    reportData.longer_periods_absence || false,
                    reportData.other_reasons || false,
                    pdfUrl, // This should now always be defined
                    reportData.employment_date || null,
                    reportData.reasons || null,
                    reportData.authority_email || null
                ]
            );
            console.log('Report created with ID:', result.insertId);
            return result.insertId;
        } catch (error) {
            throw error;
        } finally {
            connection.release();
        }
    }

    static async getStudentReports(studentId) {
        const connection = await db.getConnection();
        try {
            const [rows] = await connection.execute(
                `SELECT 
                    sr.*,
                    s.student_id,
                    s.first_name,
                    s.last_name
                FROM student_reports sr
                JOIN student s ON sr.student_id = s.student_id
                WHERE sr.student_id = ? 
                ORDER BY sr.created_at DESC`,
                [studentId]
            );
            return rows;
        } catch (error) {
            throw error;
        } finally {
            connection.release();
        }
    }

    static async getReportById(reportId) {
        const connection = await db.getConnection();
        try {
            const [rows] = await connection.execute(
                'SELECT * FROM student_reports WHERE id = ?',
                [reportId]
            );
            return rows[0];
        } catch (error) {
            throw error;
        } finally {
            connection.release();
        }
    }

    static async getById(reportId) {
        const connection = await db.getConnection();
        try {
            const [rows] = await connection.execute(
                'SELECT * FROM student_reports WHERE id = ?',
                [reportId]
            );
            console.log('Retrieved report:', rows[0]);
            return rows[0];
        } catch (error) {
            console.error('Error getting report:', error);
            throw error;
        } finally {
            connection.release();
        }
    }
    static async deleteReport(reportId) {
        const connection = await db.getConnection();
        try {
            // First get the report to check if it exists and get the pdf_url
            const [reports] = await connection.execute(
                'SELECT * FROM student_reports WHERE id = ?',
                [reportId]
            );

            if (!reports || reports.length === 0) {
                throw new Error('Report not found');
            }

            // Delete the report from database
            const [result] = await connection.execute(
                'DELETE FROM student_reports WHERE id = ?',
                [reportId]
            );

            return {
                success: result.affectedRows > 0,
                pdf_url: reports[0].pdf_url
            };
        } catch (error) {
            console.error('Error deleting report:', error);
            throw error;
        } finally {
            connection.release();
        }
    }
}

module.exports = StudentReport;
