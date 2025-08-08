const db = require('../config/database');
const DateTimeUtils = require('../utils/dateTimeUtils');

class QualifizierungsplanModel {
    static async create(data) {
     let connection;
        try {
            connection = await db.getConnection();
            const [result] = await connection.query(
                `INSERT INTO qualifizierungsplan 
                (start_date, end_date, description, pdf_url, created_at) 
                VALUES (?, ?, ?, ?, ?)`,
                [data.start_date, data.end_date, data.description, data.pdf_url?.url,DateTimeUtils.formatToSQLDateTime(DateTimeUtils.getBerlinDateTime())]
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
                `SELECT 
                    id,
                    start_date,
                    end_date,
                    description,
                    pdf_url,
                    created_at
                FROM qualifizierungsplan 
                ORDER BY created_at DESC`
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
                'SELECT * FROM qualifizierungsplan WHERE id = ?',
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

    static async delete(id) {
     let connection;
        try {
            connection = await db.getConnection();
            const [result] = await connection.query(
                'DELETE FROM qualifizierungsplan WHERE id = ?',
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

module.exports = QualifizierungsplanModel;
