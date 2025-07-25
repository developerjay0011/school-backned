const db = require('../config/database');

class FeedbackModel {
    static async getFeedbacksByDateRangeAndMeasure(dateFrom, dateUntil, courseId) {
        try {
            console.log('Fetching feedbacks with params:', { dateFrom, dateUntil, courseId });
            
            // First find the measurement to verify it exists
            const [measurements] = await db.query(
                'SELECT * FROM measurements WHERE id = ?',
                [courseId]
            );
            console.log('Found measurement:', measurements[0]);

            if (!measurements[0]) {
                throw new Error('Course not found');
            }

            const query = `
                SELECT 
                    f.id,
                    f.student_id,
                    f.course_id,
                    f.feedback_date,
                    f.responses,
                    f.remarks,
                    f.created_at,
                    s.first_name,
                    s.last_name,
                    m.measures_number,
                    m.measures_title
                FROM course_feedback f
                JOIN student s ON f.student_id = s.student_id
                JOIN measurements m ON m.id = ?
                WHERE f.course_id = ?
                AND f.feedback_date BETWEEN ? AND ?
                ORDER BY f.feedback_date ASC, s.first_name, s.last_name`;

            console.log('Executing query:', query);
            console.log('Query params:', [courseId, courseId, dateFrom, dateUntil]);
            
            const [rows] = await db.query(query, [courseId, courseId, dateFrom, dateUntil]);
            console.log('Found feedbacks:', rows.length);
            return rows;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = FeedbackModel;
