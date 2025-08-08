const db = require('../config/database');
const DateTimeUtils = require('../utils/dateTimeUtils');

class ResultSheetPdfModel {
    static async create(data) {
     let connection;
        try {
            connection = await db.getConnection();
            const [result] = await connection.query(
                'INSERT INTO result_sheet_pdf (student_id, description, pdf_url) VALUES (?, ?, ?)',
                [data.student_id, data.description || 'Ergebnisbogen / Bewerberprofil', data.pdf_url]
            );
            return result.insertId;
        } catch (error) {
            throw error;
        }finally {
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

    static async getByStudentId(studentId) {
     let connection;
        try {
            connection = await db.getConnection();
            const [rows] = await connection.query(
                'SELECT * FROM result_sheet_pdf WHERE student_id = ? ORDER BY created_at DESC',
                [studentId]
            );
            return rows;
        } catch (error) {
            throw error;
        }finally {
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

    static async delete(id) {
     let connection;
        try {
            connection = await db.getConnection();
            const [result] = await connection.query(
                'DELETE FROM result_sheet_pdf WHERE id = ?',
                [id]
            );
            return result.affectedRows > 0;
        } catch (error) {
            throw error;
        }finally {
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

    static async updateSentInfo(id, email) {
     let connection;
        try {
            connection = await db.getConnection();
            const [result] = await connection.query(
                'UPDATE result_sheet_pdf SET sent_to = ?, sent_on = ? WHERE id = ?',
                [email,DateTimeUtils.formatToSQLDateTime(DateTimeUtils.getBerlinDateTime()), id]
            );
            return result.affectedRows > 0;
        } catch (error) {
            throw error;
        }finally {
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

module.exports = ResultSheetPdfModel;
