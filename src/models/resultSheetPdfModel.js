const db = require('../config/database');

class ResultSheetPdfModel {
    static async create(data) {
        try {
            const [result] = await db.query(
                'INSERT INTO result_sheet_pdf (student_id, description, pdf_url) VALUES (?, ?, ?)',
                [data.student_id, data.description || 'Ergebnisbogen / Bewerberprofil', data.pdf_url]
            );
            return result.insertId;
        } catch (error) {
            throw error;
        }
    }

    static async getByStudentId(studentId) {
        try {
            const [rows] = await db.query(
                'SELECT * FROM result_sheet_pdf WHERE student_id = ? ORDER BY created_at DESC',
                [studentId]
            );
            return rows;
        } catch (error) {
            throw error;
        }
    }

    static async delete(id) {
        try {
            const [result] = await db.query(
                'DELETE FROM result_sheet_pdf WHERE id = ?',
                [id]
            );
            return result.affectedRows > 0;
        } catch (error) {
            throw error;
        }
    }

    static async updateSentInfo(id, email) {
        try {
            const [result] = await db.query(
                'UPDATE result_sheet_pdf SET sent_to = ?, sent_on = NOW() WHERE id = ?',
                [email, id]
            );
            return result.affectedRows > 0;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = ResultSheetPdfModel;
