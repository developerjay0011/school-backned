const db = require('../config/database');

class BridgeDay {
    static async create(data) {
        const connection = await db.getConnection();
        try {
            const [result] = await connection.execute(
                'INSERT INTO bridge_days (bridge_days, date) VALUES (?, ?)',
                [data.bridge_days, data.date]
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
            const [rows] = await connection.execute(
                'SELECT *, DATE_FORMAT(date, "%Y-%m-%d") as date FROM bridge_days ORDER BY date DESC'
            );
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
                'SELECT *, DATE_FORMAT(date, "%Y-%m-%d") as date FROM bridge_days WHERE id = ?',
                [id]
            );
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
                'UPDATE bridge_days SET bridge_days = ?, date = ? WHERE id = ?',
                [data.bridge_days, data.date, id]
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
            const [result] = await connection.execute('DELETE FROM bridge_days WHERE id = ?', [id]);
            return result.affectedRows > 0;
        } catch (error) {
            throw error;
        } finally {
            connection.release();
            }
    }
}

module.exports = BridgeDay;
