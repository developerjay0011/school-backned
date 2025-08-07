const AttendanceModel = require('../../models/attendanceModel');

const AdminAttendanceController = {
    getAttendanceStats: async function(req, res) {
        const { period } = req.params;
        const connection = await require('../../config/database').getConnection();

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
        } finally {
            connection.release();
        }
    },
    markAttendance: async function(req, res) {
        const { studentId } = req.params;
        const { date, slots } = req.body;
        const connection = await require('../../config/database').getConnection();

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

            // Check if date is a weekend
            const dayOfWeek = new Date(date).getDay();
            if (dayOfWeek === 0 || dayOfWeek === 6) {
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
        } finally {
            connection.release();
        }
    },
    getFullDayAbsences: async function(req, res) {
        const { studentId } = req.params;
        const connection = await require('../../config/database').getConnection();

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
        } finally {
            connection.release();
        }
    },
    getAttendanceList: async function(req, res) {
        const connection = await require('../../config/database').getConnection();
        try {
            let { start_date, end_date, student_id } = req.query;

            // If no dates provided, use current date
            if (!start_date && !end_date) {
                const today = new Date().toISOString().split('T')[0];
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

            // Validate date format
            const startDate = new Date(start_date);
            const endDate = new Date(end_date);

            if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
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
                message: 'Error fetching attendance list',
                error: error.message
            });
        } finally {
            connection.release();
        }
    }
};

module.exports = AdminAttendanceController;
