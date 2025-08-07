const db = require('../config/database');

class CourseFeedback {
    static async create(data) {
        const conn = await db.getConnection();
        
        try {
            await conn.beginTransaction();

            // Insert the main feedback record
            const [result] = await conn.execute(
                `INSERT INTO course_feedback (
                    student_id, 
                    course_id, 
                    feedback_date, 
                    responses,
                    remarks
                ) VALUES (?, ?, ?, ?, ?)`,
                [
                    data.student_id,
                    data.course_id,
                    data.date,
                    JSON.stringify(data.responses),
                    data.remarks || null
                ]
            );

            await conn.commit();
            return result.insertId;
        } catch (error) {
            await conn.rollback();
            throw error;
        } finally {
            conn.release();
        }
    }

    static async update(data, studentId) {
        const conn = await db.getConnection();
        
        try {
            await conn.beginTransaction();

            // First, get the latest feedback for the student
            const [rows] = await conn.execute(
                'SELECT * FROM course_feedback WHERE student_id = ? ORDER BY feedback_date DESC LIMIT 1',
                [studentId]
            );

            if (rows.length === 0) {
                return null;
            }

            // Merge existing responses with updates
            const existingResponses = JSON.parse(rows[0].responses);
            const updatedResponses = { ...existingResponses, ...data.responses };

            // Build update query
            const updateFields = [];
            const values = [];

            if (data.course_id !== undefined) {
                updateFields.push('course_id = ?');
                values.push(data.course_id);
            }

            if (data.date !== undefined) {
                updateFields.push('feedback_date = ?');
                values.push(data.date);
            }

            if (data.responses !== undefined) {
                updateFields.push('responses = ?');
                values.push(JSON.stringify(updatedResponses));
            }

            if (data.remarks !== undefined) {
                updateFields.push('remarks = ?');
                values.push(data.remarks);
            }

            if (updateFields.length === 0) return rows[0];

            values.push(rows[0].id); // Use the ID from the latest feedback
            values.push(studentId);

            const [result] = await conn.execute(
                `UPDATE course_feedback SET ${updateFields.join(', ')} 
                WHERE id = ? AND student_id = ?`,
                values
            );

            await conn.commit();

            if (result.affectedRows === 0) {
                return null;
            }

            return this.getByStudentId(studentId);
        } catch (error) {
            await conn.rollback();
            throw error;
        } finally {
            conn.release();
        }
    }

    static async getByStudentId(studentId) {
        const connection = await db.getConnection();
        try {
            const [rows] = await connection.execute(
                'SELECT * FROM course_feedback WHERE student_id = ? ORDER BY feedback_date DESC LIMIT 1',
                [studentId]
            );
            
            if (rows.length === 0) return null;

            return {
                ...rows[0],
                responses: JSON.parse(rows[0].responses)
            };
        } catch (error) {
            throw error;
        } finally {
            connection.release();
        }
    }

    static async getByCourseId(courseId) {
        const connection = await db.getConnection();
        try {
            const [rows] = await connection.execute(
                'SELECT * FROM course_feedback WHERE course_id = ? ORDER BY feedback_date DESC',
                [courseId]
            );
            
            // Parse the JSON responses for each feedback
            return rows.map(row => ({
                ...row,
                responses: JSON.parse(row.responses)
            }));
        } catch (error) {
            throw error;
        } finally {
            connection.release();
        }
    }

    static async getById(id) {
        const connection = await db.getConnection();
        try {
            const [rows] = await connection.execute(
                'SELECT * FROM course_feedback WHERE id = ?',
                [id]
            );
            
            if (rows.length === 0) return null;
            
            // Parse the JSON responses
            const feedback = rows[0];
            feedback.responses = JSON.parse(feedback.responses);
            return feedback;
        } catch (error) {
            throw error;
        } finally {
            connection.release();
        }
    }
}

module.exports = CourseFeedback;
