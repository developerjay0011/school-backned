const InterimAssessmentModel = require('../../models/interimAssessmentModel');
const InterimAssessmentPdfGenerator = require('../../utils/interimAssessmentPdfGenerator');
const StudentModel = require('../../models/studentModel');

class InterimAssessmentController {
    static async create(req, res) {
        try {
            const lecturerId = req.user.lecturer_id;
            const {
                student_id,
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
            } = req.body;

            // Validate required fields
            if (!student_id) {
                return res.status(400).json({
                    success: false,
                    message: 'Student ID is required'
                });
            }

            // Create or update assessment
            const assessmentId = await InterimAssessmentModel.create({
                student_id,
                lecturer_id: lecturerId,
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
            });

            // Get updated assessment
            const assessment = await InterimAssessmentModel.getByStudentId(student_id, lecturerId);
            
            if (!assessment) {
                throw new Error('Failed to create/update assessment');
            }
            
            // Get student info for PDF
            const studentInfo = await StudentModel.getByStudentId(student_id);
            
            if (!studentInfo) {
                throw new Error('Student not found');
            }
            
            try {
                // Generate PDF
                const pdfInfo = await InterimAssessmentPdfGenerator.generatePdf(assessment, studentInfo);
                
                // Store PDF info
                await InterimAssessmentModel.storePdf(assessmentId, {
                    student_id,
                    lecturer_id: lecturerId,
                    pdf_url: pdfInfo.path,
                    description: `Interim Assessment PDF for ${studentInfo.first_name} ${studentInfo.last_name}`
                });
                
                // Get PDFs for this assessment
                const pdfs = await InterimAssessmentModel.getPdfsByAssessmentId(assessmentId);
                assessment.pdfs = pdfs;
                
                return res.json({
                    success: true,
                    message: 'Interim assessment created/updated successfully',
                    data: assessment
                });
            } catch (pdfError) {
                console.error('Error generating PDF:', pdfError);
                return res.json({
                    success: true,
                    message: 'Interim assessment created/updated successfully, but PDF generation failed',
                    error: pdfError.message,
                    data: assessment
                });
            }
        } catch (error) {
            console.error('Error creating/updating interim assessment:', error);
            return res.status(500).json({
                success: false,
                message: 'Error creating/updating interim assessment',
                error: error.message
            });
        }
    }

    static async update(req, res) {
        try {
            const { id } = req.params;
            const lecturerId = req.user.lecturer_id;
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
            } = req.body;

            const success = await InterimAssessmentModel.update(id, lecturerId, {
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
            });

            if (!success) {
                return res.status(200).json({
                    success: false,
                    message: 'Interim assessment not found or not authorized'
                });
            }

            const assessment = await InterimAssessmentModel.getByStudentId(req.body.student_id, lecturerId);

            return res.json({
                success: true,
                message: 'Interim assessment updated successfully',
                data: assessment
            });
        } catch (error) {
            console.error('Error updating interim assessment:', error);
            return res.status(500).json({
                success: false,
                message: 'Error updating interim assessment',
                error: error.message
            });
        }
    }

    static async getByStudent(req, res) {
        try {
            const { student_id } = req.params;
            const lecturerId = req.user.lecturer_id;

            const assessment = await InterimAssessmentModel.getByStudentId(student_id, lecturerId);

            if (!assessment) {
                return res.status(200).json({
                    success: false,
                    message: 'Interim assessment not found'
                });
            }

            return res.json({
                success: true,
                message: 'Interim assessment retrieved successfully',
                data: assessment
            });
        } catch (error) {
            console.error('Error getting interim assessment:', error);
            return res.status(500).json({
                success: false,
                message: 'Error getting interim assessment',
                error: error.message
            });
        }
    }

    static async getAll(req, res) {
        try {
            const lecturerId = req.user.lecturer_id;
            const assessments = await InterimAssessmentModel.getByLecturerId(lecturerId);
            
            // Get PDFs for each assessment
            for (const assessment of assessments) {
                const pdfs = await InterimAssessmentModel.getPdfsByAssessmentId(assessment.id);
                assessment.pdfs = pdfs;
            }

            return res.json({
                success: true,
                message: 'Interim assessments retrieved successfully',
                data: assessments
            });
        } catch (error) {
            console.error('Error getting interim assessments:', error);
            return res.status(500).json({
                success: false,
                message: 'Error getting interim assessments',
                error: error.message
            });
        }
    }

    static async getAllPdfsByStudentId(req, res) {
        try {
            const lecturerId = req.user.lecturer_id;
            const { studentId } = req.params;

            if (!studentId) {
                return res.status(200).json({
                    success: false,
                    message: 'Student ID is required'
                });
            }

            // Verify if student exists and belongs to lecturer
            const student = await StudentModel.getByStudentId(studentId);
            // if (!student || student.lecturer !== lecturerId) {
            //     return res.status(404).json({
            //         success: false,
            //         message: 'Student not found or not assigned to this lecturer'
            //     });
            // }

            const pdfs = await InterimAssessmentModel.getAllPdfsByStudentId(studentId, lecturerId);
            pdfs.forEach(pdf => {
                pdf.pdf_url = `${process.env.BACKEND_URL}${pdf.pdf_url}`;
            });

            return res.json({
                success: true,
                data: pdfs
            });
        } catch (error) {
            console.error('Error getting PDFs by student ID:', error);
            return res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }

    static async delete(req, res) {
        try {
            const { id } = req.params;
            const lecturerId = req.user.lecturer_id;

            const success = await InterimAssessmentModel.delete(id, lecturerId);

            if (!success) {
                return res.status(200).json({
                    success: false,
                    message: 'Interim assessment not found or not authorized'
                });
            }

            return res.json({
                success: true,
                message: 'Interim assessment deleted successfully'
            });
        } catch (error) {
            console.error('Error deleting interim assessment:', error);
            return res.status(500).json({
                success: false,
                message: 'Error deleting interim assessment',
                error: error.message
            });
        }
    }
}

module.exports = InterimAssessmentController;
