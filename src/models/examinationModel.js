const db = require('../config/database');

class Examination {
    static async create(data) {
        const connection = await db.getConnection();
        try {
            const [result] = await connection.execute(
                'INSERT INTO examinations (examination) VALUES (?)',
                [data.examination]
            );
            return result.insertId;
        } catch (error) {
            throw error;
        } finally {
            connection.release();
        }
    }

    static async getAll() {
        const connection = await db.getConnection();
        try {
            const [rows] = await connection.execute('SELECT * FROM examinations ORDER BY created_at DESC');
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
            const [rows] = await connection.execute('SELECT * FROM examinations WHERE id = ?', [id]);
            return rows[0];
        } catch (error) {
            throw error;
        } finally {
            connection.release();
        }
    }

    static async update(id, data) {
        const connection = await db.getConnection();
        try {
            const [result] = await connection.execute(
                'UPDATE examinations SET examination = ? WHERE id = ?',
                [data.examination, id]
            );
            return result.affectedRows > 0;
        } catch (error) {
            throw error;
        } finally {
            connection.release();
        }
    }

    static async delete(id) {
        const connection = await db.getConnection();
        try {
            const [result] = await connection.execute('DELETE FROM examinations WHERE id = ?', [id]);
            return result.affectedRows > 0;
        } catch (error) {
            throw error;
        } finally {
            connection.release();
        }
    }
}

module.exports = Examination;
