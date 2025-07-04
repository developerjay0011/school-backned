const db = require('../config/database');

class MeasuresZoomLinksModel {
    static async create(data) {
        try {
            const { measures_id, lecturer_id, zoom_link, start_date, end_date } = data;
            
            const [result] = await db.execute(
                `INSERT INTO measures_zoom_links 
                (measures_id, lecturer_id, zoom_link, start_date, end_date) 
                VALUES (?, ?, ?, ?, ?)`,
                [measures_id, lecturer_id, zoom_link, start_date, end_date]
            );

            return result.insertId;
        } catch (error) {
            console.error('Error creating zoom link:', error);
            throw error;
        }
    }

    static async update(id, data) {
        try {
            const { zoom_link, start_date, end_date } = data;
            
            const [result] = await db.execute(
                `UPDATE measures_zoom_links 
                SET zoom_link = ?, start_date = ?, end_date = ?
                WHERE id = ? AND deleted_at IS NULL`,
                [zoom_link, start_date, end_date, id]
            );

            return result.affectedRows > 0;
        } catch (error) {
            console.error('Error updating zoom link:', error);
            throw error;
        }
    }

    static async getByLecturerId(lecturerId) {
        try {
            const [rows] = await db.execute(
                `SELECT mzl.*, m.measures_number, m.measures_title
                FROM measures_zoom_links mzl
                INNER JOIN measurements m ON m.id = mzl.measures_id
                WHERE mzl.lecturer_id = ? 
                AND mzl.deleted_at IS NULL
                ORDER BY mzl.start_date DESC`,
                [lecturerId]
            );

            return rows;
        } catch (error) {
            console.error('Error getting zoom links:', error);
            throw error;
        }
    }

    static async delete(id, lecturerId) {
        try {
            const [result] = await db.execute(
                `UPDATE measures_zoom_links 
                SET deleted_at = CURRENT_TIMESTAMP
                WHERE id = ? AND lecturer_id = ?`,
                [id, lecturerId]
            );

            return result.affectedRows > 0;
        } catch (error) {
            console.error('Error deleting zoom link:', error);
            throw error;
        }
    }
}

module.exports = MeasuresZoomLinksModel;
