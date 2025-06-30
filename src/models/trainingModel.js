const db = require('../config/database');

class Training {
    static async create(userId, trainingData) {
        try {
            const [result] = await db.query(
                `INSERT INTO trainings (
                    user_id,
                    topic,
                    quarter,
                    actual_date,
                    participation,
                    reason_non_participation,
                    effectiveness,
                    feedback_assessment
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    userId,
                    trainingData.topic,
                    trainingData.quarter,
                    trainingData.actual_date,
                    trainingData.participation,
                    trainingData.reason_non_participation,
                    trainingData.effectiveness,
                    trainingData.feedback_assessment
                ]
            );
            return result.insertId;
        } catch (error) {
            throw error;
        }
    }

    static async getByUserId(userId) {
        try {
            const [rows] = await db.query(
                'SELECT * FROM trainings WHERE user_id = ? ORDER BY actual_date DESC',
                [userId]
            );
            return rows;
        } catch (error) {
            throw error;
        }
    }

    static async getTrainingsByDateRange(startYear, endYear) {
        try {
            // Convert years to full dates (Jan 1st to Dec 31st)
            const startDate = new Date(parseInt(startYear), 0, 1);
            const endDate = new Date(parseInt(endYear), 11, 31);

            const [rows] = await db.query(
                `SELECT 
                    t.*,
                    au.first_name,
                    au.last_name
                FROM trainings t
                LEFT JOIN admin_users au ON t.user_id = au.id
                WHERE t.actual_date BETWEEN ? AND ?
                ORDER BY t.actual_date DESC`,
                [startDate, endDate]
            );
            
            return rows.map(row => ({
                topic: row.topic,
                actual_date: row.actual_date,
                quarter: row.quarter,
                first_name: row.first_name,
                last_name: row.last_name,
                participant: row.participation,
                reason_non_participation: row.reason_non_participation,
                effectiveness: row.effectiveness,
                feedback_assessment: row.feedback_assessment
            }));
        } catch (error) {
            throw error;
        }
    }

    static async update(trainingId, trainingData) {
        try {
            const [result] = await db.query(
                `UPDATE trainings SET
                    topic = ?,
                    quarter = ?,
                    actual_date = ?,
                    participation = ?,
                    reason_non_participation = ?,
                    effectiveness = ?,
                    feedback_assessment = ?
                WHERE id = ?`,
                [
                    trainingData.topic,
                    trainingData.quarter,
                    trainingData.actual_date,
                    trainingData.participation,
                    trainingData.reason_non_participation,
                    trainingData.effectiveness,
                    trainingData.feedback_assessment,
                    trainingId
                ]
            );
            return result.affectedRows > 0;
        } catch (error) {
            throw error;
        }
    }

    static async delete(trainingId) {
        try {
            const [result] = await db.query(
                'DELETE FROM trainings WHERE id = ?',
                [trainingId]
            );
            return result.affectedRows > 0;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = Training;
