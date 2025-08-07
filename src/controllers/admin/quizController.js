const QuizAttempt = require('../../models/QuizAttempt');
const db = require('../../config/database');

class AdminQuizController {
    async getStudentResults(req, res) {
        const connection = await db.getConnection();
        try {
            const { studentId } = req.params;
            
            // Verify student exists
            let [students] = await connection.execute(
                'SELECT student_id FROM student WHERE student_id = ?',
                [studentId]
            );

            if (!students || students.length === 0) {
                return res.status(404).json({ 
                    error: 'Student not found',
                    details: 'No student found with the provided ID'
                });
            }

            // Get all results grouped by topic
            const results = await QuizAttempt.getStudentResults(studentId);
            
            return res.json({
                success: true,
                studentId,
                results
            });
        } catch (error) {
            console.error('Error getting quiz results:', error);
            connection.release();
            return res.status(500).json({
                error: 'Internal server error',
                details: 'Failed to get quiz results'
            });
        } finally {
            connection.release();
        }
    }

    async getAllResults(req, res) {
        const connection = await db.getConnection();
        try {
            // Optional query parameters for filtering
            const { topic, isExam, startDate, endDate } = req.query;
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 50;
            const offset = (page - 1) * limit;

            // Build query conditions
            const conditions = [];
            const params = [];

            if (topic) {
                conditions.push('qa.quiz_topic = ?');
                params.push(topic);
            }

            if (isExam !== undefined) {
                conditions.push('qa.is_exam = ?');
                params.push(isExam === 'true' ? 1 : 0);
            }

            if (startDate) {
                conditions.push('qa.created_at >= ?');
                params.push(startDate);
            }

            if (endDate) {
                conditions.push('qa.created_at <= ?');
                params.push(endDate);
            }

            // Base query
            let query = `
                SELECT 
                    qa.*,
                    s.first_name,
                    s.last_name,
                    ROUND((qa.score / qa.total_questions) * 100, 2) as percentage
                FROM quiz_attempts qa
                JOIN student s ON qa.student_id = s.student_id
            `;

            // Add conditions if any
            if (conditions.length > 0) {
                query += ' WHERE ' + conditions.join(' AND ');
            }

            // Add sorting and pagination
            query += ' ORDER BY qa.created_at DESC LIMIT ? OFFSET ?';
            params.push(limit, offset);

            // Execute query
            const [results] = await connection.execute(query, params);

            // Get total count for pagination
            let countQuery = 'SELECT COUNT(*) as total FROM quiz_attempts qa';
            if (conditions.length > 0) {
                countQuery += ' WHERE ' + conditions.join(' AND ');
            }
            const [[{ total }]] = await connection.execute(countQuery, params.slice(0, -2));

            // Separate exam and practice attempts
            const examAttempts = [];
            const practiceAttempts = [];

            for (const result of results) {
                const attemptData = {
                    ...result,
                    percentage: parseFloat(result.percentage)
                };

                if (result.is_exam === 1) {
                    examAttempts.push(attemptData);
                } else {
                    practiceAttempts.push(attemptData);
                }
            }

            return res.json({
                success: true,
                examAttempts,
                practiceAttempts,
                pagination: {
                    total,
                    page,
                    limit,
                    totalPages: Math.ceil(total / limit)
                }
            });
        } catch (error) {
            console.error('Error getting all quiz results:', error);
                connection.release();
            return res.status(500).json({
                error: 'Internal server error',
                details: 'Failed to get quiz results'
            });
        } finally {
            connection.release();
        }
    }
}

module.exports = new AdminQuizController();
