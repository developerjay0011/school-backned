const Student = require('../../models/studentModel');
const jwt = require('jsonwebtoken');

class StudentController {
    static async getStudentByToken(req, res) {
        try {
            // Get student ID from token
            const studentId = req.user.student_id;

            // Get student data
            const student = await Student.getByStudentId(studentId);
            if (!student) {
                return res.status(404).json({
                    success: false,
                    message: 'Student not found'
                });
            }

            // Remove sensitive information
            delete student.password;
            delete student.token;

            res.json({
                success: true,
                data: student
            });
        } catch (error) {
            console.error('Error fetching student:', error);
            res.status(500).json({
                success: false,
                message: 'Error fetching student data',
                error: error.message
            });
        }
    }
}

module.exports = StudentController;
