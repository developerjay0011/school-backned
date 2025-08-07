const db = require('../config/database');

class MonthlyReportModel {
    static async create(data) {
        const connection = await db.getConnection();
        try {
            console.log('Creating monthly report:', data);
            const [result] = await connection.execute(
                `INSERT INTO monthly_reports (
                    lecturer_id,
                    description,
                    pdf_url,
                    month,
                    year
                ) VALUES (?, ?, ?, ?, ?)`,
                [
                    data.lecturer_id,
                    data.description,
                    data.pdf_url,
                    data.month,
                    data.year
                ]
            );
            console.log('Created monthly report with id:', result.insertId);
            return result.insertId;
        } catch (error) {
            console.error('Error in create:', error);
            throw error;
        } finally {
            connection.release();
        }
    }

    static async getAll(lecturer_id) {
        const connection = await db.getConnection();
        try {
            console.log('Getting all monthly reports for lecturer_id:', lecturer_id);
            const [rows] = await connection.execute(
                'SELECT * FROM monthly_reports WHERE lecturer_id = ? ORDER BY created_at DESC',
                [lecturer_id]
            );
            console.log('Found reports:', rows);
            return rows;
        } catch (error) {
            console.error('Error in getAll:', error);
            throw error;
        } finally {
            connection.release();
        }
    }

    static async getAllGroupedByLecturer() {
        const connection = await db.getConnection();
        try {
            const [rows] = await connection.execute(`
                SELECT 
                    mr.*,
                    l.first_name,
                    l.last_name
                FROM monthly_reports mr
                JOIN lecturers l ON mr.lecturer_id = l.lecturer_id
                ORDER BY l.last_name, l.first_name, mr.year DESC, mr.month DESC
            `);

            // Group reports by lecturer
            const groupedReports = rows.reduce((acc, report) => {
                const lecturerId = report.lecturer_id;
                if (!acc[lecturerId]) {
                    acc[lecturerId] = {
                        lecturer: {
                            id: lecturerId,
                            first_name: report.first_name,
                            last_name: report.last_name
                        },
                        reports: []
                    };
                }
                // Remove lecturer fields from report object
                const { first_name, last_name, ...reportData } = report;
                acc[lecturerId].reports.push(reportData);
                return acc;
            }, {});

            // Convert to array and sort by lecturer name
            return Object.values(groupedReports);
        } catch (error) {
            console.error('Error in getAllGroupedByLecturer:', error);
            throw error;
        } finally {
            connection.release();
        }
    }

    static async delete(id, lecturer_id) {
        const connection = await db.getConnection();
        try {
            console.log('Deleting monthly report:', id, 'for lecturer:', lecturer_id);
            const [result] = await connection.execute(
                'DELETE FROM monthly_reports WHERE id = ? AND lecturer_id = ?',
                [id, lecturer_id]
            );
            return result.affectedRows > 0;
        } catch (error) {
            console.error('Error in delete:', error);
            throw error;
        } finally {
            connection.release();
        }
    }
}

module.exports = MonthlyReportModel;
