const cron = require('node-cron');
const DateTimeUtils = require('../utils/dateTimeUtils');
const Student = require('../models/studentModel');
const Attendance = require('../models/attendanceModel');
const PdfGenerator = require('../utils/pdfGenerator');
const EmailService = require('../utils/emailService');
const path = require('path');

class CronService {
    static async sendMonthlyAttendanceLists() {
        try {
            // Get all active students (with no pagination)
            const result = await Student.getAll(1, Number.MAX_SAFE_INTEGER);
            
            if (!result || !result.students || !Array.isArray(result.students)) {
                console.error('No students found or invalid data format');
                return;
            }
            
            const students = result.students;
            
            // Get last month's date range
            const now = DateTimeUtils.getBerlinDateTime();
            const lastMonth = now.clone().subtract(1, 'month').startOf('month');
            const endOfLastMonth = now.clone().subtract(1, 'month').endOf('month');
            const startDate = DateTimeUtils.formatToSQLDate(lastMonth);
            const endDate = DateTimeUtils.formatToSQLDate(endOfLastMonth);

            console.log(`Generating attendance lists for period: ${startDate} to ${endDate}`);

            // Process each student
            for (const student of students) {
                try {
                    // Generate attendance list
                    const attendanceList = await Attendance.getAttendanceList(
                        startDate,
                        endDate,
                        student.student_id
                    );

                    if (!attendanceList || attendanceList.length === 0) {
                        console.log(`No attendance records for student ${student.student_id} in the specified period`);
                        continue;
                    }

                    // Generate PDF
                    const pdfResult = await PdfGenerator.generateAttendancePDF({
                        data: attendanceList,
                        start_date: startDate,
                        end_date: endDate
                    });

                    // Send email if authority email exists
                    if (student.authority_email) {
                        await EmailService.sendAttendanceListEmail({
                            email: student.authority_email,
                            cc: 'info@bad.de',
                            bgNumber: student.bg_number,
                            studentName: `${student.first_name} ${student.last_name}`,
                            startDate,
                            endDate,
                            measureNumber: student.measures_number,
                            measureTitle: student.measures_title,
                            pdfPath: pdfResult.path
                        });
                        console.log(`Monthly attendance email sent for student ${student.id}`);
                    } else {
                        console.log(`No authority email found for student ${student.id}`);
                    }
                } catch (error) {
                    console.error(`Error processing student ${student.id}:`, error);
                    // Continue with next student even if one fails
                    continue;
                }
            }
        } catch (error) {
            console.error('Error in monthly attendance cron job:', error);
        }
    }

    static initialize() {
        // Run at 00:00 on the 1st of every month
        cron.schedule('0 0 1 * *', async () => {
            console.log('Starting monthly attendance email cron job');
            await CronService.sendMonthlyAttendanceLists();
        });
    }
}

module.exports = CronService;
