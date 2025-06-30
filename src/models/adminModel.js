const db = require('../config/database');

class AdminModel {
    static async getByEmail(email) {
        try {
            const [rows] = await db.execute(
                'SELECT * FROM admin_users WHERE email = ?',
                [email]
            );
            return rows[0];
        } catch (error) {
            throw error;
        }
    }
}

module.exports = AdminModel;
