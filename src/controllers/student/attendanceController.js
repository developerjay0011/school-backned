const AttendanceModel = require('../../models/attendanceModel');

const AttendanceController = {
    markAttendance: async function(req, res) {
        try {
            const studentId = req.user.student_id;
            const attendance = await AttendanceModel.markAttendance(studentId);
            
            res.json({
                success: true,
                message: `Attendance marked for ${attendance.period} session`,
                data: attendance
            });
        } catch (error) {
            console.error('Error marking attendance:', error);
            res.status(400).json({
                success: false,
                message: error.message || 'Error marking attendance'
            });
        }
    },

    getMyAttendance: async function(req, res) {
        try {
            let { start_date, end_date, student_id } = req.query;
            
            // If date range is provided, student_id is required
            if ((start_date || end_date) && !student_id) {
                return res.status(400).json({
                    success: false,
                    message: 'student_id is required when querying with date range'
                });
            }

            // If no dates provided, use current date and authenticated user's ID
            if (!start_date && !end_date) {
                const today = new Date().toISOString().split('T')[0];
                start_date = today;
                end_date = today;
                student_id = req.user.student_id;
            } 
            // If only one date is provided, require both
            else if (!start_date || !end_date) {
                return res.status(400).json({
                    success: false,
                    message: 'Both start_date and end_date are required for date range queries'
                });
            }

            const attendance = await AttendanceModel.getStudentAttendance(student_id, start_date, end_date);
            
            res.json({
                success: true,
                data: attendance
            });
        } catch (error) {
            console.error('Error getting attendance:', error);
            res.status(400).json({
                success: false,
                message: error.message || 'Error getting attendance'
            });
        }
    }
};

module.exports = AttendanceController;
