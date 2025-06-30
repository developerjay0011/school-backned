const db = require('../config/database');

class CertificateOfAbsence {
    static async getByStudentId(studentId) {
        const query = `
            SELECT *
            FROM certificate_of_absence
            WHERE student_id = ?
            ORDER BY created_at DESC
        `;

        try {
            const [results] = await db.query(query, [studentId]);
            return results.map(row => ({
                id: row.id,
                date: row.date,
                description: row.description,
                sent_to: row.sent_to,
                pdf_url: row.pdf_url,
                created_at: row.created_at
            }));
        } catch (error) {
            console.error('Error fetching certificates by student ID:', error);
            throw error;
        }
    }
    static async delete(id) {
        const query = 'DELETE FROM certificate_of_absence WHERE id = ?';
        
        try {
            const [result] = await db.execute(query, [id]);
            return result.affectedRows > 0;
        } catch (error) {
            console.error('Error deleting certificate:', error);
            throw error;
        }
    }
    static async getAll() {
        const query = `
            SELECT *
            FROM certificate_of_absence
            ORDER BY created_at DESC
        `;

        try {
            const [results] = await db.query(query);
            return results.map(row => ({
                id: row.id,
                date: row.date,
                description: row.description,
                sent_to: row.sent_to,
                pdf_url: row.pdf_url,
                created_at: row.created_at
            }));
        } catch (error) {
            console.error('Error fetching certificates:', error);
            throw error;
        }
    }

    static async create(data) {
        const { date, description, sent_to, pdf_url, student_id } = data;
        
        const query = `
            INSERT INTO certificate_of_absence (date, description, sent_to, pdf_url, student_id)
            VALUES (?, ?, ?, ?, ?)
        `;
        
        try {
            const [result] = await db.execute(query, [date, description, sent_to, pdf_url, student_id]);
            return result.insertId;
        } catch (error) {
            console.error('Error creating certificate record:', error);
            throw error;
        }
    }
}

module.exports = CertificateOfAbsence;
