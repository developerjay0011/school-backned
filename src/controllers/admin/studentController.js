const Student = require('../../models/studentModel');
const db = require('../../config/database');

class StudentController {
    static async create(req, res) {
     let connection;
        try {
            connection = await db.getConnection();
            // Format dates to MySQL format (YYYY-MM-DD)
            const formatDate = (date) => {
                if (!date) return null;
                return new Date(date).toISOString().split('T')[0];
            };

            const studentData = {
                student_id: await Student.generateRecordId(),
                voucher_type: req.body.voucher_type,
                salutation: req.body.salutation,
                first_name: req.body.first_name,
                last_name: req.body.last_name,
                date_of_entry: formatDate(req.body.date_of_entry),
                date_of_exit: formatDate(req.body.date_of_exit),
                measures: req.body.measures,
                measures_id: req.body.measures_id,
                intermediary_internal: req.body.intermediary_internal,
                lecturer: req.body.lecturer,
            };

            const settingsData = req.body.settings;
            const authorityData = req.body.authority;

            const result = await Student.create(studentData, settingsData, authorityData);

            res.status(201).json({
                success: true,
                message: 'Student created successfully',
                data: {
                    id: result.student_id,
                    student_id: studentData.student_id,
                    voucher_type: studentData.voucher_type,
                    salutation: studentData.salutation,
                    first_name: studentData.first_name,
                    last_name: studentData.last_name,
                    date_of_entry: studentData.date_of_entry,
                    date_of_exit: studentData.date_of_exit,
                    measures: studentData.measures,
                    measures_id: result.measures_id,
                    measures_number: result.measures_number,
                    measures_title: result.measures_title,
                    intermediary_internal: studentData.intermediary_internal,
                    lecturer: studentData.lecturer,
                    lecturer_remark: studentData.lecturer_remark,
                    street: studentData.street,
                    house_number: studentData.house_number,
                    postal_code: studentData.postal_code,
                    city: studentData.city,
                    birth_date: studentData.birth_date,
                    place_of_birth: studentData.place_of_birth,
                    country_of_birth: studentData.country_of_birth,
                    phone: studentData.phone,
                    email: studentData.email,
                    remarks: studentData.remarks,
                    settings: settingsData,
                    authority: authorityData
                }
            });
        } catch (error) {
            console.error('Error creating student:', error);
            
            // Handle duplicate student errors
            if (error.message.includes('already exists')) {
                return res.status(409).json({
                    success: false,
                    message: error.message
                });
            }

            // Handle other errors
            res.status(500).json({
                success: false,
                message: 'Error creating student',
                error: error.message
            });
        } finally {
            if (connection) {
                connection.release();
            }
        }
    }

    static async update(req, res) {
     let connection;
        try {
            connection = await db.getConnection();
            const studentId = req.params.id;

            // Check if student exists
            const [student] = await connection.execute(
                'SELECT * FROM student WHERE student_id = ?',
                [studentId]
            );

            if (student.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Student not found'
                });
            }

            // Format dates to MySQL format (YYYY-MM-DD)
            const formatDate = (date) => {
                if (!date) return null;
                return new Date(date).toISOString().split('T')[0];
            };

            // Extract data from request body
            const studentData = {
                voucher_type: req.body.voucher_type,
                salutation: req.body.salutation,
                first_name: req.body.first_name,
                last_name: req.body.last_name,
                date_of_entry: formatDate(req.body.date_of_entry),
                date_of_exit: formatDate(req.body.date_of_exit),
                measures: req.body.measures,
                measures_id: req.body.measures_id,
                intermediary_internal: req.body.intermediary_internal,
                lecturer: req.body.lecturer
            };

            // Remove undefined fields
            Object.keys(studentData).forEach(key => {
                if (studentData[key] === undefined) {
                    delete studentData[key];
                }
            });

            await Student.update(
                studentId,
                studentData,
                req.body.settings,
                req.body.authority,
                req.body.invoice_recipient
            );

            // Get updated student data
            const [updatedStudent] = await connection.execute(
                `SELECT 
                    s.*,
                    cd.street_name, cd.postal_code, cd.city, cd.birth_date,
                    cd.place_of_birth, cd.country_of_birth, cd.phone, cd.email,
                    a.name as authority_name, a.bg_number, a.team as authority_team,
                    a.contact_person as authority_contact_person, a.routing_id as authority_routing_id,
                    a.street as authority_street, a.postal_code as authority_postal_code,
                    a.city as authority_city, a.email as authority_email, a.tel as authority_tel,
                    ss.permission_to_sign_retroactively, ss.receive_teaching_materials,
                    ss.face_to_face_instruction, ss.online_instruction,
                    ss.surveyed_after_6_months, ss.mediated,
                    ir.company as invoice_recipient_company, ir.contact_person as invoice_recipient_contact_person,
                    ir.routing_id as invoice_recipient_routing_id, ir.email as invoice_recipient_email,
                    ir.street as invoice_recipient_street, ir.postal_code as invoice_recipient_postal_code,
                    ir.city as invoice_recipient_city,
                    m.id as measures_id, m.measures_number, m.measures_title
                FROM student s
                LEFT JOIN student_contact_details cd ON s.student_id = cd.student_id
                LEFT JOIN authorities a ON s.student_id = a.student_id
                LEFT JOIN student_settings ss ON s.student_id = ss.student_id
                LEFT JOIN invoice_recipients ir ON s.student_id = ir.student_id
                LEFT JOIN measurements m ON s.measures_id = m.id
                WHERE s.student_id = ?`,
                [studentId]
            );

            const formattedStudent = {
                id: updatedStudent[0].id,
                student_id: updatedStudent[0].student_id,
                voucher_type: updatedStudent[0].voucher_type,
                salutation: updatedStudent[0].salutation,
                first_name: updatedStudent[0].first_name,
                last_name: updatedStudent[0].last_name,
                date_of_entry: updatedStudent[0].date_of_entry,
                date_of_exit: updatedStudent[0].date_of_exit,
                measures: updatedStudent[0].measures,
                measures_id: updatedStudent[0].measures_id,
                measures_number: updatedStudent[0].measures_number,
                measures_title: updatedStudent[0].measures_title,
                intermediary_internal: updatedStudent[0].intermediary_internal,
                lecturer: updatedStudent[0].lecturer,
                lecturer_remark: updatedStudent[0].lecturer_remark,
                contact_details: {
                    street_name: updatedStudent[0].street_name,
                    postal_code: updatedStudent[0].postal_code,
                    city: updatedStudent[0].city,
                    birth_date: updatedStudent[0].birth_date,
                    place_of_birth: updatedStudent[0].place_of_birth,
                    country_of_birth: updatedStudent[0].country_of_birth,
                    phone: updatedStudent[0].phone,
                    email: updatedStudent[0].email
                },
                authority: {
                    name: updatedStudent[0].authority_name,
                    bg_number: updatedStudent[0].bg_number,
                    team: updatedStudent[0].authority_team,
                    contact_person: updatedStudent[0].authority_contact_person,
                    email: updatedStudent[0].authority_email,
                    tel: updatedStudent[0].authority_tel,
                    routing_id: updatedStudent[0].authority_routing_id,
                    street: updatedStudent[0].authority_street,
                    postal_code: updatedStudent[0].authority_postal_code,
                    city: updatedStudent[0].authority_city
                },
                invoice_recipient: {
                    company: updatedStudent[0].invoice_recipient_company,
                    contact_person: updatedStudent[0].invoice_recipient_contact_person,
                    routing_id: updatedStudent[0].invoice_recipient_routing_id,
                    email: updatedStudent[0].invoice_recipient_email,
                    street: updatedStudent[0].invoice_recipient_street,
                    postal_code: updatedStudent[0].invoice_recipient_postal_code,
                    city: updatedStudent[0].invoice_recipient_city
                },
                settings: {
                    permission_to_sign_retroactively: updatedStudent[0].permission_to_sign_retroactively,
                    receive_teaching_materials: updatedStudent[0].receive_teaching_materials,
                    face_to_face_instruction: updatedStudent[0].face_to_face_instruction,
                    online_instruction: updatedStudent[0].online_instruction,
                    surveyed_after_6_months: updatedStudent[0].surveyed_after_6_months,
                    mediated: updatedStudent[0].mediated
                }
            };

            res.json({
                success: true,
                message: 'Student updated successfully',
                data: formattedStudent
            });
        } catch (error) {
            console.error('Error updating student:', error);
            
            // Handle duplicate student errors
            if (error.message.includes('already exists')) {
                return res.status(409).json({
                    success: false,
                    message: error.message
                });
            }

            // Handle other errors
            res.status(500).json({
                success: false,
                message: 'Error updating student',
                error: error.message
            });
        } finally {
            if (connection) {
                connection.release();
            }
        }
    }

    static async getAll(req, res) {
     let connection;
        try {
            connection = await db.getConnection();
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;

            const result = await Student.getAll(page, limit);
        console.log("result",  result.students[0]);
            const formattedStudents = result.students.map(student => ({
                student_id: student.student_id,
                voucher_type: student.voucher_type,
                salutation: student.salutation,
                first_name: student.first_name,
                last_name: student.last_name,
                date_of_entry: student.date_of_entry,
                date_of_exit: student.date_of_exit,
                measures: student.measures,
                measures_id: student.measures_id,
                measures_number: student.measures_number,
                measures_title: student.measures_title,
                intermediary_internal: student.intermediary_internal,
                lecturer: student.lecturer,
                lecturer_remark: student.lecturer_remark,
                full_day_absences: student.full_day_absences,
                status: student.status,
                contact_details: {
                    street_name: student.contact_details.street_name || '',
                    postal_code: student.contact_details.postal_code || '',
                    city: student.contact_details.city || '',
                    birth_date: student.contact_details.birth_date || '',
                    place_of_birth: student.contact_details.place_of_birth || '',
                    country_of_birth: student.contact_details.country_of_birth || '',
                    phone: student.contact_details.phone || '',
                    email: student.contact_details.email || ''
                },
                authority: {
                    name: student.authority.name || '',
                    bg_number: student.authority.bg_number || '',
                    team: student.authority.team || '',
                    contact_person: student.authority.contact_person || '',
                    email: student.authority.email || '',
                    tel: student.authority.tel || '',
                    routing_id: student.authority.routing_id || '',
                    street: student.authority.street || '',
                    postal_code: student.authority.postal_code || '',
                    city: student.authority.city || ''
                },
                invoice_recipient: {
                    company: student.invoice_recipient.company || '',
                    contact_person: student.invoice_recipient.contact_person || '',
                    routing_id: student.invoice_recipient.routing_id || '',
                    email: student.invoice_recipient.email || '',
                    street: student.invoice_recipient.street || '',
                    postal_code: student.invoice_recipient.postal_code || '',
                    city: student.invoice_recipient.city || ''
                },
                settings: {
                    permission_to_sign_retroactively: student.settings.permission_to_sign_retroactively || 0,
                    receive_teaching_materials: student.settings.receive_teaching_materials || 0,
                    face_to_face_instruction: student.settings.face_to_face_instruction || 0,
                    online_instruction: student.settings.online_instruction || 0,
                    surveyed_after_6_months: student.settings.surveyed_after_6_months || 0,
                    mediated: student.settings.mediated || 0
                }
            }));
            console.log("formattedStudents", formattedStudents);
            res.json({
                success: true,
                message: 'Students retrieved successfully',
                data: formattedStudents
            });
        } catch (error) {
            console.error('Error fetching students:', error);
            res.status(500).json({
                success: false,
                message: 'Error fetching students',
                error: error.message
            });
        } finally {
            if (connection) {
                connection.release();
            }
        }
    }

    static async getById(req, res) {
     let connection;
        try {
            connection = await db.getConnection();
            const { id } = req.params;
            
            // Get student details
            const student = await Student.getByStudentId(id);
            
            if (!student) {
                return res.status(404).json({
                    success: false,
                    message: 'Student not found'
                });
            }

            // The student object from model is already formatted correctly
            const formattedStudent = student;

            // Log for debugging
            console.log('Raw student data:', student);
            console.log('Formatted student data:', formattedStudent);

            res.json(formattedStudent);
        } catch (error) {
            console.error('Error getting student details:', error);
            res.status(500).json({
                success: false,
                message: 'Error getting student details',
                error: error.message
            });
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

    static async delete(req, res) {
     let connection;
        try {
            connection = await db.getConnection();
            const { id } = req.params;
            
            // Delete student
            const result = await Student.delete(id);
            
            if (!result) {
                console.log("result", result);
                return res.status(404).json({
                    success: false,
                    message: 'Student not found'
                });
            }

            res.json({
                success: true,
                message: 'Student deleted successfully'
            });
        } catch (error) {
            console.error('Error deleting student:', error);
            res.status(500).json({
                success: false,
                message: 'Error deleting student',
                error: error.message
            });
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

module.exports = StudentController;
