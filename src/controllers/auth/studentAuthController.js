const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const StudentModel = require('../../models/studentModel');

class StudentAuthController {
    static async login(req, res) {
        const connection = await require('../../config/database').getConnection();
        try {
            const { student_id, password } = req.body;
            console.log('Login attempt for student_id:', student_id);

            // Get student by student_id for authentication
            const student = await StudentModel.getByStudentIdForAuth(student_id);
            console.log('Found student:', student);
            if (!student) {
                return res.status(401).json({
                    success: false,
                    message: 'Invalid student ID or password'
                });
            }

            // Verify password
            console.log('Comparing password:', password, 'with hashed:', student.password);
            const isValidPassword = await bcrypt.compare(password, student.password);
            console.log('Password valid:', isValidPassword);
            if (!isValidPassword) {
                return res.status(401).json({
                    success: false,
                    message: 'Invalid student ID or password'
                });
            }

            // Generate JWT token
            const token = jwt.sign(
                { 
                    id: student.id,
                    student_id: student.student_id,
                    role: 'student'
                },
                process.env.JWT_SECRET,
                { expiresIn: '24h' }
            );

            // Return success with token
            res.json({
                success: true,
                message: 'Login successful',
                data: {
                    token,
                    student: {
                        id: student.id,
                        student_id: student.student_id,
                        first_name: student.first_name,
                        last_name: student.last_name
                    }
                }
            });
        } catch (error) {
            console.error('Error in student login:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        } finally {
            connection.release();
        }
    }
}

module.exports = StudentAuthController;
