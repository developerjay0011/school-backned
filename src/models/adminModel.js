const db = require('../config/database');

class AdminModel {
    static async getByEmail(email) {
        const connection = await db.getConnection();
        try {
            
            const [rows] = await connection.execute(
                'SELECT * FROM admin_users WHERE email = ?',
                [email]
            );
            return rows[0];
        } catch (error) {
            connection.release();
            throw error;
        }finally {
            connection.release();
        }
    }
}

module.exports = AdminModel;
