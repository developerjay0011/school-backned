const db = require('../config/database');

class Paragraph {
    static async getAll() {
        const connection = await db.getConnection();

        try {
            const [rows] = await connection.execute(
                'SELECT * FROM according_to_paragraph ORDER BY created_at DESC'
            );
            connection.release();
            return rows;
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
                'SELECT * FROM according_to_paragraph WHERE id = ?',
                [id]
            );
            connection.release();
            return rows[0];
        } catch (error) {
            throw error;
        } finally {
            connection.release();
        }
    }
}

module.exports = Paragraph;
