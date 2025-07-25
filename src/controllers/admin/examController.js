const Exam = require('../../models/examModel');
const Student = require('../../models/studentModel');
const db = require('../../config/database');
const path = require('path');
const fs = require('fs').promises;
const DateTimeUtils = require('../../utils/dateTimeUtils');
const EmailService = require('../../utils/emailService');

// Get backend URL from environment variable
const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3000';

class ExamController {
    static async updateDoneOn(req, res) {
        try {
            const examId = req.params.examId;
            const done_on = req.params.done_on;

            // Validate date format
            const date = DateTimeUtils.parseToDateTime(done_on);
            if (!date.isValid()) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid date format. Please use ISO format (YYYY-MM-DD or YYYY-MM-DDTHH:mm:ss)'
                });
            }

            const exam = await Exam.getById(examId);

            if (!exam) {
                return res.status(404).json({
                    success: false,
                    message: 'Exam not found'
                });
            }

            await Exam.updateDoneOn(examId, DateTimeUtils.formatToSQLDate(date));
            const updatedExam = await Exam.getById(examId);

            res.json({
                success: true,
                message: 'Exam done on updated successfully',
                data: updatedExam
            });
        } catch (error) {
            console.error('Error updating exam done on:', error);
            res.status(500).json({
                success: false,
                message: 'Error updating exam done on',
                error: error.message
            });
        }
    }
    static async uploadCertificate(req, res) {
        try {
            const examId = req.params.examId;

            // Check if file was uploaded
            if (!req.file) {
                return res.status(400).json({
                    success: false,
                    message: 'No certificate file provided'
                });
            }

            // Get exam to verify it exists
            const exam = await Exam.getById(examId);
            if (!exam) {
                // Delete uploaded file if exam doesn't exist
                await fs.unlink(req.file.path);
                return res.status(404).json({
                    success: false,
                    message: 'Exam not found'
                });
            }

            // Update certificate in database
            await Exam.updateCertificate(examId, req.file);

            res.json({
                success: true,
                message: 'Certificate uploaded successfully',
                data: {
                    certificate_url: `${BACKEND_URL}/uploads/${req.file.filename}`
                }
            });
        } catch (error) {
            console.error('Error uploading certificate:', error);
            // Try to delete uploaded file if there was an error
            if (req.file) {
                try {
                    await fs.unlink(req.file.path);
                } catch (unlinkError) {
                    console.error('Error deleting file after upload error:', unlinkError);
                }
            }
            res.status(500).json({
                success: false,
                message: 'Error uploading certificate',
                error: error.message
            });
        }
    }
    static async updateExamResult(req, res) {
        try {
            const examId = req.params.examId;
            const exam_result = req.params.exam_result;
            const exam = await Exam.getById(examId);

            if (!exam) {
                return res.status(404).json({
                    success: false,
                    message: 'Exam not found'
                });
            }

            await Exam.updateExamResult(examId, exam_result);
            const updatedExam = await Exam.getById(examId);

            res.json({
                success: true,
                message: 'Exam result updated successfully',
                data: updatedExam
            });
        } catch (error) {
            console.error('Error updating exam result:', error);
            res.status(500).json({
                success: false,
                message: 'Error updating exam result',
                error: error.message
            });
        }
    }
    static async create(req, res) {
        try {
            const studentId = req.params.studentId;

            // Check if student exists
            const [student] = await db.execute(
                'SELECT * FROM student WHERE student_id = ?',
                [studentId]
            );

            if (student.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Student not found'
                });
            }

            const examId = await Exam.create(studentId, req.body);
            const exam = await Exam.getById(examId);

            res.status(201).json({
                success: true,
                message: 'Exam scheduled successfully',
                data: exam
            });
        } catch (error) {
            console.error('Error creating exam:', error);
            res.status(500).json({
                success: false,
                message: 'Error scheduling exam',
                error: error.message
            });
        }
    }

    static async update(req, res) {
        try {
            const examId = req.params.examId;
            const exam = await Exam.getById(examId);

            if (!exam) {
                return res.status(404).json({
                    success: false,
                    message: 'Exam not found'
                });
            }

            await Exam.update(examId, req.body);
            const updatedExam = await Exam.getById(examId);

            res.json({
                success: true,
                message: 'Exam updated successfully',
                data: updatedExam
            });
        } catch (error) {
            console.error('Error updating exam:', error);
            res.status(500).json({
                success: false,
                message: 'Error updating exam',
                error: error.message
            });
        }
    }

    static async delete(req, res) {
        try {
            const examId = req.params.examId;
            const exam = await Exam.getById(examId);

            if (!exam) {
                return res.status(404).json({
                    success: false,
                    message: 'Exam not found'
                });
            }

            await Exam.delete(examId);

            res.json({
                success: true,
                message: 'Exam deleted successfully'
            });
        } catch (error) {
            console.error('Error deleting exam:', error);
            res.status(500).json({
                success: false,
                message: 'Error deleting exam',
                error: error.message
            });
        }
    }

    static async getByStudent(req, res) {
        try {
            const studentId = req.params.studentId;

            // Check if student exists
            const [student] = await db.execute(
                'SELECT * FROM student WHERE student_id = ?',
                [studentId]
            );

            if (student.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Student not found'
                });
            }

            const exams = await Exam.getByStudent(studentId);

            res.json({
                success: true,
                data: exams
            });
        } catch (error) {
            console.error('Error fetching exams:', error);
            res.status(500).json({
                success: false,
                message: 'Error fetching exams',
                error: error.message
            });
        }
    }

    static async sendCompletionEmail(req, res) {
        try {
            const examId = req.params.examId;
            const { completion_date } = req.body;

            if (!completion_date) {
                return res.status(400).json({
                    success: false,
                    message: 'Completion date is required'
                });
            }

            // Validate date format
            const date = DateTimeUtils.parseToDateTime(completion_date);
            if (!date.isValid()) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid date format. Please use ISO format (YYYY-MM-DD)'
                });
            }

            // Get exam details including student and measures info
            const exam = await Exam.getById(examId);
            if (!exam) {
                return res.status(404).json({
                    success: false,
                    message: 'Exam not found'
                });
            }

            // Update exam completion date
            await Exam.updateDoneOn(examId, DateTimeUtils.formatToSQLDate(date));
            
            // Get updated exam data
            const updatedExam = await Exam.getById(examId);
            console.log("updatedExam", updatedExam);
            if (!updatedExam.authority_email) {
                return res.status(400).json({
                    success: false,
                    message: 'Authority email not found for student'
                });
            }

            // Send email
            await EmailService.sendExamCompletionEmail({
                email: updatedExam.authority_email,
                bgNumber: updatedExam.bg_number,
                measureTitle: updatedExam.measures_title,
                measureNumber: updatedExam.measures_number,
                completionDate: updatedExam.done_on
            });

            res.json({
                success: true,
                message: 'Exam completion date updated and email sent successfully',
                data: updatedExam
            });

        } catch (error) {
            console.error('Error sending exam completion email:', error);
            res.status(500).json({
                success: false,
                message: 'Error sending exam completion email',
                error: error.message
            });
        }
    }

    // Update exam remark
    static async updateRemark(req, res) {
        try {
            const examId = parseInt(req.params.examId, 10);
            const { remark } = req.body;

            if (!examId || isNaN(examId) || !remark) {
                return res.status(400).json({
                    success: false,
                    message: 'Exam ID and remark are required'
                });
            }

            const success = await Exam.updateRemark(examId, remark);

            if (!success) {
                return res.status(404).json({
                    success: false,
                    message: 'Exam not found'
                });
            }

            res.status(200).json({
                success: true,
                message: 'Exam remark updated successfully'
            });
        } catch (error) {
            console.error('Error updating exam remark:', error);
            res.status(500).json({
                success: false,
                message: 'Error updating exam remark',
                error: error.message
            });
        }
    }
}

module.exports = ExamController;
