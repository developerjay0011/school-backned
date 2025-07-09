const cron = require('node-cron');
const db = require('../config/database');
const EmailService = require('../utils/emailService');
const DateTimeUtils = require('../utils/dateTimeUtils');

class AttendanceCronService {
    static async getFirstDayAttendance() {
        const query = `
            SELECT s.student_id, au.bg_number, au.email,s.date_of_entry, a.created_at, a.morning_attendance, a.afternoon_attendance
            FROM student s
            INNER JOIN student_attendance a ON s.student_id = a.student_id
            INNER JOIN authorities au ON s.student_id = au.student_id
            WHERE DATE(s.date_of_entry) = DATE(?)
            AND au.email IS NOT NULL
            AND DATE(a.created_at) = DATE(s.date_of_entry)
            AND a.morning_attendance = 1 
            AND a.afternoon_attendance = 1
            AND s.deleted_at IS NULL
            AND NOT EXISTS (SELECT 1 FROM student_reports sr WHERE sr.student_id = s.student_id AND sr.report_type IN ('termination', 'discharge'))
           `;

        try {
            const [results] = await db.query(query,[DateTimeUtils.formatToSQLDateTime(DateTimeUtils.getBerlinDateTime())]);
            return results;
        } catch (error) {
            console.error('Error fetching first day attendance:', error);
            throw error;
        }
    }

    static async markNotificationSent(studentId) {
        const query = `
            INSERT INTO attendance_notifications (student_id, notification_type, sent_at)
            VALUES (?, 'first_day', ?)`;

        try {
            await db.query(query, [studentId,DateTimeUtils.formatToSQLDateTime(DateTimeUtils.getBerlinDateTime())]);
        } catch (error) {
            console.error('Error marking notification as sent:', error);
            throw error;
        }
    }

    static async initializeCronJobs() {
        // Run at 6:20 PM every day
       
    
       cron.schedule('00 10 * * *', async () => {
            try {
                const firstDayStudents = await AttendanceCronService.getFirstDayAttendance();
                console.log(firstDayStudents);
                for (const student of firstDayStudents) {
                    try {
                        
                        await EmailService.sendFirstDayAttendanceEmail({
                            bgNumber: student.bg_number,
                            startDate: student.date_of_entry,
                            email: student.email
                        });
                        // await AttendanceCronService.markNotificationSent(student.id);
                    } catch (error) {
                        console.error(`Error processing student ${student.bg_number}:`, error);
                    }
                }
            } catch (error) {
                console.error('Error in attendance cron job:', error);
            }
       });
    }
}

module.exports = AttendanceCronService;
