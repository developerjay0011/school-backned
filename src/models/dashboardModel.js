const db = require('../config/database');

class DashboardModel {
    static async getTotalCounts() {
        const connection = await db.getConnection();
        try {
            // Get active and inactive students
            const [studentRows] = await connection.execute(`
                SELECT
                    COUNT(*) as total,
                    CAST(SUM(CASE
                        WHEN NOT EXISTS (SELECT 1 FROM student_reports sr WHERE sr.student_id = s.student_id AND sr.report_type IN ('termination', 'discharge'))
                            AND (s.date_of_exit IS NULL OR s.date_of_exit > CURDATE())
                            AND (s.date_of_entry IS NOT NULL AND s.date_of_entry <= CURDATE())
                            THEN 1
                        ELSE 0
                    END) AS SIGNED) as active,
                    CAST(SUM(CASE
                        WHEN EXISTS (SELECT 1 FROM student_reports sr WHERE sr.student_id = s.student_id AND sr.report_type IN ('termination', 'discharge'))
                            OR (s.date_of_exit IS NOT NULL AND s.date_of_exit <= CURDATE() AND s.deleted_at IS NULL)
                            OR (s.date_of_entry IS NULL OR s.date_of_entry > CURDATE())
                            THEN 1
                        ELSE 0
                    END) AS SIGNED) as inactive
                FROM student s
                WHERE s.deleted_at IS NULL
            `);
            
            // Get total lecturers
            const [lecturerRows] = await connection.execute('SELECT COUNT(*) as total FROM lecturers WHERE deleted_at IS NULL');

            // Get total admin users
            const [adminRows] = await connection.execute('SELECT COUNT(*) as total FROM admin_users WHERE deleted_at IS NULL');
            
            // Get total measurements
            const [measurementRows] = await connection.execute('SELECT COUNT(*) as total FROM measurements WHERE deleted_at IS NULL');

            return {
                totalStudents: studentRows[0].total,
                activeStudents: studentRows[0].active,
                inactiveStudents: studentRows[0].inactive,
                totalLecturers: lecturerRows[0].total,
                totalAdmins: adminRows[0].total,
                totalMeasurements: measurementRows[0].total
            };
        } catch (error) {
            throw error;
        } finally {
            connection.release();
        }
    }

        static async getStudentsByGender() {
            const connection = await db.getConnection();
            try {
                const [rows] = await connection.execute(`
                    SELECT 
                        s.salutation,
                        COUNT(*) as count
                    FROM student s
                    WHERE
                        NOT EXISTS (SELECT 1 FROM student_reports sr WHERE sr.student_id = s.student_id AND sr.report_type IN ('termination', 'discharge'))
                        AND (s.date_of_exit IS NULL OR s.date_of_exit > CURDATE())
                        AND s.date_of_entry IS NOT NULL AND s.date_of_entry <= CURDATE()
                        AND s.deleted_at IS NULL
                    GROUP BY s.salutation
                `);

                // Transform the data
                const genderData = {
                    male: 0,
                    female: 0,
                    others: 0
                };

                rows.forEach(row => {
                    if (row.salutation === 'Herr') {
                        genderData.male = row.count;
                    } else if (row.salutation === 'Frau') {
                        genderData.female = row.count;
                    } else {
                        genderData.others = row.count;
                    }
                });

                return genderData;
            } catch (error) {
                throw error;
            } finally {
                connection.release();
            }
        }
    }

    module.exports = DashboardModel;
