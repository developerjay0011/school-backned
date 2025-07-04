const db = require('../config/database');

class EndAssessmentModel {
    static async create(data) {
        try {
            const {
                student_id,
                lecturer_id,
                greatest_success_experience,
                personal_development,
                biggest_challenge,
                oral_participation,
                written_performance,
                handling_learning_difficulties,
                development_weaker_areas,
                utilization_support_services,
                overall_assessment,
                instructor_signature,
                participant_name
            } = data;

            // First verify if the student belongs to this lecturer
            const [student] = await db.execute(`
                SELECT student_id 
                FROM student s
                WHERE s.student_id = ?
                    AND s.lecturer = ?
                    AND s.deleted_at IS NULL
            `, [student_id, lecturer_id]);

            if (!student.length) {
                throw new Error('Student not found or not assigned to this lecturer');
            }

            // Check if assessment already exists
            const [existing] = await db.execute(`
                SELECT id 
                FROM end_assessment 
                WHERE student_id = ? 
                    AND lecturer_id = ?
                    AND deleted_at IS NULL
            `, [student_id, lecturer_id]);

            if (existing.length > 0) {
                // Update existing assessment
                await this.update(existing[0].id, lecturer_id, data);
                return existing[0].id;
            }

            const [result] = await db.execute(`
                INSERT INTO end_assessment (
                    student_id,
                    lecturer_id,
                    greatest_success_experience,
                    personal_development,
                    biggest_challenge,
                    oral_participation,
                    written_performance,
                    handling_learning_difficulties,
                    development_weaker_areas,
                    utilization_support_services,
                    overall_assessment,
                    instructor_signature,
                    participant_name
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `, [
                student_id,
                lecturer_id,
                greatest_success_experience,
                personal_development,
                biggest_challenge,
                oral_participation,
                written_performance,
                handling_learning_difficulties,
                development_weaker_areas,
                utilization_support_services,
                overall_assessment,
                instructor_signature,
                participant_name
            ]);

            return result.insertId;
        } catch (error) {
            console.error('Error creating end assessment:', error);
            throw error;
        }
    }

    static async update(id, lecturerId, data) {
        try {
            const {
                greatest_success_experience,
                personal_development,
                biggest_challenge,
                oral_participation,
                written_performance,
                handling_learning_difficulties,
                development_weaker_areas,
                utilization_support_services,
                overall_assessment,
                instructor_signature,
                participant_name
            } = data;

            const [result] = await db.execute(`
                UPDATE end_assessment 
                SET 
                    greatest_success_experience = ?,
                    personal_development = ?,
                    biggest_challenge = ?,
                    oral_participation = ?,
                    written_performance = ?,
                    handling_learning_difficulties = ?,
                    development_weaker_areas = ?,
                    utilization_support_services = ?,
                    overall_assessment = ?,
                    instructor_signature = ?,
                    participant_name = ?,
                    updated_at = CURRENT_TIMESTAMP
                WHERE id = ? 
                    AND lecturer_id = ?
                    AND deleted_at IS NULL
            `, [
                greatest_success_experience,
                personal_development,
                biggest_challenge,
                oral_participation,
                written_performance,
                handling_learning_difficulties,
                development_weaker_areas,
                utilization_support_services,
                overall_assessment,
                instructor_signature,
                participant_name,
                id,
                lecturerId
            ]);

            return result.affectedRows > 0;
        } catch (error) {
            console.error('Error updating end assessment:', error);
            throw error;
        }
    }

    static async storePdf(assessmentId, data) {
        try {
            const { student_id, lecturer_id, pdf_url, description } = data;
            
            const [result] = await db.execute(
                `INSERT INTO end_assessment_pdfs (
                    assessment_id,
                    student_id,
                    lecturer_id,
                    pdf_url,
                    description
                ) VALUES (?, ?, ?, ?, ?)`,
                [assessmentId, student_id, lecturer_id, pdf_url, description]
            );
            
            return result.insertId;
        } catch (error) {
            console.error('Error storing PDF:', error);
            throw error;
        }
    }

    static async getPdfsByAssessmentId(assessmentId) {
        try {
            const [rows] = await db.execute(
                `SELECT * FROM end_assessment_pdfs
                WHERE assessment_id = ?
                    AND deleted_at IS NULL
                ORDER BY created_at DESC`,
                [assessmentId]
            );
            
            return rows;
        } catch (error) {
            console.error('Error getting PDFs:', error);
            throw error;
        }
    }

    static async getByStudentId(studentId, lecturerId) {
        try {
            const [rows] = await db.execute(`
                SELECT 
                    ea.*,
                    s.first_name,
                    s.last_name,
                    m.measures_number,
                    m.measures_title
                FROM end_assessment ea
                INNER JOIN student s ON s.student_id = ea.student_id
                INNER JOIN measurements m ON m.id = s.measures_id
                WHERE ea.student_id = ?
                    AND ea.lecturer_id = ?
                    AND ea.deleted_at IS NULL
            `, [studentId, lecturerId]);

            return rows[0] || null;
        } catch (error) {
            console.error('Error getting end assessment:', error);
            throw error;
        }
    }

    static async getByLecturerId(lecturerId) {
        try {
            const [rows] = await db.execute(`
                SELECT 
                    ea.*,
                    s.first_name,
                    s.last_name,
                    m.measures_number,
                    m.measures_title
                FROM end_assessment ea
                INNER JOIN student s ON s.student_id = ea.student_id
                INNER JOIN measurements m ON m.id = s.measures_id
                WHERE ea.lecturer_id = ?
                    AND ea.deleted_at IS NULL
                ORDER BY ea.created_at DESC
            `, [lecturerId]);

            return rows;
        } catch (error) {
            console.error('Error getting end assessments:', error);
            throw error;
        }
    }

    static async getAllPdfsByStudentId(studentId, lecturerId) {
        try {
            const [rows] = await db.execute(`
                SELECT 
                    eap.*,
                    ea.student_id,
                    s.first_name,
                    s.last_name,
                    m.measures_number,
                    m.measures_title
                FROM end_assessment_pdfs eap
                INNER JOIN end_assessment ea ON ea.id = eap.assessment_id
                INNER JOIN student s ON s.student_id = ea.student_id
                INNER JOIN measurements m ON m.id = s.measures_id
                WHERE ea.student_id = ?
                    AND ea.lecturer_id = ?
                    AND ea.deleted_at IS NULL
                    AND eap.deleted_at IS NULL
                ORDER BY eap.created_at DESC
            `, [studentId, lecturerId]);

            return rows;
        } catch (error) {
            console.error('Error getting PDFs by student ID:', error);
            throw error;
        }
    }

    static async delete(id, lecturerId) {
        try {
            const [result] = await db.execute(`
                UPDATE end_assessment 
                SET deleted_at = CURRENT_TIMESTAMP
                WHERE id = ? AND lecturer_id = ?
            `, [id, lecturerId]);

            return result.affectedRows > 0;
        } catch (error) {
            console.error('Error deleting end assessment:', error);
            throw error;
        }
    }
}

module.exports = EndAssessmentModel;
