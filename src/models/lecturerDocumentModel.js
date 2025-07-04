const db = require('../config/database');

class LecturerDocumentModel {
    static async create(data) {
        try {
            const { lecturer_id, file_name, file_path, description } = data;
            
            const [result] = await db.execute(
                `INSERT INTO lecturer_documents (lecturer_id, file_name, file_path, description)
                VALUES (?, ?, ?, ?)`,
                [lecturer_id, file_name, file_path, description]
            );
            
            return result.insertId;
        } catch (error) {
            console.error('Error creating lecturer document:', error);
            throw error;
        }
    }

    static async getByLecturerId(lecturerId) {
        try {
            const [rows] = await db.execute(
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
        }
    }

    static async delete(id, lecturerId) {
        try {
            const [result] = await db.execute(
                `UPDATE lecturer_documents 
                SET deleted_at = CURRENT_TIMESTAMP
                WHERE id = ? AND lecturer_id = ?`,
                [id, lecturerId]
            );
            
            return result.affectedRows > 0;
        } catch (error) {
            console.error('Error deleting lecturer document:', error);
            throw error;
        }
    }
}

module.exports = LecturerDocumentModel;
