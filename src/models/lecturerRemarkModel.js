const db = require('../config/database');

class LecturerRemarkModel {
    static async addRemark(studentId, lecturerId, remark) {
        const connection = await db.getConnection();
        try {
            await connection.beginTransaction();
            
            // First verify if the student belongs to this lecturer
            const [student] = await connection.execute(`
                SELECT student_id 
                FROM student s
                WHERE s.student_id = ?
                    AND s.lecturer = ?
                    AND s.deleted_at IS NULL
            `, [studentId, lecturerId]);

            if (!student.length) {
                throw new Error('Student not found or not assigned to this lecturer');
            }

            // Update the remark
            const [result] = await connection.execute(`
                UPDATE student 
                SET lecturer_remark = ?,
                    remark_updated_at = CURRENT_TIMESTAMP
                WHERE student_id = ?
            `, [remark, studentId]);
            
            await connection.commit();
            return result.affectedRows > 0;
        } catch (error) {
            await connection.rollback();
            console.error('Error adding remark:', error);
            throw error;
        } finally {
            connection.release();
        }
    }

    static async getRemark(studentId, lecturerId) {
        const connection = await db.getConnection();
        try {
            const [rows] = await connection.execute(`
                SELECT 
                    s.student_id,
                    s.first_name,
                    s.last_name,
                    s.lecturer_remark,
                    s.remark_updated_at,
                    m.measures_number,
                    m.measures_title
                FROM student s
                INNER JOIN measurements m ON m.id = s.measures_id
                WHERE s.student_id = ?
                    AND s.lecturer = ?
                    AND s.deleted_at IS NULL
            `, [studentId, lecturerId]);

            return rows[0] || null;
        } catch (error) {
            console.error('Error getting remark:', error);
            throw error;
        } finally {
            connection.release();
        }
    }

    static async getRemarksByLecturer(lecturerId) {
        const connection = await db.getConnection();
        try {
            const [rows] = await connection.execute(`
                SELECT 
                    s.student_id,
                    s.first_name,
                    s.last_name,
                    s.lecturer_remark,
                    s.remark_updated_at,
                    m.measures_number,
                    m.measures_title
                FROM student s
                INNER JOIN measurements m ON m.id = s.measures_id
                WHERE s.lecturer = ?
                    AND s.deleted_at IS NULL
                ORDER BY s.first_name, s.last_name
            `, [lecturerId]);

            return rows;
        } catch (error) {
            console.error('Error getting remarks:', error);
            throw error;
        } finally {
            connection.release();
        }
    }
}

module.exports = LecturerRemarkModel;
