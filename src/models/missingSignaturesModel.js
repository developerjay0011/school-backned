const db = require('../config/database');

class MissingSignaturesModel {
    static async getMissingSignatures() {
     let connection;
        try {
            connection = await db.getConnection();
            const [rows] = await connection.execute(`
                WITH StudentMeasures AS (
                    SELECT DISTINCT
                        s.student_id,
                        m.id as measures_id,
                        s.date_of_entry as start_date,
                        DATE_ADD(s.date_of_entry, INTERVAL m.months MONTH) as end_date
                    FROM student s
                    JOIN measurements m ON s.measures_id = m.id
                    WHERE DATE_ADD(s.date_of_entry, INTERVAL m.months MONTH) >= CURDATE()
                    AND s.deleted_at IS NULL
                ),
                ExpectedAttendance AS (
                    SELECT 
                        dr.student_id,
                        dr.measures_id,
                        DATE_ADD(dr.start_date, INTERVAL nums.n DAY) as expected_date
                    FROM StudentMeasures dr
                    CROSS JOIN (
                        SELECT a.N + b.N * 10 + c.N * 100 as n
                        FROM (SELECT 0 as N UNION SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9) a
                        CROSS JOIN (SELECT 0 as N UNION SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9) b
                        CROSS JOIN (SELECT 0 as N UNION SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9) c
                    ) nums
                    WHERE DATE_ADD(dr.start_date, INTERVAL nums.n DAY) <= dr.end_date
                    AND DAYOFWEEK(DATE_ADD(dr.start_date, INTERVAL nums.n DAY)) NOT IN (1, 7) -- Exclude weekends
                )
                SELECT 
                    s.student_id as id,
                    s.first_name,
                    s.last_name,
                    s.intermediary_internal,
                    m.measures_title as measures,
                    GROUP_CONCAT(
                        DISTINCT CONCAT(
                            DATE_FORMAT(ea.expected_date, '%d.%m.%Y'),
                            CASE 
                                WHEN sa.id IS NULL THEN ' (Both)' -- No attendance record at all
                                WHEN sa.morning_attendance = 0 AND sa.afternoon_attendance = 0 THEN ' (Both)'
                                WHEN sa.morning_attendance = 0 THEN ' (Morning)'
                                WHEN sa.afternoon_attendance = 0 THEN ' (Afternoon)'
                                ELSE '' -- Should not happen due to WHERE clause
                            END
                        )
                        ORDER BY ea.expected_date
                    ) as missing_dates,
                    MIN(ea.expected_date) as date_from,
                    MAX(ea.expected_date) as date_until,
                    GROUP_CONCAT(
                        DISTINCT
                        CASE 
                            WHEN sl.status IS NOT NULL THEN CONCAT('Sick Leave: ', sl.description)
                            WHEN bd.bridge_days IS NOT NULL THEN CONCAT('Bridge Day: ', bd.bridge_days)
                            ELSE NULL
                        END
                        ORDER BY ea.expected_date
                    ) as absence_reasons,
                    a.bg_number
                FROM ExpectedAttendance ea
                JOIN student s ON ea.student_id = s.student_id
                JOIN measurements m ON ea.measures_id = m.id
                LEFT JOIN student_attendance sa ON 
                    ea.student_id = sa.student_id AND 
                    ea.expected_date = sa.attendance_date
                LEFT JOIN student_sick_leave sl ON 
                    s.student_id = sl.student_id AND
                    ea.expected_date BETWEEN sl.date_from AND sl.date_until
                LEFT JOIN bridge_days bd ON ea.expected_date = bd.date
                LEFT JOIN authorities a ON s.student_id = a.student_id
                WHERE 
                    ea.expected_date <= CURDATE()
                    AND s.deleted_at IS NULL
                    AND (
                        sa.id IS NULL OR
                        (sa.morning_attendance = 0 OR sa.afternoon_attendance = 0)
                    )
                    AND bd.date IS NULL -- Exclude bridge days
                GROUP BY 
                    s.student_id,
                    s.first_name,
                    s.last_name,
                    s.intermediary_internal,
                    m.measures_title,
                    a.bg_number
                ORDER BY s.student_id;
            `);

            return rows;
        } finally {
            if (connection) {
                try {
                    connection.release();
                    console.log('Connection released in User.delete');
                } catch (releaseError) {
                    console.error('Error releasing connection in User.delete:', releaseError);
                }
            }
        }
    }
}

module.exports = MissingSignaturesModel;
