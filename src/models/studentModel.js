const db = require('../config/database');
const bcrypt = require('bcrypt');

class Student {
    static async delete(id) {
        try {
            const rows = await db.query(
                'UPDATE student SET deleted_at = NOW() WHERE student_id = ?',
                [id]
            );
            console.log("rows", rows);
            return rows;
        } catch (error) {
            throw error;
        }
    }
    static async getByStudentIdForAuth(studentId) {
        try {
            const [rows] = await db.query(
                'SELECT student_id, password FROM student WHERE student_id = ? AND deleted_at IS NULL',
                [studentId]
            );
            return rows[0];
        } catch (error) {
            throw error;
        }
    }

    static async updatePassword(studentId, password) {
        try {
            // Password should already be hashed by the controller
            await db.query(
                'UPDATE student SET password = ? WHERE student_id = ?',
                [password, studentId]
            );

            return true;
        } catch (error) {
            throw error;
        }
    }

    static async getByStudentId(studentId) {
        try {
            // Get student basic info with contact details, authority, and settings in a single query
            const [rows] = await db.query(
                `SELECT 
                    s.*,
                    m.measures_number,
                    cd.street_name, cd.postal_code, cd.city, cd.birth_date, 
                    cd.place_of_birth, cd.country_of_birth, cd.phone, cd.email,
                    a.name as authority_name, a.bg_number, a.team, 
                    a.contact_person as authority_contact_person,
                    a.email as authority_email, a.tel as authority_tel, 
                    a.routing_id as authority_routing_id,
                    a.street as authority_street, a.postal_code as authority_postal_code, 
                    a.city as authority_city,
                    ir.company, ir.contact_person as invoice_contact_person,
                    ir.routing_id as invoice_routing_id, ir.email as invoice_email,
                    ir.street as invoice_street, ir.postal_code as invoice_postal_code,
                    s.deleted_at,
                    ir.city as invoice_city,
                    ss.permission_to_sign_retroactively, ss.receive_teaching_materials,
                    ss.face_to_face_instruction, ss.online_instruction,
                    ss.surveyed_after_6_months, ss.mediated,
                    l.lecturer_id, l.first_name as lecturer_first_name, l.last_name as lecturer_last_name,
                    l.photo as lecturer_photo, l.start_time as lecturer_start_time,
                    l.end_time as lecturer_end_time,
                    m.id as measures_id, m.measures_number as measures_number, m.measures_title as measures_title,
                    CASE
                        WHEN EXISTS (SELECT 1 FROM student_reports sr WHERE sr.student_id = s.student_id AND sr.report_type IN ('termination', 'discharge')) THEN 'inactive'
                        WHEN s.date_of_exit IS NOT NULL AND s.date_of_exit <= CURDATE() THEN 'inactive'
                        WHEN s.date_of_entry IS NULL OR s.date_of_entry > CURDATE() THEN 'pending'
                        ELSE 'active'
                    END as status
                FROM student s
                LEFT JOIN student_contact_details cd ON s.student_id = cd.student_id
                LEFT JOIN authorities a ON s.student_id = a.student_id
                LEFT JOIN invoice_recipients ir ON s.student_id = ir.student_id
                LEFT JOIN student_settings ss ON s.student_id = ss.student_id
                LEFT JOIN lecturers l ON s.lecturer = l.lecturer_id
                LEFT JOIN measurements m ON s.measures_id = m.id

                WHERE s.student_id = ?`,
                [studentId]
            );

            if (!rows[0]) return null;
            const data = rows[0];

            // Format the complete response
            return {
                student_id: data.student_id,
                voucher_type: data.voucher_type || '',
                salutation: data.salutation || '',
                first_name: data.first_name || '',
                last_name: data.last_name || '',
                date_of_entry: data.date_of_entry || null,
                date_of_exit: data.date_of_exit || null,
                measures: data.measures || '',
                measures_id: data.measures_id,
                measures_number: data.measures_number,
                measures_title: data.measures_title,
                status: data.status,
                intermediary_internal: data.intermediary_internal || '',
                lecturer: data.lecturer ? {
                    lecturer_id: data.lecturer_id,
                    first_name: data.lecturer_first_name,
                    last_name: data.lecturer_last_name,
                    photo: process.env.BACKEND_URL + data.lecturer_photo,
                    start_time: data.lecturer_start_time,
                    end_time: data.lecturer_end_time
                } : null,
                contact_details: {
                    street_name: data.street_name || '',
                    postal_code: data.postal_code || '',
                    city: data.city || '',
                    birth_date: data.birth_date || null,
                    place_of_birth: data.place_of_birth || '',
                    country_of_birth: data.country_of_birth || '',
                    phone: data.phone || '',
                    email: data.email || ''
                },
                authority: {
                    name: data.authority_name || '',
                    bg_number: data.bg_number || '',
                    team: data.team || '',
                    contact_person: data.authority_contact_person || '',
                    email: data.authority_email || '',
                    tel: data.authority_tel || '',
                    routing_id: data.authority_routing_id || '',
                    street: data.authority_street || '',
                    postal_code: data.authority_postal_code || '',
                    city: data.authority_city || ''
                },
                invoice_recipient: {
                    company: data.company || '',
                    contact_person: data.invoice_contact_person || '',
                    routing_id: data.invoice_routing_id || '',
                    email: data.invoice_email || '',
                    street: data.invoice_street || '',
                    postal_code: data.invoice_postal_code || '',
                    city: data.invoice_city || ''
                },
                measures_number: data.measures_number || '',
                settings: {
                    permission_to_sign_retroactively: data.permission_to_sign_retroactively || 0,
                    receive_teaching_materials: data.receive_teaching_materials || 0,
                    face_to_face_instruction: data.face_to_face_instruction || 0,
                    online_instruction: data.online_instruction || 0,
                    surveyed_after_6_months: data.surveyed_after_6_months || 0,
                    mediated: data.mediated || 0
                }
            };
        } catch (error) {
            console.error('Error getting student details:', error);
            throw error;
        }
    }

    static async create(studentData, settingsData, authorityData) {
        const connection = await db.getConnection();
        try {
            // Check if student already exists with the same email
         
            await connection.beginTransaction();
            const plainPassword = `BAD${studentData.student_id}`;
            const hashedPassword = await bcrypt.hash(plainPassword, 10);
            // Insert student data
            const [result] = await connection.execute(
                `INSERT INTO student (
                    student_id, voucher_type, salutation, first_name, last_name,
                    date_of_entry, date_of_exit, measures, measures_id, intermediary_internal,
                    lecturer, password
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    studentData.student_id, studentData.voucher_type, studentData.salutation,
                    studentData.first_name, studentData.last_name, studentData.date_of_entry,
                    studentData.date_of_exit || null, studentData.measures, studentData.measures_id || null, studentData.intermediary_internal,
                    studentData.lecturer || null, hashedPassword
                ]
            );

            const studentId = result.insertId;

            // Generate and hash password


            // Insert student contact details
            await connection.execute(
                `INSERT INTO student_contact_details (
                    student_id, street_name, postal_code, city,
                    birth_date, place_of_birth, country_of_birth, phone, email
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    studentId, 
                    studentData.street_name || null, 
                    studentData.postal_code || null, 
                    studentData.city || null, 
                    studentData.birth_date || null,
                    studentData.place_of_birth || null,
                    studentData.country_of_birth || null,
                    studentData.phone || null, 
                    studentData.email || null
                ]
            );

            // Insert student settings
            await connection.execute(
                `INSERT INTO student_settings (
                    student_id, permission_to_sign_retroactively,
                    receive_teaching_materials, face_to_face_instruction,
                    online_instruction, surveyed_after_6_months,
                    mediated
                ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
                [
                    studentId, settingsData.permission_to_sign_retroactively,
                    settingsData.receive_teaching_materials, settingsData.face_to_face_instruction,
                    settingsData.online_instruction, settingsData.surveyed_after_6_months,
                    settingsData.mediated
                ]
            );

            // Insert authority data
            await connection.execute(
                `INSERT INTO authorities (
                    student_id, name, bg_number, team, contact_person,
                    routing_id, email, tel, street, postal_code, city
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    studentId, 
                    authorityData.name || null,
                    authorityData.bg_number,
                    authorityData.team || null, 
                    authorityData.contact_person || null,
                    authorityData.routing_id || null,
                    authorityData.email || null,
                    authorityData.tel || null, 
                    authorityData.street || null,
                    authorityData.postal_code || null, 
                    authorityData.city || null
                ]
            );

            await connection.commit();
            // Get the measures info if measures_id exists
            console.log('Student Data:', studentData);
            let measuresInfo = {};
            if (studentData.measures_id) {
                console.log('Fetching measures info for ID:', studentData.measures_id);
                const [measures] = await connection.execute(
                    'SELECT id, measures_number, measures_title FROM measurements WHERE id = ?',
                    [studentData.measures_id]
                );
                console.log('Query result:', measures);
                if (measures && measures.length > 0 && measures[0]) {
                    measuresInfo = {
                        measures_id: measures[0].id || null,
                        measures_number: measures[0].measures_number || null,
                        measures_title: measures[0].measures_title || null
                    };
                }
                console.log('Measures Info:', measuresInfo);
            }

            return {
                student_id: studentId,
                ...measuresInfo
            };
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }

    static async generateRecordId() {
        try {
            const [result] = await db.execute(
                'SELECT MAX(CAST(student_id AS UNSIGNED)) as max_id FROM student'
            );
            const maxId = result[0].max_id || 100000; // Start from 100001 if no records
            return (maxId + 1).toString();
        } catch (error) {
            console.error('Error generating student ID:', error);
            throw error;
        }
    }

    static async update(studentId, studentData, settingsData, authorityData, invoiceRecipientData) {
        const connection = await db.getConnection();
        try {
            await connection.beginTransaction();

            // Update student data if provided
            if (Object.keys(studentData).length > 0) {
                const updateFields = [];
                const updateValues = [];

                Object.entries(studentData).forEach(([key, value]) => {
                    if (value !== undefined) {
                        updateFields.push(`${key} = ?`);
                        updateValues.push(value);
                    }
                });

                if (updateFields.length > 0) {
                    await connection.execute(
                        `UPDATE student SET ${updateFields.join(', ')} WHERE student_id = ?`,
                        [...updateValues, studentId]
                    );
                }
            }

            // Update settings if provided
            if (settingsData && Object.keys(settingsData).length > 0) {
                const updateFields = [];
                const updateValues = [];

                Object.entries(settingsData).forEach(([key, value]) => {
                    if (value !== undefined) {
                        updateFields.push(`${key} = ?`);
                        updateValues.push(value);
                    }
                });

                if (updateFields.length > 0) {
                    await connection.execute(
                        `UPDATE student_settings SET ${updateFields.join(', ')} WHERE student_id = ?`,
                        [...updateValues, studentId]
                    );
                }
            }

            // Update or insert authority data if provided
            if (authorityData && Object.keys(authorityData).length > 0) {
                // Check if authority exists
                const [existingAuthority] = await connection.execute(
                    'SELECT * FROM authorities WHERE student_id = ?',
                    [studentId]
                );

                if (existingAuthority.length > 0) {
                    // Update existing authority
                    const updateFields = [];
                    const updateValues = [];

                    Object.entries(authorityData).forEach(([key, value]) => {
                        if (value !== undefined) {
                            updateFields.push(`${key} = ?`);
                            updateValues.push(value);
                        }
                    });

                    if (updateFields.length > 0) {
                        await connection.execute(
                            `UPDATE authorities SET ${updateFields.join(', ')} WHERE student_id = ?`,
                            [...updateValues, studentId]
                        );
                    }
                } else {
                    // Insert new authority
                    const fields = ['student_id', ...Object.keys(authorityData)];
                    const values = [studentId, ...Object.values(authorityData)];

                    await connection.execute(
                        `INSERT INTO authorities (${fields.join(', ')}) VALUES (${Array(fields.length).fill('?').join(', ')})`,
                        values
                    );
                }
            }

            // Update or insert invoice recipient data if provided
            if (invoiceRecipientData && Object.keys(invoiceRecipientData).length > 0) {
                // Check if invoice recipient exists
                const [existingRecipient] = await connection.execute(
                    'SELECT * FROM invoice_recipients WHERE student_id = ?',
                    [studentId]
                );

                if (existingRecipient.length > 0) {
                    // Update existing recipient
                    const updateFields = [];
                    const updateValues = [];

                    Object.entries(invoiceRecipientData).forEach(([key, value]) => {
                        if (value !== undefined) {
                            updateFields.push(`${key} = ?`);
                            updateValues.push(value);
                        }
                    });

                    if (updateFields.length > 0) {
                        await connection.execute(
                            `UPDATE invoice_recipients SET ${updateFields.join(', ')} WHERE student_id = ?`,
                            [...updateValues, studentId]
                        );
                    }
                } else {
                    // Insert new recipient
                    const fields = Object.keys(invoiceRecipientData);
                    const values = Object.values(invoiceRecipientData);

                    await connection.execute(
                        `INSERT INTO invoice_recipients (student_id, ${fields.join(', ')}) VALUES (?, ${Array(fields.length).fill('?').join(', ')})`,
                        [studentId, ...values]
                    );
                }
            }

            await connection.commit();

            // Get the measures info if measures_id exists
            console.log("studentData.measures_id", studentData.measures_id);
            let measuresInfo = {};
            if (studentData.measures_id) {
                const [measures] = await connection.execute(
                    'SELECT id, measures_number, measures_title FROM measurements WHERE id = ?',
                    [studentData.measures_id]
                );
                console.log("measures", measures);
                if (measures && measures.length > 0 && measures[0]) {
                    measuresInfo = {
                        measures_id: measures[0].id || null,
                        measures_number: measures[0].measures_number || null,
                        measures_title: measures[0].measures_title || null
                    };
                }
                console.log("measuresInfo", measuresInfo);
            } else {
                // If no new measures_id provided, get existing measures info
                const [student] = await connection.execute(
                    `SELECT m.id as measures_id, m.measures_number, m.measures_title 
                     FROM student s
                     LEFT JOIN measurements m ON s.measures_id = m.id
                     WHERE s.student_id = ?`,
                    [studentId]
                );
                if (student && student.length > 0 && student[0] && student[0].measures_id) {
                    measuresInfo = {
                        measures_id: student[0].measures_id || null,
                        measures_number: student[0].measures_number || null,
                        measures_title: student[0].measures_title || null
                    };
                }
            }

            return {
                student_id: studentId,
                ...measuresInfo
            };
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }

    static async getAll(page = 1, limit = 10) {
        const connection = await db.getConnection();
        try {
            // const offset = (page - 1) * limit;

            // Get total count
            // const [countResult] = await connection.execute(
            //     'SELECT COUNT(*) as total FROM student'
            // );
            // const totalStudents = countResult[0].total;

            // Get paginated students with their contact details and authority info
            const [students] = await connection.execute(
                `SELECT 
                    s.*,
                    cd.street_name, cd.postal_code, cd.city, cd.birth_date,
                    cd.place_of_birth, cd.country_of_birth, cd.phone, cd.email,
                    a.name as authority_name, a.bg_number, a.team as authority_team,
                    a.contact_person as authority_contact_person, a.routing_id as authority_routing_id, 
                    a.street as authority_street, a.postal_code as authority_postal_code, a.city as authority_city,
                    a.email as authority_email, a.tel as authority_tel,
                    ss.permission_to_sign_retroactively, ss.receive_teaching_materials,
                    ss.face_to_face_instruction, ss.online_instruction,
                    ss.surveyed_after_6_months, ss.mediated,
                    ir.company as invoice_recipient_company, ir.contact_person as invoice_recipient_contact_person,
                    ir.routing_id as invoice_recipient_routing_id, ir.email as invoice_recipient_email,
                    ir.street as invoice_recipient_street, ir.postal_code as invoice_recipient_postal_code,
                    ir.city as invoice_recipient_city,
                    m.id as measures_id, m.measures_number as measures_number, m.measures_title as measures_title,
                    CASE
                        WHEN EXISTS (SELECT 1 FROM student_reports sr WHERE sr.student_id = s.student_id AND sr.report_type IN ('termination', 'discharge')) THEN 'inactive'
                        WHEN s.date_of_exit IS NOT NULL AND s.date_of_exit <= CURDATE() THEN 'inactive'
                        WHEN s.date_of_entry IS NULL OR s.date_of_entry > CURDATE() THEN 'pending'
                        ELSE 'active'
                    END as status
                FROM student s
                LEFT JOIN student_contact_details cd ON s.student_id = cd.student_id
                LEFT JOIN authorities a ON s.student_id = a.student_id
                LEFT JOIN student_settings ss ON s.student_id = ss.student_id
                LEFT JOIN invoice_recipients ir ON s.student_id = ir.student_id
                LEFT JOIN measurements m ON s.measures_id = m.id
                WHERE s.deleted_at IS NULL
                ORDER BY s.date_of_entry DESC`
            );
            console.log("studentsstudents",students)
            // Transform the results to include nested objects
            const transformedStudents = students.map(student => ({
                student_id: student.student_id,
                voucher_type: student.voucher_type,
                salutation: student.salutation,
                first_name: student.first_name,
                last_name: student.last_name,
                date_of_entry: student.date_of_entry,
                date_of_exit: student.date_of_exit,
                measures: student.measures,
                measures_id: student.measures_id,
                status: student.status,
                measures_number: student.measures_number,
                measures_title: student.measures_title,
                intermediary_internal: student.intermediary_internal,
                lecturer: student.lecturer || null,
                contact_details: {
                    street_name: student.street_name,
                    postal_code: student.postal_code,
                    city: student.city,
                    birth_date: student.birth_date,
                    place_of_birth: student.place_of_birth,
                    country_of_birth: student.country_of_birth,
                    phone: student.phone,
                    email: student.email
                },
                authority: {
                    name: student.authority_name,
                    bg_number: student.bg_number,
                    team: student.authority_team,
                    contact_person: student.authority_contact_person,
                    email: student.authority_email,
                    tel: student.authority_tel,
                    routing_id: student.authority_routing_id,
                    street: student.authority_street,
                    postal_code: student.authority_postal_code,
                    city: student.authority_city
                },
                invoice_recipient: {
                    company: student.invoice_recipient_company || '',
                    contact_person: student.invoice_recipient_contact_person || '',
                    routing_id: student.invoice_recipient_routing_id,
                    email: student.invoice_recipient_email || '',
                    street: student.invoice_recipient_street || '',
                    postal_code: student.invoice_recipient_postal_code || '',
                    city: student.invoice_recipient_city || ''
                },
                settings: {
                    permission_to_sign_retroactively: student.permission_to_sign_retroactively,
                    receive_teaching_materials: student.receive_teaching_materials,
                    face_to_face_instruction: student.face_to_face_instruction,
                    online_instruction: student.online_instruction,
                    surveyed_after_6_months: student.surveyed_after_6_months,
                    mediated: student.mediated
                }
            }));

            return {
                students: transformedStudents
            };
        } finally {
            connection.release();
        }
    }
}

module.exports = Student;
