const db = require('../config/database');
const DateTimeUtils = require('../utils/dateTimeUtils');

class FeedbackEvaluationModel {
    static async create(data) {
     let connection;
        try {
            connection = await db.getConnection();
            const [result] = await connection.query(
                `INSERT INTO feedback_evaluations 
                (date_from, date_until, measures_id, pdf_url, description, created_at) 
                VALUES (?, ?, ?, ?, ?, ?)`,
                [data.dateFrom, data.dateUntil, data.measures_id, data.pdfUrl, data.description || null,DateTimeUtils.formatToSQLDateTime(DateTimeUtils.getBerlinDateTime())]
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

    static async getAll() {
     let connection;
        try {
            connection = await db.getConnection();
            const [rows] = await connection.query(
                `SELECT fe.*, m.measures_number, m.measures_title 
                FROM feedback_evaluations fe 
                JOIN measurements m ON fe.measures_id = m.id 
                ORDER BY fe.created_at DESC`
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

    static async getById(id) {
     let connection;
        try {
            connection = await db.getConnection();
            const [rows] = await connection.query(
                `SELECT fe.*, m.measures_number, m.measures_title 
                FROM feedback_evaluations fe 
                JOIN measurements m ON fe.measures_id = m.id 
                WHERE fe.id = ?`,
                [id]
            );
            return rows[0];
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

    static async deleteById(id) {
     let connection;
        try {
            connection = await db.getConnection();
            const [result] = await connection.query(
                'DELETE FROM feedback_evaluations WHERE id = ?',
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
}

module.exports = FeedbackEvaluationModel;
