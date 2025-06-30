const db = require('../config/database');

class AttendanceList {
    static async create(data) {
        const { datetime, start_date, end_date, pdf_url, student_id } = data;
        
        const query = `
            INSERT INTO attendance_list (datetime, start_date, end_date, pdf_url, student_id)
            VALUES (?, ?, ?, ?, ?)
        `;
        
        try {
            const [result] = await db.execute(query, [datetime, start_date, end_date, pdf_url, student_id]);
            return result.insertId;
        } catch (error) {
            console.error('Error creating attendance list record:', error);
            throw error;
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

        try {
            const [results] = await db.query(query, [studentId]);
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
        }
    }

    static async getAll() {
        const query = `
            SELECT *
            FROM attendance_list
            ORDER BY datetime DESC
        `;

        try {
            const [results] = await db.query(query);
            return results;
        } catch (error) {
            console.error('Error fetching attendance lists:', error);
            throw error;
        }
    }
}

module.exports = AttendanceList;
