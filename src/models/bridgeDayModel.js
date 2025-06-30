const db = require('../config/database');

class BridgeDay {
    static async create(data) {
        try {
            const [result] = await db.execute(
                'INSERT INTO bridge_days (bridge_days, date) VALUES (?, ?)',
                [data.bridge_days, data.date]
            );
            return result.insertId;
        } catch (error) {
            throw error;
        }
    }

    static async getAll() {
        try {
            const [rows] = await db.execute(
                'SELECT *, DATE_FORMAT(date, "%Y-%m-%d") as date FROM bridge_days ORDER BY date DESC'
            );
            return rows;
        } catch (error) {
            throw error;
        }
    }

    static async getById(id) {
        try {
            const [rows] = await db.execute(
                'SELECT *, DATE_FORMAT(date, "%Y-%m-%d") as date FROM bridge_days WHERE id = ?',
                [id]
            );
            return rows[0];
        } catch (error) {
            throw error;
        }
    }

    static async update(id, data) {
        try {
            const [result] = await db.execute(
                'UPDATE bridge_days SET bridge_days = ?, date = ? WHERE id = ?',
                [data.bridge_days, data.date, id]
            );
            return result.affectedRows > 0;
        } catch (error) {
            throw error;
        }
    }

    static async delete(id) {
        try {
            const [result] = await db.execute('DELETE FROM bridge_days WHERE id = ?', [id]);
            return result.affectedRows > 0;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = BridgeDay;
