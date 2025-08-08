const db = require('../config/database');

class AdminModel {
    static async getByEmail(email) {
        let connection;
        try {
            connection = await db.getConnection();
            
            const [rows] = await connection.execute(
                'SELECT * FROM admin_users WHERE email = ?',
                [email]
            );
            return rows[0];
        } catch (error) {
            console.error('Error in AdminModel.getByEmail:', error);
            throw error;
        } finally {
            if (connection) {
                try {
                    connection.release();
                    console.log('Connection released in AdminModel.getByEmail');
                } catch (releaseError) {
                    console.error('Error releasing connection in AdminModel.getByEmail:', releaseError);
                }
            }
        }
    }
}

module.exports = AdminModel;
