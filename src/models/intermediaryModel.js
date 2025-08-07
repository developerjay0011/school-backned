const db = require('../config/database');

class Intermediary {
    static async create(data) {
        const connection = await db.getConnection();
        try {
            // Convert empty strings to null
            const agent_email = data.agent_email || null;
            const agent_tel = data.agent_tel || null;
            const internal_external = data.internal_external || null;

            const [result] = await connection.execute(
                'INSERT INTO intermediaries (intermediary, agent_email, agent_tel,internal_external) VALUES (?, ?, ?,?)',
                [data.intermediary, agent_email, agent_tel, internal_external]
            );
            return result.insertId;
        } catch (error) {
            throw error;
        }finally {
            connection.release();
        }
    }

    static async getAll() {
        const connection = await db.getConnection();
        try {
            const [rows] = await connection.execute('SELECT * FROM intermediaries ORDER BY created_at DESC');
            return rows;
        } catch (error) {
            throw error;
        }finally {
            connection.release();
        }
    }

    static async getById(id) {
        const connection = await db.getConnection();
        try {
            const [rows] = await connection.execute('SELECT * FROM intermediaries WHERE id = ?', [id]);
            return rows[0];
        } catch (error) {
            throw error;
        }finally {
            connection.release();
        }
    }

    static async update(id, data) {
        const connection = await db.getConnection();
        try {
            // Convert empty strings to null
            const agent_email = data.agent_email || null;
            const agent_tel = data.agent_tel || null;
            const internal_external = data.internal_external || null;

            const [result] = await connection.execute(
                'UPDATE intermediaries SET intermediary = ?, agent_email = ?, agent_tel = ?,internal_external = ? WHERE id = ?',
                [data.intermediary, agent_email, agent_tel, internal_external, id]
            );
            return result.affectedRows > 0;
        } catch (error) {
            throw error;
        }finally {
            connection.release();
        }
    }

    static async delete(id) {
        const connection = await db.getConnection();
        try {
            const [result] = await connection.execute('DELETE FROM intermediaries WHERE id = ?', [id]);
            return result.affectedRows > 0;
        } catch (error) {
            throw error;
        }finally {
            connection.release();
        }
    }
}

module.exports = Intermediary;
