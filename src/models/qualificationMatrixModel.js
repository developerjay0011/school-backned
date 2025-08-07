const db = require('../config/database');
const path = require('path');
const fs = require('fs');

class QualificationMatrix {
    static async create(description, pdfUrl) {
        const connection = await db.getConnection();
        try {
            const [result] = await connection.query(
                'INSERT INTO qualification_matrix (description, pdf_url) VALUES (?, ?)',
                [description, pdfUrl]
            );
            return result.insertId;
        } catch (error) {
            throw error;
        }finally {
            connection.release();
        }
    }

    static async getAll() {
        const connection = await db.getConnection();
        try {
            const [matrices] = await connection.query(
                'SELECT * FROM qualification_matrix ORDER BY created_at DESC'
            );
            return matrices;
        } catch (error) {
            throw error;
        }finally {
            connection.release();
        }
    }

    static async getById(id) {
        const connection = await db.getConnection();
        try {
            const [matrices] = await connection.query(
                'SELECT * FROM qualification_matrix WHERE id = ?',
                [id]
            );
            return matrices[0];
        } catch (error) {
            throw error;
        }finally {
            connection.release();
        }
    }

    static async delete(id) {
        const connection = await db.getConnection();
        try {
            const matrix = await this.getById(id);
            if (!matrix) {
                return { success: false, message: 'Matrix not found' };
            }

            // Delete from database
            await connection.query('DELETE FROM qualification_matrix WHERE id = ?', [id]);

            // Get PDF path
            const pdfPath = matrix.pdf_url.split('/uploads')[1];
            const fullPath = path.join(__dirname, '../../uploads', pdfPath);

            // Delete PDF file
            if (fs.existsSync(fullPath)) {
                fs.unlinkSync(fullPath);
            }

            return { success: true, message: 'Matrix deleted successfully' };
        } catch (error) {
            throw error;
        }finally {
            connection.release();
        }
    }
}

module.exports = QualificationMatrix;
