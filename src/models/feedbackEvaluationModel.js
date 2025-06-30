const db = require('../config/database');

class FeedbackEvaluationModel {
    static async create(data) {
        try {
            const [result] = await db.query(
                `INSERT INTO feedback_evaluations 
                (date_from, date_until, measures_id, pdf_url, description, created_at) 
                VALUES (?, ?, ?, ?, ?, NOW())`,
                [data.dateFrom, data.dateUntil, data.measures_id, data.pdfUrl, data.description || null]
            );
            return result.insertId;
        } catch (error) {
            throw error;
        }
    }

    static async getAll() {
        try {
            const [rows] = await db.query(
                `SELECT fe.*, m.measures_number, m.measures_title 
                FROM feedback_evaluations fe 
                JOIN measurements m ON fe.measures_id = m.id 
                ORDER BY fe.created_at DESC`
            );
            return rows;
        } catch (error) {
            throw error;
        }
    }

    static async getById(id) {
        try {
            const [rows] = await db.query(
                `SELECT fe.*, m.measures_number, m.measures_title 
                FROM feedback_evaluations fe 
                JOIN measurements m ON fe.measures_id = m.id 
                WHERE fe.id = ?`,
                [id]
            );
            return rows[0];
        } catch (error) {
            throw error;
        }
    }

    static async deleteById(id) {
        try {
            const [result] = await db.query(
                'DELETE FROM feedback_evaluations WHERE id = ?',
                [id]
            );
            return result.affectedRows > 0;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = FeedbackEvaluationModel;
