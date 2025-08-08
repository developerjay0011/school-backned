const db = require('../config/database');

class Paragraph {
    static async getAll() {
        let connection;
        try {
            connection = await db.getConnection();
            const [rows] = await connection.execute(
                'SELECT * FROM according_to_paragraph ORDER BY created_at DESC'
            );
            return rows;
        } catch (error) {
            console.error('Error getting according to paragraph options:', error);
            throw error;
        } finally {
            if (connection) {
                try {
                    connection.release();
                    console.log('Connection released in Paragraph.getAll');
                } catch (releaseError) {
                    console.error('Error releasing connection in Paragraph.getAll:', releaseError);
                }
            }
        }
    }

    static async getById(id) {
        let connection;
        try {
            connection = await db.getConnection();
            const [rows] = await connection.execute(
                'SELECT * FROM according_to_paragraph WHERE id = ?',
                [id]
            );
            return rows[0];
        } catch (error) {
            console.error('Error getting according to paragraph by ID:', error);
            throw error;
        } finally {
            if (connection) {
                try {
                    connection.release();
                    console.log('Connection released in Paragraph.getById');
                } catch (releaseError) {
                    console.error('Error releasing connection in Paragraph.getById:', releaseError);
                }
            }
        }
    }
}

module.exports = Paragraph;
