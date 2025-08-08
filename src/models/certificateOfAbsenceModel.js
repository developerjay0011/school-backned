const db = require('../config/database');

class CertificateOfAbsence {
    static async getByStudentId(studentId) {
        const connection = await db.getConnection();
        const query = `
            SELECT *
            FROM certificate_of_absence
            WHERE student_id = ?
            ORDER BY created_at DESC
        `;

        try {
            const [results] = await connection.query(query, [studentId]);
            return results.map(row => ({
                id: row.id,
                date: row.date,
                description: row.description,
                sent_to: row.sent_to,
                pdf_url: row.pdf_url,
                created_at: row.created_at
            }));
        } catch (error) {
            console.error('Error fetching certificates by student ID:', error);
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
        const connection = await db.getConnection();
        const query = 'DELETE FROM certificate_of_absence WHERE id = ?';
        
        try {
            const [result] = await connection.execute(query, [id]);
            return result.affectedRows > 0;
        } catch (error) {
            console.error('Error deleting certificate:', error);
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
    static async getAll() {
        const connection = await db.getConnection();
        const query = `
            SELECT *
            FROM certificate_of_absence
            ORDER BY created_at DESC
        `;

        try {
            const [results] = await connection.query(query);
            return results.map(row => ({
                id: row.id,
                date: row.date,
                description: row.description,
                sent_to: row.sent_to,
                pdf_url: row.pdf_url,
                created_at: row.created_at
            }));
        } catch (error) {
            console.error('Error fetching certificates:', error);
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

    static async create(data) {
        const { date, description, sent_to, pdf_url, student_id } = data;
        const connection = await db.getConnection();
        
        const query = `
            INSERT INTO certificate_of_absence (date, description, sent_to, pdf_url, student_id)
            VALUES (?, ?, ?, ?, ?)
        `;
        
        try {
            const [result] = await connection.execute(query, [date, description, sent_to, pdf_url, student_id]);
            return result.insertId;
        } catch (error) {
            console.error('Error creating certificate record:', error);
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

module.exports = CertificateOfAbsence;
