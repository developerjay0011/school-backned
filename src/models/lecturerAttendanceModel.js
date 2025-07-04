const db = require('../config/database');

class LecturerAttendanceModel {
    static async getAttendanceList(lecturerId, date) {
        try {
            const [rows] = await db.execute(`
                SELECT 
                    s.student_id,
                    s.first_name,
                    s.last_name,
                    s.date_of_entry,
                    s.date_of_exit,
                    s.measures_id,
                    m.measures_number,
                    m.measures_title,
                    a.morning_attendance,
                    a.morning_attendance_time,
                    a.afternoon_attendance,
                    a.afternoon_attendance_time,
                    a.attendance_date
                FROM student s
                INNER JOIN lecturers l ON l.lecturer_id = ?
                INNER JOIN measurements m ON m.id = s.measures_id
                LEFT JOIN student_attendance a ON a.student_id = s.student_id AND a.attendance_date = ?
                WHERE s.lecturer = l.lecturer_id
                    AND s.deleted_at IS NULL
                ORDER BY s.first_name, s.last_name
            `, [lecturerId, date]);

            return rows;
        } catch (error) {
            console.error('Error getting attendance list:', error);
            throw error;
        }
    }

    static async markAttendance(data) {
        const { student_id, date, slot, is_present } = data;
        try {
            // First check if attendance record exists
            const [existing] = await db.execute(
                'SELECT id FROM student_attendance WHERE student_id = ? AND attendance_date = ?',
                [student_id, date]
            );

            if (existing.length > 0) {
                // Update existing record
                const slotColumn = slot === 'morning' ? 'morning_attendance' : 'afternoon_attendance';
                const timeColumn = slot === 'morning' ? 'morning_attendance_time' : 'afternoon_attendance_time';
                await db.execute(
                    `UPDATE student_attendance SET ${slotColumn} = ?, ${timeColumn} = ? WHERE student_id = ? AND attendance_date = ?`,
                    [is_present ? 1 : 0, is_present ? new Date() : null, student_id, date]
                );
                return existing[0].id;
            } else {
                // Create new record
                const morning_attendance = slot === 'morning' ? (is_present ? 1 : 0) : null;
                const morning_time = slot === 'morning' && is_present ? new Date() : null;
                const afternoon_attendance = slot === 'evening' ? (is_present ? 1 : 0) : null;
                const afternoon_time = slot === 'evening' && is_present ? new Date() : null;
                
                const [result] = await db.execute(
                    'INSERT INTO student_attendance (student_id, attendance_date, morning_attendance, morning_attendance_time, afternoon_attendance, afternoon_attendance_time) VALUES (?, ?, ?, ?, ?, ?)',
                    [student_id, date, morning_attendance, morning_time, afternoon_attendance, afternoon_time]
                );
                return result.insertId;
            }
        } catch (error) {
            console.error('Error marking attendance:', error);
            throw error;
        }
    }
}

module.exports = LecturerAttendanceModel;
