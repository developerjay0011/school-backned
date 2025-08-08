const db = require('../config/database');

class LecturerStudentModel {
    static async getStudentsByLecturerId(lecturerId) {
     let connection;
        try {
            connection = await db.getConnection();
            const [rows] = await connection.execute(`
                SELECT 
                    s.student_id,
                    s.first_name,
                    s.last_name,
                    s.date_of_entry,
                    s.date_of_exit,
                    s.measures_id,
                    s.lecturer,
                    s.lecturer_remark,
                    s.voucher_type,
                    s.salutation,
                    s.intermediary_internal,
                    m.measures_number,
                    m.measures_title,
                    c.phone
                FROM student s
                INNER JOIN lecturers l ON l.lecturer_id = ?
                INNER JOIN measurements m ON m.id = s.measures_id
                INNER JOIN student_contact_details c ON c.student_id = s.student_id
                WHERE s.lecturer = l.lecturer_id
                    AND s.deleted_at IS NULL
                ORDER BY s.date_of_entry, s.date_of_exit, s.student_id
            `, [lecturerId]);
            
            console.log('Found students:', rows.length);
            
            console.log('Total rows found:', rows.length);
            console.log('Raw rows:', JSON.stringify(rows, null, 2));

            // Group students by date_of_entry and date_of_exit
            const groupedStudents = [];
            let currentGroup = null;

            for (const student of rows) {
                // Format dates consistently
                const entryDate = new Date(student.date_of_entry).toISOString();
                const exitDate = new Date(student.date_of_exit).toISOString();

                // Check if we need to start a new group
                if (!currentGroup || 
                    currentGroup.date_of_entry !== entryDate || 
                    currentGroup.date_of_exit !== exitDate) {
                    // If we have a current group, push it to the results
                    if (currentGroup) {
                        groupedStudents.push(currentGroup);
                    }
                    // Start a new group
                    currentGroup = {
                        date_of_entry: entryDate,
                        date_of_exit: exitDate,
                        measures_id: student.measures_id,
                        measures_number: student.measures_number,
                        measures_title: student.measures_title,
                        students: []
                    };
                }

                // Add student to current group
                currentGroup.students.push({
                    student_id: student.student_id,
                    first_name: student.first_name,
                    last_name: student.last_name,
                    date_of_entry: student.date_of_entry,
                    date_of_exit: student.date_of_exit,
                    measures_id: student.measures_id,
                    measures_number: student.measures_number,
                    measures_title: student.measures_title,
                    intermediary_internal: student.intermediary_internal,
                    lecturer_remark: student.lecturer_remark,
                    voucher_type: student.voucher_type,
                    salutation: student.salutation,
                    phone: student.phone
                });
            }

            // Don't forget to add the last group
            if (currentGroup) {
                groupedStudents.push(currentGroup);
            }

            return groupedStudents;
        } catch (error) {
            throw error;
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

module.exports = LecturerStudentModel;
