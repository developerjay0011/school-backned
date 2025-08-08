const db = require('../config/database');
const fs = require('fs').promises;
const path = require('path');

// Get backend URL from environment variable
const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3000';

// Helper function to format exam data with full URLs
const formatExamData = (exam) => {
    if (!exam) return null;
    return {
        ...exam,
        certificate_url: exam.certificate_url ? `${BACKEND_URL}/uploads/${exam.certificate_url}` : null
    };
};

class Exam {
    static async updateDoneOn(examId, done_on) {
     let connection;
        try {
            connection = await db.getConnection();
            await connection.beginTransaction();

            await connection.execute(
                'UPDATE student_exam_dates SET done_on = ? WHERE id = ?',
                [done_on, examId]
            );

            await connection.commit();
            return true;
        } catch (error) {
            await connection.rollback();
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
    static async updateCertificate(examId, certificateFile) {
     let connection;
        try {
            connection = await db.getConnection();
            await connection.beginTransaction();

            // First, get the existing certificate URL if any
            const [exam] = await connection.execute(
                'SELECT certificate_url FROM student_exam_dates WHERE id = ?',
                [examId]
            );

            if (exam.length === 0) {
                throw new Error('Exam not found');
            }

            // If there's an existing certificate, delete it
            if (exam[0].certificate_url) {
                const oldFilePath = path.join(__dirname, '../../uploads', exam[0].certificate_url);
                try {
                    await fs.unlink(oldFilePath);
                } catch (error) {
                    console.warn('Could not delete old certificate:', error.message);
                }
            }

            // Update the certificate URL in the database
            await connection.execute(
                'UPDATE student_exam_dates SET certificate_url = ? WHERE id = ?',
                [certificateFile.filename, examId]
            );

            await connection.commit();
            return true;
        } catch (error) {
            await connection.rollback();
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

    static async updateExamResult(examId, exam_result) {
     let connection;
        try {
            connection = await db.getConnection();
            await connection.beginTransaction();

            await connection.execute(
                'UPDATE student_exam_dates SET exam_result = ? WHERE id = ?',
                [exam_result, examId]
            );

            await connection.commit();
            return true;
        } catch (error) {
            await connection.rollback();
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
    static async updateRemark(examId, remark) {
        // Validate parameters
        if (!examId || isNaN(parseInt(examId, 10))) {
            throw new Error('Invalid exam ID');
        }
        if (!remark || typeof remark !== 'string') {
            throw new Error('Invalid remark');
        }

        let connection;
        try {
            connection = await db.getConnection();
            await connection.beginTransaction();

            // Update exam remark
            const [result] = await connection.execute(
                `UPDATE student_exam_dates 
                SET remark = ?
                WHERE id = ?`,
                [remark, parseInt(examId, 10)]
            );

            await connection.commit();
            return result.affectedRows > 0;
        } catch (error) {
            if (connection) {
                try {
                    await connection.rollback();
                } catch (rollbackError) {
                    console.error('Error rolling back:', rollbackError);
                }
            }
            throw error;
        } finally {
            if (connection) {
                try {
                    connection.release();
                } catch (releaseError) {
                    console.error('Error releasing connection:', releaseError);
                }
            }
        }
    }

    static async create(studentId, examData) {
     let connection;
        try {
            connection = await db.getConnection();
            await connection.beginTransaction();

            // Insert exam date
            const [result] = await connection.execute(
                `INSERT INTO student_exam_dates (
                    student_id, exam_from, exam_to, exam_type,
                    exam_result
                ) VALUES (?, ?, ?, ?, ?)`,
                [
                    studentId,
                    examData.exam_from,
                    examData.exam_to,
                    examData.exam_type,
                    examData.exam_result || null
                ]
            );

            await connection.commit();
            return result.insertId;
        } catch (error) {
            await connection.rollback();
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

    static async update(examId, examData) {
     let connection;
        try {
            connection = await db.getConnection();
            await connection.beginTransaction();

            const updateFields = [];
            const updateValues = [];

            Object.entries(examData).forEach(([key, value]) => {
                if (value !== undefined) {
                    updateFields.push(`${key} = ?`);
                    updateValues.push(value);
                }
            });

            if (updateFields.length > 0) {
                await connection.execute(
                    `UPDATE student_exam_dates SET ${updateFields.join(', ')} WHERE id = ?`,
                    [...updateValues, examId]
                );
            }

            await connection.commit();
            return true;
        } catch (error) {
            await connection.rollback();
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

    static async delete(examId) {
     let connection;
        try {
            connection = await db.getConnection();
            await connection.beginTransaction();

            await connection.execute(
                'DELETE FROM student_exam_dates WHERE id = ?',
                [examId]
            );

            await connection.commit();
            return true;
        } catch (error) {
            await connection.rollback();
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

    static async getByStudent(studentId) {
     let connection;
        try {
            connection = await db.getConnection();
            const [rows] = await connection.execute(
                'SELECT * FROM student_exam_dates WHERE student_id = ? ORDER BY created_at DESC',
                [studentId]
            );
            return rows.map(formatExamData);
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

    static async getById(examId) {
     let connection;
        try {
            connection = await db.getConnection();
            const [rows] = await connection.execute(
                `SELECT 
                    e.*,
                    a.bg_number,
                    a.email as authority_email,
                    m.measures_number,
                    m.measures_title
                FROM student_exam_dates e
                JOIN student s ON e.student_id = s.student_id
                JOIN measurements m ON s.measures_id = m.id
                JOIN authorities a ON e.student_id = a.student_id
                WHERE e.id = ?`,
                [examId]
            );
            return formatExamData(rows[0]);
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

module.exports = Exam;
