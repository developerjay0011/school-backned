const db = require('../config/database');

class Intermediary {
    static async create(data) {
        try {
            // Convert empty strings to null
            const agent_email = data.agent_email || null;
            const agent_tel = data.agent_tel || null;
            const internal_external = data.internal_external || null;

            const [result] = await db.execute(
                'INSERT INTO intermediaries (intermediary, agent_email, agent_tel,internal_external) VALUES (?, ?, ?,?)',
                [data.intermediary, agent_email, agent_tel, internal_external]
            );
            return result.insertId;
        } catch (error) {
            throw error;
        }
    }

    static async getAll() {
        try {
            const [rows] = await db.execute('SELECT * FROM intermediaries ORDER BY created_at DESC');
            return rows;
        } catch (error) {
            throw error;
        }
    }

    static async getById(id) {
        try {
            const [rows] = await db.execute('SELECT * FROM intermediaries WHERE id = ?', [id]);
            return rows[0];
        } catch (error) {
            throw error;
        }
    }

    static async update(id, data) {
        try {
            // Convert empty strings to null
            const agent_email = data.agent_email || null;
            const agent_tel = data.agent_tel || null;
            const internal_external = data.internal_external || null;

            const [result] = await db.execute(
                'UPDATE intermediaries SET intermediary = ?, agent_email = ?, agent_tel = ?,internal_external = ? WHERE id = ?',
                [data.intermediary, agent_email, agent_tel, internal_external, id]
            );
            return result.affectedRows > 0;
        } catch (error) {
            throw error;
        }
    }

    static async delete(id) {
        try {
            const [result] = await db.execute('DELETE FROM intermediaries WHERE id = ?', [id]);
            return result.affectedRows > 0;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = Intermediary;
