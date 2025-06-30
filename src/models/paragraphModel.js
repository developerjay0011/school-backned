const db = require('../config/database');

class Paragraph {
    static async getAll() {
        try {
            const [rows] = await db.execute(
                'SELECT * FROM according_to_paragraph ORDER BY created_at DESC'
            );
            return rows;
        } catch (error) {
            throw error;
        }
    }

    static async getById(id) {
        try {
            const [rows] = await db.execute(
                'SELECT * FROM according_to_paragraph WHERE id = ?',
                [id]
            );
            return rows[0];
        } catch (error) {
            throw error;
        }
    }
}

module.exports = Paragraph;
