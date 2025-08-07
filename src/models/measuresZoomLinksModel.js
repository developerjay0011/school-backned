const db = require('../config/database');

class MeasuresZoomLinksModel {
    static async create(data) {
        const connection = await db.getConnection();
        try {
            const { measures_id, lecturer_id, zoom_link, start_date, end_date } = data;
            
            const [result] = await connection.execute(
                `INSERT INTO measures_zoom_links 
                (measures_id, lecturer_id, zoom_link, start_date, end_date) 
                VALUES (?, ?, ?, ?, ?)`,
                [measures_id, lecturer_id, zoom_link, start_date, end_date]
            );

            return result.insertId;
        } catch (error) {
            console.error('Error creating zoom link:', error);
            throw error;
        } finally {
            connection.release();
        }
    }

    static async update(id, data) {
        const connection = await db.getConnection();
        try {
            const { zoom_link, start_date, end_date } = data;
            
            const [result] = await connection.execute(
                `UPDATE measures_zoom_links 
                SET zoom_link = ?, start_date = ?, end_date = ?
                WHERE id = ? AND deleted_at IS NULL`,
                [zoom_link, start_date, end_date, id]
            );

            return result.affectedRows > 0;
        } catch (error) {
            console.error('Error updating zoom link:', error);
            throw error;
        } finally {
            connection.release();
        }
    }

    static async getByLecturerId(lecturerId) {
        const connection = await db.getConnection();
        try {
            const [rows] = await connection.execute(
                `SELECT mzl.*, m.measures_number, m.measures_title
                FROM measures_zoom_links mzl
                INNER JOIN measurements m ON m.id = mzl.measures_id
                WHERE mzl.lecturer_id = ? 
                AND mzl.deleted_at IS NULL
                ORDER BY mzl.start_date DESC`,
                [lecturerId]
            );

            return rows;
        } catch (error) {
            console.error('Error getting zoom links:', error);
            throw error;
        } finally {
            connection.release();
        }
    }

    static async delete(id, lecturerId) {
        const connection = await db.getConnection();
        try {
            const [result] = await connection.execute(
                `UPDATE measures_zoom_links 
                SET deleted_at = CURRENT_TIMESTAMP
                WHERE id = ? AND lecturer_id = ?`,
                [id, lecturerId]
            );

            return result.affectedRows > 0;
        } catch (error) {
            console.error('Error deleting zoom link:', error);
            throw error;
        } finally {
            connection.release();
        }
    }

    static async getByStudentDetails(studentId) {
        const connection = await db.getConnection();
        try {
            // First get student details
            const [studentRows] = await connection.execute(
                `SELECT 
                    s.student_id,
                    s.measures_id,
                    s.lecturer as lecturer_id,
                    s.date_of_entry,
                    s.date_of_exit
                FROM student s
                WHERE s.student_id = ?
                AND s.deleted_at IS NULL
                AND NOT EXISTS (
                    SELECT 1 FROM student_reports sr 
                    WHERE sr.student_id = s.student_id 
                    AND sr.report_type IN ('termination', 'discharge')
                )`,
                [studentId]
            );

            if (!studentRows || studentRows.length === 0) {
                return [];
            }

            const student = studentRows[0];

            // Then get zoom links based on student details
            const [rows] = await connection.execute(
                `SELECT mzl.*, 
                    m.measures_number, m.measures_title,
                    l.first_name as lecturer_first_name, 
                    l.last_name as lecturer_last_name,
                    l.photo as lecturer_photo
                FROM measures_zoom_links mzl
                INNER JOIN measurements m ON m.id = mzl.measures_id
                INNER JOIN lecturers l ON l.lecturer_id = mzl.lecturer_id
                WHERE mzl.measures_id = ?
                    AND mzl.lecturer_id = ?
                    AND mzl.deleted_at IS NULL
                    AND mzl.start_date = ?
                    AND mzl.end_date = ?
                ORDER BY mzl.start_date DESC`,
                [student.measures_id, student.lecturer_id, student.date_of_entry, student.date_of_exit]
            );
            rows.map((row) => {
                row.lecturer_photo= process.env.BACKEND_URL + row.lecturer_photo;
            });

            return rows;
        } catch (error) {
            console.error('Error getting zoom links for student:', error);
            throw error;
        } finally {
            connection.release();
        }
    }
}

module.exports = MeasuresZoomLinksModel;
