const db = require('../config/database');

class TrainingReportModel {
    static async create(data) {
        const connection = await db.getConnection();
        try {
            console.log('Creating report with data:', { ...data, signature: 'base64_image_data_hidden' });
            
            // Validate base64 image
            if (!data.signature.match(/^data:image\/(png|jpeg|jpg|gif);base64,/)) {
                throw new Error('Invalid signature image format');
            }
            const [result] = await connection.execute(
                `INSERT INTO training_reports (
                    nr,
                    title,
                    description,
                    ue,
                    signature,
                    lecturer_id
                ) VALUES (?, ?, ?, ?, ?, ?)`,
                [
                    data.nr,
                    data.title,
                    data.description,
                    data.ue,
                    data.signature,
                    data.lecturer_id
                ]
            );
            console.log('Created report with id:', result.insertId);
            return result.insertId;
        } catch (error) {
            console.error('Error in create:', error);
            throw error;
        } finally {
            connection.release();
        }
    }

    static async getAll(lecturer_id) {
        const connection = await db.getConnection();
        try {
            console.log('Getting all reports for lecturer_id:', lecturer_id);
            const [rows] = await connection.execute(
                'SELECT * FROM training_reports WHERE lecturer_id = ? ORDER BY nr ASC',
                [lecturer_id]
            );
            console.log('Found reports:', rows);
            return rows;
        } catch (error) {
            console.error('Error in getAll:', error);
            throw error;
        } finally {
            connection.release();
        }
    }

    static async getById(id, lecturer_id) {
        const connection = await db.getConnection();
        try {
            console.log('Getting report by id:', id, 'for lecturer_id:', lecturer_id);
            const [rows] = await connection.execute(
                'SELECT * FROM training_reports WHERE id = ? AND lecturer_id = ?',
                [id, lecturer_id]
            );
            console.log('Found report:', rows[0]);
            return rows[0];
        } catch (error) {
            console.error('Error in getById:', error);
            throw error;
        } finally {
            connection.release();
        }
    }

    static async update(id, data, lecturer_id) {
        const connection = await db.getConnection();
        try {
            console.log('Updating report:', { ...data, signature: 'base64_image_data_hidden' });
            
            // Validate base64 image
            if (!data.signature.match(/^data:image\/(png|jpeg|jpg|gif);base64,/)) {
                throw new Error('Invalid signature image format');
            }
            const [result] = await connection.execute(
                `UPDATE training_reports 
                SET nr = ?,
                    title = ?,
                    description = ?,
                    ue = ?,
                    signature = ?
                WHERE id = ? AND lecturer_id = ?`,
                [
                    data.nr,
                    data.title,
                    data.description,
                    data.ue,
                    data.signature,
                    id,
                    lecturer_id
                ]
            );
            return result.affectedRows > 0;
        } catch (error) {
            throw error;
        } finally {
            connection.release();
        }
    }

    static async delete(id, lecturer_id) {
        const connection = await db.getConnection();
        try {
            const [result] = await connection.execute(
                'DELETE FROM training_reports WHERE id = ? AND lecturer_id = ?',
                [id, lecturer_id]
            );
            return result.affectedRows > 0;
        } catch (error) {
            throw error;
        } finally {
            connection.release();
        }
    }

    static async getByDateRange(lecturer_id, startDate, endDate) {
        const connection = await db.getConnection();
        try {
            console.log('Getting reports for date range:', { lecturer_id, startDate, endDate });
            const [rows] = await connection.execute(
                'SELECT * FROM training_reports WHERE lecturer_id = ? AND DATE(created_at) BETWEEN ? AND ? ORDER BY created_at ASC',
                [lecturer_id, startDate, endDate]
            );
            console.log('Found reports:', rows);
            return rows;
        } catch (error) {
            console.error('Error in getByDateRange:', error);
            throw error;
        } finally {
            connection.release();
        }
    }
}

module.exports = TrainingReportModel;
