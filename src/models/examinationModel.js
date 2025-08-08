const db = require('../config/database');

class Examination {
    static async create(data) {
        let connection;
        try {
            connection = await db.getConnection();
            const [result] = await connection.execute(
                'INSERT INTO examinations (examination) VALUES (?)',
                [data.examination]
            );
            return result.insertId;
        } catch (error) {
            throw error;
        } finally {
            if (connection) {
                try {
                    connection.release();
                    console.log('Connection released in Examination.create');
                } catch (releaseError) {
                    console.error('Error releasing connection in Examination.create:', releaseError);
                }
            }
        }
    }

    static async getAll() {
        let connection;
        try {
            connection = await db.getConnection();
            const [rows] = await connection.execute('SELECT * FROM examinations ORDER BY created_at DESC');
            return rows;
        } catch (error) {
            throw error;
        } finally {
            if (connection) {
                try {
                    connection.release();
                    console.log('Connection released in Examination.getAll');
                } catch (releaseError) {
                    console.error('Error releasing connection in Examination.getAll:', releaseError);
                }
            }
        }
    }

    static async getById(id) {
        let connection;
        try {
            connection = await db.getConnection();
            const [rows] = await connection.execute('SELECT * FROM examinations WHERE id = ?', [id]);
            return rows[0];
        } catch (error) {
            throw error;
        } finally {
            if (connection) {
                try {
                    connection.release();
                    console.log('Connection released in Examination.getById');
                } catch (releaseError) {
                    console.error('Error releasing connection in Examination.getById:', releaseError);
                }
            }
        }
    }

    static async update(id, data) {
        let connection;
        try {
            connection = await db.getConnection();
            const [result] = await connection.execute(
                'UPDATE examinations SET examination = ? WHERE id = ?',
                [data.examination, id]
            );
            return result.affectedRows > 0;
        } catch (error) {
            throw error;
        } finally {
            if (connection) {
                try {
                    connection.release();
                    console.log('Connection released in Examination.update');
                } catch (releaseError) {
                    console.error('Error releasing connection in Examination.update:', releaseError);
                }
            }
        }
    }

    static async delete(id) {
        let connection;
        try {
            connection = await db.getConnection();
            const [result] = await connection.execute('DELETE FROM examinations WHERE id = ?', [id]);
            return result.affectedRows > 0;
        } catch (error) {
            throw error;
        } finally {
            if (connection) {
                try {
                    connection.release();
                    console.log('Connection released in Examination.delete');
                } catch (releaseError) {
                    console.error('Error releasing connection in Examination.delete:', releaseError);
                }
            }
        }
    }
}

module.exports = Examination;
