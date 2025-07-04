const db = require('../config/database');

class InterimAssessmentModel {
    static async create(data) {
        try {
            const {
                student_id,
                lecturer_id,
                learning_status,
                test_results,
                lecturer_rating,
                oral_participation,
                handling_learning_difficulties,
                absences,
                current_learning_progress,
                is_measure_at_risk,
                support_measures,
                lecturer_signature
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
                FROM interim_assessment 
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
                INSERT INTO interim_assessment (
                    student_id,
                    lecturer_id,
                    learning_status,
                    test_results,
                    lecturer_rating,
                    oral_participation,
                    handling_learning_difficulties,
                    absences,
                    current_learning_progress,
                    is_measure_at_risk,
                    support_measures,
                    lecturer_signature
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `, [
                student_id,
                lecturer_id,
                learning_status,
                test_results,
                lecturer_rating,
                oral_participation,
                handling_learning_difficulties,
                absences,
                current_learning_progress,
                is_measure_at_risk,
                support_measures,
                lecturer_signature
            ]);

            return result.insertId;
        } catch (error) {
            console.error('Error creating interim assessment:', error);
            throw error;
        }
    }

    static async update(id, lecturerId, data) {
        try {
            const {
                learning_status,
                test_results,
                lecturer_rating,
                oral_participation,
                handling_learning_difficulties,
                absences,
                current_learning_progress,
                is_measure_at_risk,
                support_measures,
                lecturer_signature
            } = data;

            const [result] = await db.execute(`
                UPDATE interim_assessment 
                SET 
                    learning_status = ?,
                    test_results = ?,
                    lecturer_rating = ?,
                    oral_participation = ?,
                    handling_learning_difficulties = ?,
                    absences = ?,
                    current_learning_progress = ?,
                    is_measure_at_risk = ?,
                    support_measures = ?,
                    lecturer_signature = ?,
                    updated_at = CURRENT_TIMESTAMP
                WHERE id = ? 
                    AND lecturer_id = ?
            `, [
                learning_status,
                test_results,
                lecturer_rating,
                oral_participation,
                handling_learning_difficulties,
                absences,
                current_learning_progress,
                is_measure_at_risk,
                support_measures,
                lecturer_signature,
                id,
                lecturerId
            ]);

            return result.affectedRows > 0;
        } catch (error) {
            console.error('Error updating interim assessment:', error);
            throw error;
        }
    }

    static async storePdf(assessmentId, data) {
        try {
            const { student_id, lecturer_id, pdf_url, description } = data;
            
            const [result] = await db.execute(
                `INSERT INTO interim_assessment_pdfs (
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
                `SELECT * FROM interim_assessment_pdfs
                WHERE assessment_id = ?
                ORDER BY created_at DESC`,
                [assessmentId]
            );
            
            return rows;
        } catch (error) {
            console.error('Error getting PDFs:', error);
            throw error;
        }
    }

    static async getAllPdfsByStudentId(studentId, lecturerId) {
        try {
            const [rows] = await db.execute(`
                SELECT 
                    iap.*,
                    ia.student_id,
                    s.first_name,
                    s.last_name,
                    m.measures_number,
                    m.measures_title
                FROM interim_assessment_pdfs iap
                INNER JOIN interim_assessment ia ON ia.id = iap.assessment_id
                INNER JOIN student s ON s.student_id = ia.student_id
                INNER JOIN measurements m ON m.id = s.measures_id
                WHERE ia.student_id = ?
                    AND ia.lecturer_id = ?
                ORDER BY iap.created_at DESC
            `, [studentId, lecturerId]);

            return rows;
        } catch (error) {
            console.error('Error getting PDFs by student ID:', error);
            throw error;
        }
    }

    static async getByStudentId(studentId, lecturerId) {
        try {
            const [rows] = await db.execute(`
                SELECT *
                FROM interim_assessment_pdfs iap
                WHERE iap.student_id = ?
                    AND iap.lecturer_id = ?
            `, [studentId, lecturerId]);
            rows.forEach(row => {
                row.pdf_url = process.env.BACKEND_URL + row.pdf_url;
            });
            return rows || null;
        } catch (error) {
            console.error('Error getting interim assessment:', error);
            throw error;
        }
    }

    static async getByLecturerId(lecturerId) {
        try {
            const [rows] = await db.execute(`
                SELECT 
                    ia.*,
                    s.first_name,
                    s.last_name,
                    m.measures_number,
                    m.measures_title
                FROM interim_assessment ia
                INNER JOIN student s ON s.student_id = ia.student_id
                INNER JOIN measurements m ON m.id = s.measures_id
                WHERE ia.lecturer_id = ?
                ORDER BY ia.created_at DESC
            `, [lecturerId]);

            return rows;
        } catch (error) {
            console.error('Error getting interim assessments:', error);
            throw error;
        }
    }

    static async delete(id, lecturerId) {
        try {
            const [result] = await db.execute(`
                DELETE FROM interim_assessment_pdfs
                WHERE id = ? AND lecturer_id = ?
            `, [id, lecturerId]);

            return result.affectedRows > 0;
        } catch (error) {
            console.error('Error deleting interim assessment:', error);
            throw error;
        }
    }
}

module.exports = InterimAssessmentModel;
