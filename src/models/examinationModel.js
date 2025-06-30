const db = require('../config/database');

class Examination {
    static async create(data) {
        try {
            const [result] = await db.execute(
                'INSERT INTO examinations (examination) VALUES (?)',
                [data.examination]
            );
            return result.insertId;
        } catch (error) {
            throw error;
        }
    }

    static async getAll() {
        try {
            const [rows] = await db.execute('SELECT * FROM examinations ORDER BY created_at DESC');
            return rows;
        } catch (error) {
            throw error;
        }
    }

    static async getById(id) {
        try {
            const [rows] = await db.execute('SELECT * FROM examinations WHERE id = ?', [id]);
            return rows[0];
        } catch (error) {
            throw error;
        }
    }

    static async update(id, data) {
        try {
            const [result] = await db.execute(
                'UPDATE examinations SET examination = ? WHERE id = ?',
                [data.examination, id]
            );
            return result.affectedRows > 0;
        } catch (error) {
            throw error;
        }
    }

    static async delete(id) {
        try {
            const [result] = await db.execute('DELETE FROM examinations WHERE id = ?', [id]);
            return result.affectedRows > 0;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = Examination;
