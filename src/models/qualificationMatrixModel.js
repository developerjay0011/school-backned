const db = require('../config/database');
const path = require('path');
const fs = require('fs');

class QualificationMatrix {
    static async create(description, pdfUrl) {
        try {
            const [result] = await db.query(
                'INSERT INTO qualification_matrix (description, pdf_url) VALUES (?, ?)',
                [description, pdfUrl]
            );
            return result.insertId;
        } catch (error) {
            throw error;
        }
    }

    static async getAll() {
        try {
            const [matrices] = await db.query(
                'SELECT * FROM qualification_matrix ORDER BY created_at DESC'
            );
            return matrices;
        } catch (error) {
            throw error;
        }
    }

    static async getById(id) {
        try {
            const [matrices] = await db.query(
                'SELECT * FROM qualification_matrix WHERE id = ?',
                [id]
            );
            return matrices[0];
        } catch (error) {
            throw error;
        }
    }

    static async delete(id) {
        try {
            const matrix = await this.getById(id);
            if (!matrix) {
                return { success: false, message: 'Matrix not found' };
            }

            // Delete from database
            await db.query('DELETE FROM qualification_matrix WHERE id = ?', [id]);

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
        }
    }
}

module.exports = QualificationMatrix;
