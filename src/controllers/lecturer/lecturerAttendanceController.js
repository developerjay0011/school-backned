const LecturerAttendanceModel = require('../../models/lecturerAttendanceModel');

class LecturerAttendanceController {
    static async getAttendanceList(req, res) {
        try {
            const lecturerId = req.user.lecturer_id;
            const { date } = req.query;

            if (!date) {
                return res.status(400).json({
                    success: false,
                    message: 'Date is required'
                });
            }

            const attendanceList = await LecturerAttendanceModel.getAttendanceList(lecturerId, date);
            
            return res.json({
                success: true,
                message: 'Attendance list retrieved successfully',
                data: attendanceList
            });
        } catch (error) {
            console.error('Error retrieving attendance list:', error);
            return res.status(500).json({
                success: false,
                message: 'Error retrieving attendance list',
                error: error.message
            });
        }
    }

    static async markAttendance(req, res) {
        try {
            const { student_id, date, slot, is_present } = req.body;

            // Validate required fields
            if (!student_id || !date || !slot || typeof is_present !== 'boolean') {
                return res.status(400).json({
                    success: false,
                    message: 'Missing required fields. Need: student_id, date, slot (morning/evening), is_present (boolean)'
                });
            }

            // Validate slot value
            if (slot !== 'morning' && slot !== 'evening') {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid slot value. Must be either "morning" or "evening"'
                });
            }

            const attendanceId = await LecturerAttendanceModel.markAttendance({
                student_id,
                date,
                slot,
                is_present
            });
            
            return res.json({
                success: true,
                message: 'Attendance marked successfully',
                data: { id: attendanceId }
            });
        } catch (error) {
            console.error('Error marking attendance:', error);
            return res.status(500).json({
                success: false,
                message: 'Error marking attendance',
                error: error.message
            });
        }
    }
}

module.exports = LecturerAttendanceController;
