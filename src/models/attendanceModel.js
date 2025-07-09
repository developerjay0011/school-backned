const db = require('../config/database');
const DateTimeUtils = require('../utils/dateTimeUtils');

class Attendance {
    static getDateRangeForPeriod(period) {
        const now = new Date();
        let startDate, endDate;

        const getMondayOfWeek = (date) => {
            const d = new Date(date);
            const day = d.getDay();
            const diff = d.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
            return new Date(d.setDate(diff));
        };

        const getFridayOfWeek = (monday) => {
            const friday = new Date(monday);
            friday.setDate(monday.getDate() + 4);
            return friday;
        };

        switch (period) {
            case 'this_week':
                startDate = getMondayOfWeek(now);
                endDate = getFridayOfWeek(startDate);
                break;

            case 'last_week':
                const lastWeek = new Date(now);
                lastWeek.setDate(now.getDate() - 7);
                startDate = getMondayOfWeek(lastWeek);
                endDate = getFridayOfWeek(startDate);
                break;

            case 'this_month':
                // Set to first day of current month at 00:00:00
                startDate = new Date(now.getFullYear(), now.getMonth(), 1);
                startDate.setHours(0, 0, 0, 0);
                
                // Set to last day of current month at 23:59:59
                endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
                endDate.setHours(23, 59, 59, 999);
                break;

            default:
                throw new Error('Invalid period');
        }

        // Ensure endDate doesn't exceed current date
        // if (endDate > now) {
        //     endDate = now;
        // }

        // Format dates to YYYY-MM-DD
        const formatDate = (date) => {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
        };

        return {
            startDate: formatDate(startDate),
            endDate: formatDate(endDate)
        };
    }

    static async getAttendanceStats(period) {
        const { startDate, endDate } = this.getDateRangeForPeriod(period);

        const query = `
            WITH RECURSIVE date_series AS (
                SELECT ? as date
                UNION ALL
                SELECT DATE_ADD(date, INTERVAL 1 DAY)
                FROM date_series
                WHERE date < ?
            ),
            active_students AS (
                SELECT COUNT(*) as total_students
                FROM student s
                WHERE NOT EXISTS (SELECT 1 FROM student_reports sr WHERE sr.student_id = s.student_id AND sr.report_type IN ('termination', 'discharge'))
                    AND (s.date_of_exit IS NULL OR s.date_of_exit > CURDATE())
                    AND s.date_of_entry IS NOT NULL AND s.date_of_entry <= CURDATE()
                    AND s.deleted_at IS NULL
            ),
            daily_stats AS (
                SELECT 
                    d.date as attendance_date,
                    COALESCE(COUNT(DISTINCT CASE WHEN sa.morning_attendance = 1 OR sa.afternoon_attendance = 1 THEN sa.student_id END), 0) as present_count,
                    COALESCE(COUNT(DISTINCT CASE WHEN sl.student_id IS NOT NULL THEN sa.student_id END), 0) as sick_count,
                    (SELECT total_students FROM active_students) as total_students,
                    CASE 
                        WHEN d.date > CURDATE() THEN 0
                        ELSE (SELECT total_students FROM active_students) - 
                             COALESCE(COUNT(DISTINCT CASE WHEN sa.morning_attendance = 1 OR sa.afternoon_attendance = 1 THEN sa.student_id END), 0) - 
                             COALESCE(COUNT(DISTINCT CASE WHEN sl.student_id IS NOT NULL THEN sa.student_id END), 0)
                    END as absent_count
                FROM date_series d
                LEFT JOIN student_attendance sa ON d.date = sa.attendance_date
                LEFT JOIN student_sick_leave sl ON sa.student_id = sl.student_id 
                    AND d.date BETWEEN sl.date_from AND sl.date_until
                WHERE DAYOFWEEK(d.date) NOT IN (1, 7) -- Exclude weekends
                GROUP BY d.date
            )
            SELECT * FROM (
                SELECT
                    NULL as summary_row,
                    DATE_FORMAT(MIN(attendance_date), '%Y-%m-%d') as start_date,
                    DATE_FORMAT(MAX(attendance_date), '%Y-%m-%d') as end_date,
                    SUM(present_count) as total_present,
                    SUM(absent_count) as total_absent,
                    SUM(sick_count) as total_sick,
                    ROUND(AVG(present_count), 2) as avg_present_per_day,
                    ROUND(AVG(absent_count), 2) as avg_absent_per_day,
                    ROUND(AVG(sick_count), 2) as avg_sick_per_day
                FROM daily_stats
                
                UNION ALL
                
                SELECT
                    1 as summary_row,
                    DATE_FORMAT(attendance_date, '%Y-%m-%d') as start_date,
                    DATE_FORMAT(attendance_date, '%W') as end_date,
                    present_count as total_present,
                    absent_count as total_absent,
                    sick_count as total_sick,
                    total_students as avg_present_per_day,
                    NULL as avg_absent_per_day,
                    NULL as avg_sick_per_day
                FROM daily_stats
            ) combined_results
            ORDER BY summary_row, start_date
        `;

        try {
            const [results] = await db.query(query, [startDate, endDate]);
            if (!results.length) return null;
            // First row contains the summary data
            const summary = results[0];
            // Rest of the rows contain daily data
            const dailyData = results.slice(1);

            return summary ? {
                period,
                start_date: summary.start_date,
                end_date: summary.end_date,
                totals: {
                    present: summary.total_present,
                    absent: summary.total_absent,
                    sick: summary.total_sick
                },
                averages: {
                    present: summary.avg_present_per_day,
                    absent: summary.avg_absent_per_day,
                    sick: summary.avg_sick_per_day
                },
                daily_breakdown: dailyData.map(day => ({
                    date: day.start_date,
                    day_name: day.end_date,  // We used end_date for day_name in the query
                    present: day.total_present,
                    absent: day.total_absent,
                    sick: day.total_sick,
                    total_students: day.avg_present_per_day  // We used avg_present_per_day for total_students
                }))
            } : null;
        } catch (error) {
            console.error('Error getting attendance stats:', error);
            throw error;
        }
    }
    // Default time slots
    static MORNING_START = '08:00:00';
    static ADMIN_MORNING_START_MARK = '08:01:00';
    static MORNING_END = '12:30:00';
    static ADMIN_MORNING_END_MARK = '12:31:00';
    static AFTERNOON_START = '13:00:00';
    static AFTERNOON_END = '16:30:00';

    static async markAdminAttendance(studentId, date, slots) {
        const connection = await db.getConnection();
        try {
            await connection.beginTransaction();

            // Check if attendance record exists for the date
            const [existingRows] = await connection.execute(
                'SELECT * FROM student_attendance WHERE student_id = ? AND attendance_date = ?',
                [studentId, date]
            );

            const now = new Date();
            const currentTime = now.toTimeString().split(' ')[0];

            if (existingRows.length === 0) {
                // Create new attendance record
                await connection.execute(
                    `INSERT INTO student_attendance (
                        student_id, attendance_date, 
                        morning_attendance, morning_attendance_time,
                        afternoon_attendance, afternoon_attendance_time,
                        created_at, updated_at
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                    [
                        studentId,
                        date,
                        slots.includes('morning') ? 1 : 0,
                        slots.includes('morning') ? `${date} ${this.ADMIN_MORNING_START_MARK}` : null,
                        slots.includes('afternoon') ? 1 : 0,
                        slots.includes('afternoon') ? `${date} ${this.ADMIN_MORNING_END_MARK}` : null,
                        now,
                        now
                    ]
                );
            } else {
                // Update existing record
                await connection.execute(
                    `UPDATE student_attendance SET 
                        morning_attendance = ?, 
                        morning_attendance_time = ?,
                        afternoon_attendance = ?,
                        afternoon_attendance_time = ?,
                        updated_at = ?
                    WHERE student_id = ? AND attendance_date = ?`,
                    [
                        slots.includes('morning') ? 1 : existingRows[0].morning_attendance,
                        slots.includes('morning') ? `${date} ${this.MORNING_START}` : existingRows[0].morning_attendance_time,
                        slots.includes('afternoon') ? 1 : existingRows[0].afternoon_attendance,
                        slots.includes('afternoon') ? `${date} ${this.AFTERNOON_START}` : existingRows[0].afternoon_attendance_time,
                        now,
                        studentId,
                        date
                    ]
                );
            }

            await connection.commit();
            return true;
        } catch (error) {
            await connection.rollback();
            console.error('Error marking admin attendance:', error);
            throw error;
        } finally {
            connection.release();
        }
    }
    static async getFullDayAbsences(studentId) {
        const query = `
            WITH RECURSIVE date_series AS (
                -- Initial row from student's entry date
                SELECT s.student_id, s.date_of_entry as date
                FROM student s
                WHERE s.student_id = ? 
                AND s.date_of_entry <= CURDATE()
                
                UNION ALL
                
                -- Generate subsequent dates
                SELECT d.student_id, DATE_ADD(d.date, INTERVAL 1 DAY)
                FROM date_series d
                WHERE d.date < CURDATE()
            )
            SELECT 
                d.date,
                s.first_name,
                s.last_name,
                s.measures,
                sa.morning_attendance,
                sa.afternoon_attendance,
                CASE 
                    WHEN sa.morning_attendance = 0 OR sa.morning_attendance IS NULL THEN 
                        CASE WHEN sa.afternoon_attendance = 0 OR sa.afternoon_attendance IS NULL THEN 'Both'
                        ELSE 'Morning' END
                    ELSE 'Afternoon'
                END as missed_session,
                a.bg_number,
                sl.status as sick_leave_status,
                sl.description as sick_leave_description,
                bd.bridge_days  as bridge_day_description
            FROM date_series d
            JOIN student s ON s.student_id = d.student_id
            LEFT JOIN student_attendance sa ON sa.student_id = s.student_id AND sa.attendance_date = d.date
            LEFT JOIN student_sick_leave sl ON s.student_id = sl.student_id 
                AND d.date BETWEEN sl.date_from AND sl.date_until
            LEFT JOIN bridge_days bd ON d.date = bd.date
            LEFT JOIN authorities a ON s.student_id = a.student_id
            WHERE DAYOFWEEK(d.date) NOT IN (1, 7) -- Exclude weekends
            AND bd.date IS NULL -- Exclude bridge days
            AND d.date <= CURDATE() -- Ensure no future dates
            AND (sa.morning_attendance = 0 OR sa.afternoon_attendance = 0 OR sa.morning_attendance IS NULL)
            ORDER BY d.date DESC
        `;

        try {
            // We only need studentId once now, for the initial student_check CTE
            const [results] = await db.query(query, [studentId]);
            return results.map(row => ({
                date: row.date,
                morning_attendance: row.morning_attendance,
                afternoon_attendance: row.afternoon_attendance,
                student: {
                    first_name: row.first_name,
                    last_name: row.last_name,
                    measures: row.measures,
                    bg_number: row.bg_number
                },
                sick_leave: row.sick_leave_status ? {
                    status: row.sick_leave_status,
                    description: row.sick_leave_description
                } : null
            }));
        } catch (error) {
            console.error('Error fetching full day absences:', error);
            throw error;
        }
    }
    static async markAttendance(studentId) {
        // Get current time in German timezone
        const berlinTime = DateTimeUtils.getBerlinDateTime();
        const { totalMinutes } = DateTimeUtils.getHourMinutes(berlinTime);

        // Define time slots
        const morningStart = 8 * 60;     // 08:00
        const morningEnd = 12 * 60 + 30; // 12:30
        const afternoonStart = 13 * 60;   // 13:00
        const afternoonEnd = 16 * 60 + 30; // 16:30
        
        
        
        // Check if current time is within valid slots
        const isMorningSlot = totalMinutes >= morningStart && totalMinutes <= morningEnd;
        const isAfternoonSlot = totalMinutes >= afternoonStart && totalMinutes <= afternoonEnd;

        if (!isMorningSlot && !isAfternoonSlot) {
            throw new Error('Attendance can only be marked between 08:00-12:30 or 13:00-16:30');
        }

        const connection = await db.getConnection();
        try {
            await connection.beginTransaction();

            const today = DateTimeUtils.formatToSQLDate(berlinTime);

            // Check if attendance record exists for today
            const [existingRows] = await connection.execute(
                'SELECT * FROM student_attendance WHERE student_id = ? AND attendance_date = ?',
                [studentId, today]
            );

            if (existingRows.length === 0) {
                // Create new attendance record
                await connection.execute(
                    `INSERT INTO student_attendance 
                    (student_id, attendance_date, 
                     ${isMorningSlot ? 'morning_attendance, morning_attendance_time' : 'afternoon_attendance, afternoon_attendance_time'})
                    VALUES (?, ?, TRUE, ?)`,
                    [studentId, today, berlinTime]
                );
            } else {
                // Update existing attendance record
                await connection.execute(
                    `UPDATE student_attendance 
                     SET ${isMorningSlot ? 'morning_attendance = TRUE, morning_attendance_time = ?' 
                                       : 'afternoon_attendance = TRUE, afternoon_attendance_time = ?'}
                     WHERE student_id = ? AND attendance_date = ?`,
                    [studentId, today, berlinTime]
                );
            }

            await connection.commit();
            return {
                date: today,
                period: isMorningSlot ? 'morning' : 'afternoon',
                marked_at: DateTimeUtils.formatToSQLDateTime(berlinTime)
            };
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }

    static async getStudentAttendance(studentId, startDate, endDate) {
        try {
            const [rows] = await db.query(
                `SELECT * FROM student_attendance 
                 WHERE student_id = ? 
                 AND attendance_date BETWEEN ? AND ?
                 ORDER BY attendance_date DESC`,
                [studentId, startDate, endDate]
            );
            return rows;
        } catch (error) {
            throw error;
        }
    }

    static async getAttendanceList(startDate, endDate, studentId = null) {
        try {
            // First, get all bridge days (public holidays)
            const [bridgeDays] = await db.query(
                'SELECT DATE_FORMAT(date, "%Y-%m-%d") as date FROM bridge_days WHERE date BETWEEN ? AND ?',
                [startDate, endDate]
            );
            const holidaySet = new Set(bridgeDays.map(day => day.date));

            // Get student and attendance data
            const [rows] = await db.query(
                `WITH RECURSIVE dates AS (
                    SELECT ? as date
                    UNION ALL
                    SELECT DATE_ADD(date, INTERVAL 1 DAY)
                    FROM dates
                    WHERE date < ?
                )
                SELECT 
                    s.student_id,
                    s.first_name,
                    s.last_name,
                    s.measures,
                    s.date_of_entry,
                    s.date_of_exit,
                    a.email,
                    m.measures_number,
                    m.measures_title,
                    COALESCE(sa.attendance_date, dates.date) as attendance_date,
                    sa.morning_attendance,
                    DATE_FORMAT(sa.morning_attendance_time, '%Y-%m-%d %H:%i:%s') as morning_attendance_time,
                    sa.afternoon_attendance,
                    DATE_FORMAT(sa.afternoon_attendance_time, '%Y-%m-%d %H:%i:%s') as afternoon_attendance_time,
                    sl.date_from as sick_leave_start,
                    sl.date_until as sick_leave_end,
                    sl.status as sick_leave_status,
                    sl.description as sick_leave_description,
                    a.bg_number
                FROM student s
                CROSS JOIN dates
                LEFT JOIN student_attendance sa ON s.student_id = sa.student_id
                    AND sa.attendance_date = dates.date
                LEFT JOIN authorities a ON s.student_id = a.student_id
                LEFT JOIN measurements m ON s.measures_id = m.id
                LEFT JOIN student_sick_leave sl ON s.student_id = sl.student_id
                    AND (
                        (sl.date_from BETWEEN ? AND ?) OR
                        (sl.date_until BETWEEN ? AND ?) OR
                        (sl.date_from <= ? AND sl.date_until >= ?)
                    )
                    WHERE
                    -- Exclude deleted students
                    s.deleted_at IS NULL
                    -- Exclude students with termination/discharge reports
                    AND NOT EXISTS (SELECT 1 FROM student_reports sr WHERE sr.student_id = s.student_id AND sr.report_type IN ('termination', 'discharge'))
                    -- Exclude students with past exit date
                    AND (s.date_of_exit IS NULL OR s.date_of_exit > CURDATE())
                    -- Include only students with valid entry date
                    AND s.date_of_entry IS NOT NULL AND s.date_of_entry <= CURDATE()
                    ${studentId ? 'AND s.student_id = ?' : ''}
                ORDER BY s.student_id, dates.date`,
                studentId 
                    ? [startDate, endDate, startDate, endDate, startDate, endDate, startDate, endDate, studentId]
                    : [startDate, endDate, startDate, endDate, startDate, endDate, startDate, endDate]
            );

            // Generate all dates between start and end date
            const allDates = [];
            const currentDate = new Date(startDate);
            const end = new Date(endDate);
            while (currentDate <= end) {
                allDates.push(currentDate.toISOString().split('T')[0]);
                currentDate.setDate(currentDate.getDate() + 1);
            }

            // Group by student and include all dates
            const attendanceMap = new Map();
            // Process each student
            console.log("Rows", rows)
            rows.forEach(row => {
                const studentKey = row.student_id;
                const key = `${row.student_id}_${row.attendance_date}`;
                if (!attendanceMap.has(key)) {
                    const dateObj = new Date(row.attendance_date);
                    const isWeekend = dateObj.getDay() === 0 || dateObj.getDay() === 6; // Sunday = 0, Saturday = 6
                    const isHoliday = holidaySet.has(row.attendance_date);
                    
                    attendanceMap.set(key, {
                        student_id: row.student_id,
                        first_name: row.first_name,
                        last_name: row.last_name,
                        measures: row.measures,
                        date_of_entry: row.date_of_entry,
                        date_of_exit: row.date_of_exit,
                        date: row.attendance_date,
                        morning_attendance: row.morning_attendance === 1,
                        morning_attendance_time: row.morning_attendance_time,
                        afternoon_attendance: row.afternoon_attendance === 1,
                        afternoon_attendance_time: row.afternoon_attendance_time,
                        is_weekend: isWeekend,
                        is_holiday: isHoliday,
                        sick_leave: null,
                        bg_number: row.bg_number,
                        authority_email: row.email,
                        measures_number: row.measures_number,
                        measures_title: row.measures_title
                    });
                }

                // Update sick leave information
                if (row.sick_leave_start && row.sick_leave_end) {
                    const sickLeaveStart = new Date(row.sick_leave_start);
                    const sickLeaveEnd = new Date(row.sick_leave_end);

                    allDates.forEach(date => {
                        const dateObj = new Date(date);
                        if (dateObj >= sickLeaveStart && dateObj <= sickLeaveEnd) {
                            const key = `${row.student_id}_${date}`;
                            const entry = attendanceMap.get(key);
                            if (entry) {
                                entry.sick_leave = {
                                    start_date: row.sick_leave_start,
                                    end_date: row.sick_leave_end,
                                    status: row.sick_leave_status,
                                    description: row.sick_leave_description
                                };
                            }
                        }
                    });
                }
            });

            // Convert map to array and sort by student_id and date
            const attendanceList = Array.from(attendanceMap.values())
                .sort((a, b) => {
                    if (a.student_id !== b.student_id) {
                        return a.student_id - b.student_id;
                    }
                    return new Date(a.date) - new Date(b.date);
                });

            // If student_id is provided, filter for that student only
            return studentId 
                ? attendanceList.filter(item => item.student_id === parseInt(studentId))
                : attendanceList;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = Attendance;
