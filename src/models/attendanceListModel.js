const db = require('../config/database');

class AttendanceList {
    static async create(data) {
        const { datetime, start_date, end_date, pdf_url, student_id } = data;
        
        const query = `
            INSERT INTO attendance_list (datetime, start_date, end_date, pdf_url, student_id)
            VALUES (?, ?, ?, ?, ?)
        `;
        
        const connection = await db.getConnection();
        try {
            const [result] = await connection.execute(query, [datetime, start_date, end_date, pdf_url, student_id]);
            return result.insertId;
        } catch (error) {
            console.error('Error creating attendance list record:', error);
            throw error;
        } finally {
            connection.release();
        }
    }

    static async getByStudentId(studentId) {
        const query = `
            SELECT al.*, s.first_name, s.last_name
            FROM attendance_list al
            JOIN student s ON al.student_id = s.student_id
            WHERE al.student_id = ?
            ORDER BY al.datetime DESC
        `;

        const connection = await db.getConnection();
        try {
            const [results] = await connection.execute(query, [studentId]);
            return results.map(row => ({
                id: row.id,
                datetime: row.datetime,
                start_date: row.start_date,
                end_date: row.end_date,
                pdf_url: row.pdf_url,
                student: {
                    id: row.student_id,
                    first_name: row.first_name,
                    last_name: row.last_name
                },
                created_at: row.created_at
            }));
        } catch (error) {
            console.error('Error fetching attendance lists by student ID:', error);
            throw error;
        } finally {
            connection.release();
        }
    }

    static async getAll() {
        const query = `
            SELECT *
            FROM attendance_list
            ORDER BY datetime DESC
        `;

        const connection = await db.getConnection();
        try {
            const [results] = await connection.execute(query);
            return results;
        } catch (error) {
            console.error('Error fetching attendance lists:', error);
            throw error;
        } finally {
            connection.release();
        }
    }

    static async getByStudentAndDateRange(studentId, startDate, endDate) {
        const query = `
            SELECT a.*, s.first_name, s.last_name, s.bg_number, s.authority_email,
                   m.title as measures_title, m.number as measures_number
            FROM attendance a
            JOIN student s ON a.student_id = s.student_id
            LEFT JOIN measures m ON s.measures_id = m.id
            WHERE a.student_id = ?
            AND a.date BETWEEN ? AND ?
            ORDER BY a.date ASC
        `;

        const connection = await db.getConnection();
        try {
            const [results] = await connection.execute(query, [studentId, startDate, endDate]);
            return results.map(row => ({
                id: row.id,
                date: row.date,
                status: row.status,
                student: {
                    id: row.student_id,
                    first_name: row.first_name,
                    last_name: row.last_name,
                    bg_number: row.bg_number,
                    authority_email: row.authority_email,
                    measures_title: row.measures_title,
                    measures_number: row.measures_number
                }
            }));
        } catch (error) {
            console.error('Error fetching attendance by student and date range:', error);
            throw error;
        } finally {
            connection.release();
        }
    }
}

module.exports = AttendanceList;
