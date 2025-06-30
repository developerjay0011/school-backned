const CourseFeedback = require('../../models/courseFeedbackModel');

class CourseFeedbackController {
    static async create(req, res) {
        try {
            const data = {
                ...req.body,
                student_id: req.user.student_id
            };

            const feedbackId = await CourseFeedback.create(data);
            const feedback = await CourseFeedback.getByStudentId(req.user.student_id);
            
            res.status(201).json({
                success: true,
                message: 'Course feedback submitted successfully',
                data: feedback
            });
        } catch (error) {
            console.error('Error submitting course feedback:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }

    static async getByStudentId(req, res) {
        try {
            const feedback = await CourseFeedback.getByStudentId(req.user.student_id);
            
            if (!feedback) {
                return res.status(200).json({
                    success: false,
                    data: [],
                    message: 'No feedback found'
                });
            }

            res.status(200).json({
                success: true,
                data: feedback
            });
        } catch (error) {
            console.error('Error retrieving student feedback:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }

    static async update(req, res) {
        try {
            const feedback = await CourseFeedback.update(
                req.body,
                req.user.student_id
            );
            
            if (!feedback) {
                return res.status(200).json({
                    success: false,
                    data: [],
                    message: 'No feedback found for this student'
                });
            }

            res.status(200).json({
                success: true,
                message: 'Feedback updated successfully',
                data: feedback
            });
        } catch (error) {
            console.error('Error updating feedback:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }
}

module.exports = CourseFeedbackController;
