const VideoLog = require('../../models/VideoLog');
const db = require('../../config/database');

async function getStudentVideoLogs(req, res) {
    const connection = await db.getConnection();
    try {
        const { studentId } = req.query;
        if (!studentId) {
            return res.status(400).json({ 
                error: 'Student ID is required',
                details: 'Student ID must be provided as a query parameter'
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

        const logs = await VideoLog.getByStudentId(studentId);
        return res.json({
            success: true,
            studentId,
            logs
        });
    } catch (error) {
        console.error('Error getting student video logs:', error);
        connection.release();
        return res.status(500).json({
            error: 'Internal server error',
            details: error.message
        });
    } finally {
        connection.release();
    }
}

module.exports = {
    getStudentVideoLogs
};
