const db = require('../config/database');

class DashboardModel {
    static async getTotalCounts() {
        try {
            // Get active and inactive students
            const [studentRows] = await db.query(`
                SELECT
                    COUNT(*) as total,
                    SUM(CASE 
                        WHEN NOT EXISTS (SELECT 1 FROM student_reports sr WHERE sr.student_id = s.student_id AND sr.report_type IN ('termination', 'discharge'))
                            AND (s.date_of_exit IS NULL OR s.date_of_exit > CURDATE())
                            THEN 1
                        ELSE 0
                    END) as active,
                    COUNT(*) - SUM(CASE 
                        WHEN NOT EXISTS (SELECT 1 FROM student_reports sr WHERE sr.student_id = s.student_id AND sr.report_type IN ('termination', 'discharge'))
                            AND (s.date_of_exit IS NULL OR s.date_of_exit > CURDATE())
                            THEN 1
                        ELSE 0
                    END) as inactive
                FROM student s
                WHERE s.deleted_at IS NULL
            `);
            
            // Get total lecturers
            const [lecturerRows] = await db.query('SELECT COUNT(*) as total FROM lecturers WHERE deleted_at IS NULL');

            // Get total admin users
                const [adminRows] = await db.query('SELECT COUNT(*) as total FROM admin_users WHERE deleted_at IS NULL');
                
                // Get total measurements
                const [measurementRows] = await db.query('SELECT COUNT(*) as total FROM measurements WHERE deleted_at IS NULL');

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
            }
        }

        static async getStudentsByGender() {
            try {
                const [rows] = await db.query(`
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
            }
        }
    }

    module.exports = DashboardModel;
