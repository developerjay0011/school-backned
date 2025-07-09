const AttendanceModel = require('../../models/attendanceModel');
const DateTimeUtils = require('../../utils/dateTimeUtils');

const AdminAttendanceController = {
    getAttendanceStats: async function(req, res) {
        const { period } = req.params;

        try {
            // Validate period
            if (!['this_week', 'last_week', 'this_month'].includes(period)) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid period. Must be one of: this_week, last_week, this_month'
                });
            }

            const stats = await AttendanceModel.getAttendanceStats(period);
            
            if (!stats) {
                return res.status(404).json({
                    success: false,
                    message: 'No attendance data found for the specified period'
                });
            }

            res.status(200).json({
                success: true,
                message: 'Attendance statistics retrieved successfully',
                data: stats
            });
        } catch (error) {
            console.error('Error getting attendance stats:', error);
            res.status(500).json({
                success: false,
                message: 'Error getting attendance statistics',
                error: error.message
            });
        }
    },
    markAttendance: async function(req, res) {
        const { studentId } = req.params;
        const { date, slots } = req.body;

        try {
            // Validate student ID
            if (!studentId || isNaN(studentId)) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid student ID'
                });
            }

            // Validate date
            const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
            if (!date || !dateRegex.test(date)) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid date format. Use YYYY-MM-DD'
                });
            }

            // Validate slots
            if (!Array.isArray(slots) || slots.length === 0 || 
                !slots.every(slot => ['morning', 'afternoon'].includes(slot))) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid slots. Must be an array containing "morning" and/or "afternoon"'
                });
            }

            // Parse date in Berlin timezone and check if it's a weekend
            const berlinDate = DateTimeUtils.parseToDateTime(date);
            const dayOfWeek = berlinDate.weekday; // 1-7, where 1 is Monday
            
            if (dayOfWeek === 6 || dayOfWeek === 7) {
                return res.status(400).json({
                    success: false,
                    message: 'Cannot mark attendance on weekends'
                });
            }

            await AttendanceModel.markAdminAttendance(studentId, date, slots);
            
            res.status(200).json({
                success: true,
                message: 'Attendance marked successfully',
                data: {
                    student_id: studentId,
                    date,
                    slots
                }
            });
        } catch (error) {
            console.error('Error marking attendance:', error);
            res.status(500).json({
                success: false,
                message: 'Error marking attendance',
                error: error.message
            });
        }
    },
    getFullDayAbsences: async function(req, res) {
        const { studentId } = req.params;

        try {
            // Validate student ID
            if (!studentId || isNaN(studentId)) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid student ID'
                });
            }

            const absences = await AttendanceModel.getFullDayAbsences(studentId);
            
            res.status(200).json({
                success: true,
                message: absences.length > 0 ? 'Full day absences retrieved successfully' : 'No full day absences found',
                data: absences
            });
        } catch (error) {
            console.error('Error retrieving full day absences:', error);
            res.status(500).json({
                success: false,
                message: 'Error retrieving full day absences',
                error: error.message
            });
        }
    },
    getAttendanceList: async function(req, res) {
        try {
            let { start_date, end_date, student_id } = req.query;

            // If no dates provided, use current date in Berlin timezone
            if (!start_date && !end_date) {
                const today = DateTimeUtils.formatToSQLDate(DateTimeUtils.getBerlinDateTime());
                start_date = today;
                end_date = today;
            } 
            // If only one date is provided, require both
            else if (!start_date || !end_date) {
                return res.status(400).json({
                    success: false,
                    message: 'Both start_date and end_date are required for date range queries'
                });
            }

            // Parse and validate dates in Berlin timezone
            const startDate = DateTimeUtils.parseToDateTime(start_date);
            const endDate = DateTimeUtils.parseToDateTime(end_date);

            if (!startDate.isValid || !endDate.isValid) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid date format. Use YYYY-MM-DD'
                });
            }

            if (endDate < startDate) {
                return res.status(400).json({
                    success: false,
                    message: 'End date cannot be before start date'
                });
            }

            const attendanceList = await AttendanceModel.getAttendanceList(
                start_date,
                end_date,
                student_id || null
            );

            res.json({
                success: true,
                data: attendanceList
            });
        } catch (error) {
            console.error('Error fetching attendance list:', error);
            res.status(500).json({
                success: false,
                message: 'Error fetching attendance list'
            });
        }
    }
};

module.exports = AdminAttendanceController;
