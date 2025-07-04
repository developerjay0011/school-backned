const EndAssessmentModel = require('../../models/endAssessmentModel');
const EndAssessmentPdfGenerator = require('../../utils/endAssessmentPdfGenerator');
const StudentModel = require('../../models/studentModel');

class EndAssessmentController {
    static async getAllPdfsByStudentId(req, res) {
        try {
            const lecturerId = req.user.lecturer_id;
            const { studentId } = req.params;

            if (!studentId) {
                return res.status(400).json({
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

            const pdfs = await EndAssessmentModel.getAllPdfsByStudentId(studentId, lecturerId);
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

    static async create(req, res) {
        try {
            const lecturerId = req.user.lecturer_id;
            const {
                student_id,
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
            } = req.body;

            // Validate required fields
            if (!student_id || !participant_name) {
                return res.status(400).json({
                    success: false,
                    message: 'Student ID and participant name are required'
                });
            }

            // Create or update assessment
            const assessmentId = await EndAssessmentModel.create({
                student_id,
                lecturer_id: lecturerId,
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
            });

            // Get updated assessment
            const assessment = await EndAssessmentModel.getByStudentId(student_id, lecturerId);
            
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
                const pdfInfo = await EndAssessmentPdfGenerator.generatePdf(assessment, studentInfo);
                
                // Store PDF info
                await EndAssessmentModel.storePdf(assessmentId, {
                    student_id,
                    lecturer_id: lecturerId,
                    pdf_url: pdfInfo.path,
                    description: `End Assessment PDF for ${studentInfo.first_name} ${studentInfo.last_name}`
                });
                
                // Get PDFs for this assessment
                const pdfs = await EndAssessmentModel.getPdfsByAssessmentId(assessmentId);
                assessment.pdfs = pdfs;
                
                return res.json({
                    success: true,
                    message: 'End assessment created/updated successfully',
                    data: assessment
                });
            } catch (pdfError) {
                console.error('Error generating PDF:', pdfError);
                return res.json({
                    success: true,
                    message: 'End assessment created/updated successfully, but PDF generation failed',
                    error: pdfError.message,
                    data: assessment
                });
            }
        } catch (error) {
            console.error('Error creating/updating end assessment:', error);
            return res.status(500).json({
                success: false,
                message: 'Error creating/updating end assessment',
                error: error.message
            });
        }
    }

    static async update(req, res) {
        try {
            const { id } = req.params;
            const lecturerId = req.user.lecturer_id;
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
            } = req.body;

            const success = await EndAssessmentModel.update(id, lecturerId, {
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
            });

            if (!success) {
                return res.status(404).json({
                    success: false,
                    message: 'End assessment not found or not authorized'
                });
            }

            const assessment = await EndAssessmentModel.getByStudentId(req.body.student_id, lecturerId);

            return res.json({
                success: true,
                message: 'End assessment updated successfully',
                data: assessment
            });
        } catch (error) {
            console.error('Error updating end assessment:', error);
            return res.status(500).json({
                success: false,
                message: 'Error updating end assessment',
                error: error.message
            });
        }
    }

    static async getByStudent(req, res) {
        try {
            const { student_id } = req.params;
            const lecturerId = req.user.lecturer_id;

            const assessment = await EndAssessmentModel.getByStudentId(student_id, lecturerId);

            if (!assessment) {
                return res.status(404).json({
                    success: false,
                    message: 'End assessment not found'
                });
            }

            return res.json({
                success: true,
                message: 'End assessment retrieved successfully',
                data: assessment
            });
        } catch (error) {
            console.error('Error getting end assessment:', error);
            return res.status(500).json({
                success: false,
                message: 'Error getting end assessment',
                error: error.message
            });
        }
    }

    static async getAll(req, res) {
        try {
            const lecturerId = req.user.lecturer_id;
            const assessments = await EndAssessmentModel.getByLecturerId(lecturerId);
            
            // Get PDFs for each assessment
            for (const assessment of assessments) {
                const pdfs = await EndAssessmentModel.getPdfsByAssessmentId(assessment.id);
                assessment.pdfs = pdfs;
            }

            return res.json({
                success: true,
                message: 'End assessments retrieved successfully',
                data: assessments
            });
        } catch (error) {
            console.error('Error getting end assessments:', error);
            return res.status(500).json({
                success: false,
                message: 'Error getting end assessments',
                error: error.message
            });
        }
    }

    static async delete(req, res) {
        try {
            const { id } = req.params;
            const lecturerId = req.user.lecturer_id;

            const success = await EndAssessmentModel.delete(id, lecturerId);

            if (!success) {
                return res.status(404).json({
                    success: false,
                    message: 'End assessment not found or not authorized'
                });
            }

            return res.json({
                success: true,
                message: 'End assessment deleted successfully'
            });
        } catch (error) {
            console.error('Error deleting end assessment:', error);
            return res.status(500).json({
                success: false,
                message: 'Error deleting end assessment',
                error: error.message
            });
        }
    }
}

module.exports = EndAssessmentController;
