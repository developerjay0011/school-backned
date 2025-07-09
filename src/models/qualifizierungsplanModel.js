const db = require('../config/database');
const DateTimeUtils = require('../utils/dateTimeUtils');

class QualifizierungsplanModel {
    static async create(data) {
        try {
            const [result] = await db.query(
                `INSERT INTO qualifizierungsplan 
                (start_date, end_date, description, pdf_url, created_at) 
                VALUES (?, ?, ?, ?, ?)`,
                [data.start_date, data.end_date, data.description, data.pdf_url?.url,DateTimeUtils.formatToSQLDateTime(DateTimeUtils.getBerlinDateTime())]
            );
            return result.insertId;
        } catch (error) {
            throw error;
        }
    }

    static async getAll() {
        try {
            const [rows] = await db.query(
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
        }
    }

    static async getById(id) {
        try {
            const [rows] = await db.query(
                'SELECT * FROM qualifizierungsplan WHERE id = ?',
                [id]
            );
            return rows[0];
        } catch (error) {
            throw error;
        }
    }

    static async delete(id) {
        try {
            const [result] = await db.query(
                'DELETE FROM qualifizierungsplan WHERE id = ?',
                [id]
            );
            return result.affectedRows > 0;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = QualifizierungsplanModel;
