const VideoLog = require('../../models/VideoLog');
const { validateToken } = require('../../middleware/auth');

const createVideoLog = async (req, res) => {
    try {
        const { student_id } = req.user;
        const { topic_title, course_start_date, attend_date } = req.body;

        // Validate required fields
        if (!topic_title || !course_start_date || !attend_date) {
            return res.status(400).json({
                error: 'Missing required fields',
                details: 'topic_title, course_start_date, and attend_date are required'
            });
        }

        // Get earliest course start date before creating log
        const earliestDate = await VideoLog.getEarliestCourseStartDate(student_id);
        
        // Create video log
        const logId = await VideoLog.create({
            student_id,
            topic_title,
            course_start_date: new Date(course_start_date),
            attend_date: new Date(attend_date)
        });

        return res.status(201).json({
            message: 'Video log created successfully',
            logId,
            course_start_date: earliestDate || course_start_date,
            is_first_entry: !earliestDate
        });
    } catch (error) {
        console.error('Error in createVideoLog:', error);
        return res.status(500).json({
            error: 'Internal server error',
            details: error.message
        });
    }
};

const getMyVideoLogs = async (req, res) => {
    try {
        const { student_id } = req.user;
        const logs = await VideoLog.getByStudentId(student_id);

        return res.json({
            logs
        });
    } catch (error) {
        console.error('Error in getMyVideoLogs:', error);
        return res.status(500).json({
            error: 'Internal server error',
            details: error.message
        });
    }
};

module.exports = {
    createVideoLog,
    getMyVideoLogs
};
