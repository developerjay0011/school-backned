const db = require('../config/database');

class StudentResultSheetModel {
    static async getByStudentId(studentId) {
        const connection = await db.getConnection();
        try {
            const [rows] = await connection.query(
                'SELECT * FROM student_result_sheet WHERE student_id = ?',
                [studentId]
            );
            if (!rows[0]) return null;

            return {
                ...rows[0],
                skills: JSON.parse(rows[0].skills || '[]'),
                language_skills: JSON.parse(rows[0].language_skills || '[]'),
                it_skills: JSON.parse(rows[0].it_skills || '[]'),
                mobility: JSON.parse(rows[0].mobility || '{}'),
                internships: JSON.parse(rows[0].internships || '[]'),
                applications: JSON.parse(rows[0].applications || '[]'),
                future_application: rows[0].future_application || '',
                alternatives: rows[0].alternatives || '',
                other_comments: rows[0].other_comments || '',
                date_of_participation: rows[0].date_of_participation || '',
                reference_no: rows[0].reference_no || '',
                pdf_url: rows[0].pdf_url ? process.env.BACKEND_URL + rows[0].pdf_url : '',
            };
        } catch (error) {
            throw error;
        } finally {
            connection.release();
        }
    }

    static async create(data) {
        const connection = await db.getConnection();
        try {
            await connection.beginTransaction();
            
            const { 
                student_id, 
                skills, 
                language_skills,
                it_skills,
                mobility, 
                internships, 
                applications, 
                future_application,
                alternatives,
                other_comments,
                date_of_participation,
                reference_no,
                signature
            } = data;

            const [result] = await connection.query(
                `INSERT INTO student_result_sheet 
                (student_id, skills, language_skills, it_skills, mobility, internships, applications, 
                future_application, alternatives, other_comments, signature,
                date_of_participation, reference_no)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    student_id,
                    JSON.stringify(skills || []),
                    JSON.stringify(language_skills || []),
                    JSON.stringify(it_skills || []),
                    JSON.stringify(mobility || {}),
                    JSON.stringify(internships || []),
                    JSON.stringify(applications || []),
                    future_application || '',
                    alternatives || '',
                    other_comments || '',
                    signature || '',
                    date_of_participation || new Date().toISOString().split('T')[0],
                    reference_no || ''
                ]
            );
            
            await connection.commit();
            return result.insertId;
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }

    static async update(data) {
        const connection = await db.getConnection();
        try {
            await connection.beginTransaction();
            
            const { student_id, ...updateData } = data;
            const { 
                skills, 
                language_skills,
                it_skills,
                mobility, 
                internships, 
                applications, 
                future_application,
                alternatives,
                other_comments,
                date_of_participation,
                reference_no,
                pdf_url
            } = updateData;
            const updateFields = [];
            const values = [];

            if (pdf_url !== undefined) {
                updateFields.push('pdf_url = ?');
                values.push(pdf_url);
            }
            if (skills !== undefined) {
                updateFields.push('skills = ?');
                values.push(JSON.stringify(skills));
            }
            if (language_skills !== undefined) {
                updateFields.push('language_skills = ?');
                values.push(JSON.stringify(language_skills));
            }
            if (it_skills !== undefined) {
                updateFields.push('it_skills = ?');
                values.push(JSON.stringify(it_skills));
            }
            if (mobility !== undefined) {
                updateFields.push('mobility = ?');
                values.push(JSON.stringify(mobility));
            }
            if (internships !== undefined) {
                updateFields.push('internships = ?');
                values.push(JSON.stringify(internships));
            }
            if (applications !== undefined) {
                updateFields.push('applications = ?');
                values.push(JSON.stringify(applications));
            }
            if (future_application !== undefined) {
                updateFields.push('future_application = ?');
                values.push(future_application);
            }
            if (alternatives !== undefined) {
                updateFields.push('alternatives = ?');
                values.push(alternatives);
            }
            if (other_comments !== undefined) {
                updateFields.push('other_comments = ?');
                values.push(other_comments);
            }
            if (date_of_participation !== undefined) {
                updateFields.push('date_of_participation = ?');
                values.push(date_of_participation);
            }
            if (reference_no !== undefined) {
                updateFields.push('reference_no = ?');
                values.push(reference_no);
            }

            if (updateFields.length === 0) return false;

            values.push(student_id);
            const [result] = await connection.query(
                `UPDATE student_result_sheet SET ${updateFields.join(', ')} WHERE student_id = ?`,
                values
            );
            
            await connection.commit();
            return result.affectedRows > 0;
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }

    static async delete(studentId) {
        const connection = await db.getConnection();
        try {
            await connection.beginTransaction();
            
            const [result] = await connection.query(
                'DELETE FROM student_result_sheet WHERE student_id = ?',
                [studentId]
            );
            
            await connection.commit();
            return result.affectedRows > 0;
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }
}

module.exports = StudentResultSheetModel;
