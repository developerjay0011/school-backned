const QuizAttempt = require('../../models/QuizAttempt');
const db = require('../../config/database');

async function getStudentResults(req, res) {
    const connection = await db.getConnection();
    try {
        const { studentId } = req.params;
        if (!studentId) {
            return res.status(400).json({ 
                error: 'Student ID is required',
                details: 'Student ID must be provided in the URL'
            });
        }

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

        // Get all quiz attempts for the student
        const results = await QuizAttempt.getStudentResults(studentId);
        
        return res.json({
            success: true,
            studentId,
            results
        });
    } catch (error) {
        console.error('Error getting student quiz results:', error);
        connection.release();
        return res.status(500).json({
            error: 'Internal server error',
            details: 'Failed to get quiz results'
        });
    } finally {
        connection.release();
    }
}

module.exports = {
    getStudentResults
};
