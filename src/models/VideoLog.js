const db = require('../config/database');

class VideoLog {
    static async getEarliestCourseStartDate(student_id) {
        const query = `
            SELECT course_start_date
            FROM video_logs
            WHERE student_id = ?
            ORDER BY course_start_date ASC
            LIMIT 1
        `;

        try {
            const [rows] = await db.execute(query, [student_id]);
            return rows.length > 0 ? rows[0].course_start_date : null;
        } catch (error) {
            console.error('Error getting earliest course start date:', error);
            throw error;
        }
    }

    static async create({ student_id, topic_title, course_start_date, attend_date }) {
        try {
            // Get earliest course start date for this student
            const earliestDate = await this.getEarliestCourseStartDate(student_id);
            
            // Use earliest date if it exists, otherwise use provided date
            const finalStartDate = earliestDate || course_start_date;

            const query = `
                INSERT INTO video_logs (student_id, topic_title, course_start_date, attend_date)
                VALUES (?, ?, ?, ?)
            `;

            const [result] = await db.execute(query, [
                student_id,
                topic_title,
                finalStartDate,
                attend_date
            ]);
            return result.insertId;
        } catch (error) {
            console.error('Error creating video log:', error);
            throw error;
        }
    }

    static async getByStudentId(studentId) {
        const query = `
            SELECT * FROM video_logs
            WHERE student_id = ?
            ORDER BY attend_date DESC
        `;

        try {
            const [logs] = await db.execute(query, [studentId]);
            return logs;
        } catch (error) {
            console.error('Error getting video logs:', error);
            throw error;
        }
    }

    static async getAll() {
        const query = `
            SELECT vl.*, s.first_name, s.last_name
            FROM video_logs vl
            JOIN students s ON vl.student_id = s.id
            ORDER BY vl.attend_date DESC
        `;

        try {
            const [logs] = await db.execute(query);
            return logs;
        } catch (error) {
            console.error('Error getting all video logs:', error);
            throw error;
        }
    }
}
module.exports = VideoLog;