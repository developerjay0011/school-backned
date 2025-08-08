const db = require('../config/database');

class BridgeDay {
    static async create(data) {
        let connection;
        try {
            connection = await db.getConnection();
            const [result] = await connection.execute(
                'INSERT INTO bridge_days (bridge_days, date) VALUES (?, ?)',
                [data.bridge_days, data.date]
            );
            return result.insertId;
        } catch (error) {
            console.error('Error creating bridge day:', error);
            throw error;
        } finally {
            if (connection) {
                try {
                    connection.release();
                    console.log('Connection released in BridgeDay.create');
                } catch (releaseError) {
                    console.error('Error releasing connection in BridgeDay.create:', releaseError);
                }
            }
        }
    }

    static async getAll() {
        let connection;
        try {
            connection = await db.getConnection();
            const [rows] = await connection.execute(
                'SELECT *, DATE_FORMAT(date, "%Y-%m-%d") as date FROM bridge_days ORDER BY date DESC'
            );
            return rows;
        } catch (error) {
            console.error('Error getting all bridge days:', error);
            throw error;
        } finally {
            if (connection) {
                try {
                    connection.release();
                    console.log('Connection released in BridgeDay.getAll');
                } catch (releaseError) {
                    console.error('Error releasing connection in BridgeDay.getAll:', releaseError);
                }
            }
        }
    }

    static async getById(id) {
        let connection;
        try {
            connection = await db.getConnection();
            const [rows] = await connection.execute(
                'SELECT *, DATE_FORMAT(date, "%Y-%m-%d") as date FROM bridge_days WHERE id = ?',
                [id]
            );
            return rows[0];
        } catch (error) {
            console.error('Error getting bridge day by ID:', error);
            throw error;
        } finally {
            if (connection) {
                try {
                    connection.release();
                    console.log('Connection released in BridgeDay.getById');
                } catch (releaseError) {
                    console.error('Error releasing connection in BridgeDay.getById:', releaseError);
                }
            }
        }
    }

    static async update(id, data) {
        let connection;
        try {
            connection = await db.getConnection();
            const [result] = await connection.execute(
                'UPDATE bridge_days SET bridge_days = ?, date = ? WHERE id = ?',
                [data.bridge_days, data.date, id]
            );
            return result.affectedRows > 0;
        } catch (error) {
            console.error('Error updating bridge day:', error);
            throw error;
        } finally {
            if (connection) {
                try {
                    connection.release();
                    console.log('Connection released in BridgeDay.update');
                } catch (releaseError) {
                    console.error('Error releasing connection in BridgeDay.update:', releaseError);
                }
            }
        }
    }

    static async delete(id) {
        let connection;
        try {
            connection = await db.getConnection();
            const [result] = await connection.execute('DELETE FROM bridge_days WHERE id = ?', [id]);
            return result.affectedRows > 0;
        } catch (error) {
            console.error('Error deleting bridge day:', error);
            throw error;
        } finally {
            if (connection) {
                try {
                    connection.release();
                    console.log('Connection released in BridgeDay.delete');
                } catch (releaseError) {
                    console.error('Error releasing connection in BridgeDay.delete:', releaseError);
                }
            }
        }
    }
}

module.exports = BridgeDay;
