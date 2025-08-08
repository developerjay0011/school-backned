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
        const connection = await db.getConnection();

        try {
            const [rows] = await connection.execute(query, [student_id]);
            return rows.length > 0 ? rows[0].course_start_date : null;
        } catch (error) {
            console.error('Error getting earliest course start date:', error);
            throw error;
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

            const [result] = await connection.execute(query, [
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
        const connection = await db.getConnection();

        try {
            const [logs] = await connection.execute(query, [studentId]);
            return logs;
        } catch (error) {
            console.error('Error getting video logs:', error);
            throw error;
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

    static async getAll() {
        const query = `
            SELECT vl.*, s.first_name, s.last_name
            FROM video_logs vl
            JOIN students s ON vl.student_id = s.id
            ORDER BY vl.attend_date DESC
        `;
        const connection = await db.getConnection();

        try {
            const [logs] = await connection.execute(query);
            return logs;
        } catch (error) {
            console.error('Error getting all video logs:', error);
            throw error;
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
module.exports = VideoLog;