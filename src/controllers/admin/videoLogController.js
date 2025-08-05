const VideoLog = require('../../models/VideoLog');

const getAllVideoLogs = async (req, res) => {
    const { studentId } = req.query;

    try {
        let logs;
        if (studentId) {
            logs = await VideoLog.getByStudentId(studentId);
        } else {
            logs = await VideoLog.getAll();
        }

        return res.json({
            logs
        });
    } catch (error) {
        console.error('Error in getAllVideoLogs:', error);
        return res.status(500).json({
            error: 'Internal server error',
            details: error.message
        });
    }
};

const getVideoLogsByStudentId = async (req, res) => {
    try {
        const logs = await VideoLog.getAll();
        return res.json({
            logs
        });
    } catch (error) {
        console.error('Error in getAllVideoLogs:', error);
        return res.status(500).json({
            error: 'Internal server error',
            details: error.message
        });
    }
};

module.exports = {
    getAllVideoLogs,
    getVideoLogsByStudentId
};
