const db = require('../config/database');

class Intermediary {
    static async create(data) {
        let connection;
        try {
            connection = await db.getConnection();
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
            if (connection) {
                try {
                    connection.release();
                    console.log('Connection released in Intermediary.create');
                } catch (releaseError) {
                    console.error('Error releasing connection in Intermediary.create:', releaseError);
                }
            }
        }
    }

    static async getAll() {
     let connection;
        try {
            connection = await db.getConnection();
            const [rows] = await connection.execute('SELECT * FROM intermediaries ORDER BY created_at DESC');
            return rows;
        } catch (error) {
            throw error;
        }finally {
            if (connection) {
                try {
                    connection.release();
                    console.log('Connection released in Intermediary.getAll');
                } catch (releaseError) {
                    console.error('Error releasing connection in Intermediary.getAll:', releaseError);
                }
            }
        }
    }

    static async getById(id) {
        let connection;
        try {
            connection = await db.getConnection();
            const [rows] = await connection.execute('SELECT * FROM intermediaries WHERE id = ?', [id]);
            return rows[0];
        } catch (error) {
            throw error;
        }finally {
            if (connection) {
                try {
                    connection.release();
                    console.log('Connection released in Intermediary.getById');
                } catch (releaseError) {
                    console.error('Error releasing connection in Intermediary.getById:', releaseError);
                }
            }
        }
    }

    static async update(id, data) {
        let connection;
        try {
            connection = await db.getConnection();
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
            if (connection) {
                try {
                    connection.release();
                    console.log('Connection released in Intermediary.update');
                } catch (releaseError) {
                    console.error('Error releasing connection in Intermediary.update:', releaseError);
                }
            }
        }
    }

    static async delete(id) {
        let connection;
        try {
            connection = await db.getConnection();
            const [result] = await connection.execute('DELETE FROM intermediaries WHERE id = ?', [id]);
            return result.affectedRows > 0;
        } catch (error) {
            throw error;
        }finally {
            if (connection) {
                try {
                    connection.release();
                    console.log('Connection released in Intermediary.delete');
                } catch (releaseError) {
                    console.error('Error releasing connection in Intermediary.delete:', releaseError);
                }
            }
        }
    }
}

module.exports = Intermediary;
