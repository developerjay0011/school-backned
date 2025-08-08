const db = require('../config/database');
const path = require('path');
const fs = require('fs');

class QualificationMatrix {
    static async create(description, pdfUrl) {
     let connection;
        try {
            connection = await db.getConnection();
            const [result] = await connection.query(
                'INSERT INTO qualification_matrix (description, pdf_url) VALUES (?, ?)',
                [description, pdfUrl]
            );
            return result.insertId;
        } catch (error) {
            throw error;
        }finally {
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

    static async getAll() {
     let connection;
        try {
            connection = await db.getConnection();
            const [matrices] = await connection.query(
                'SELECT * FROM qualification_matrix ORDER BY created_at DESC'
            );
            return matrices;
        } catch (error) {
            throw error;
        }finally {
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

    static async getById(id) {
     let connection;
        try {
            connection = await db.getConnection();
            const [matrices] = await connection.query(
                'SELECT * FROM qualification_matrix WHERE id = ?',
                [id]
            );
            return matrices[0];
        } catch (error) {
            throw error;
        }finally {
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

    static async delete(id) {
     let connection;
        try {
            connection = await db.getConnection();
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

module.exports = QualificationMatrix;
