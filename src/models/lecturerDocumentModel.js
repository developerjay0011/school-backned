const db = require('../config/database');

class LecturerDocumentModel {
    static async create(data) {
     let connection;
        try {
            connection = await db.getConnection();
            await connection.beginTransaction();
            
            const { lecturer_id, file_name, file_path, description } = data;
            
            const [result] = await connection.execute(
                `INSERT INTO lecturer_documents (lecturer_id, file_name, file_path, description)
                VALUES (?, ?, ?, ?)`,
                [lecturer_id, file_name, file_path, description]
            );
            
            await connection.commit();
            return result.insertId;
        } catch (error) {
            await connection.rollback();
            console.error('Error creating lecturer document:', error);
            throw error;
        } finally {
            if (connection) {
                try {
                    connection.release();
                    console.log('Connection released in User.delete');
                } catch (releaseError) {
                    console.error('Error releasing connection in User.delete:', releaseError);
                }
            }
        }
    }

    static async getByLecturerId(lecturerId) {
     let connection;
        try {
            connection = await db.getConnection();
            const [rows] = await connection.execute(
                `SELECT 
                    id,
                    lecturer_id,
                    file_name,
                    file_path,
                    description,
                    created_at,
                    updated_at
                FROM lecturer_documents
                WHERE lecturer_id = ?
                    AND deleted_at IS NULL
                ORDER BY created_at DESC`,
                [lecturerId]
            );
            
            return rows;
        } catch (error) {
            console.error('Error getting lecturer documents:', error);
            throw error;
        } finally {
            if (connection) {
                try {
                    connection.release();
                    console.log('Connection released in User.delete');
                } catch (releaseError) {
                    console.error('Error releasing connection in User.delete:', releaseError);
                }
            }
        }
    }

    static async delete(id, lecturerId) {
     let connection;
        try {
            connection = await db.getConnection();
            await connection.beginTransaction();
            
            const [result] = await connection.execute(
                `UPDATE lecturer_documents 
                SET deleted_at = CURRENT_TIMESTAMP
                WHERE id = ? AND lecturer_id = ?`,
                [id, lecturerId]
            );
            
            await connection.commit();
            return result.affectedRows > 0;
        } catch (error) {
            await connection.rollback();
            console.error('Error deleting lecturer document:', error);
            throw error;
        } finally {
            if (connection) {
                try {
                    connection.release();
                    console.log('Connection released in User.delete');
                } catch (releaseError) {
                    console.error('Error releasing connection in User.delete:', releaseError);
                }
            }
        }
    }
}

module.exports = LecturerDocumentModel;
