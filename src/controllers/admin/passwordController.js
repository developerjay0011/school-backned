const bcrypt = require('bcrypt');
const StudentModel = require('../../models/studentModel');
const LecturerModel = require('../../models/lecturerModel');

class PasswordController {
    static async changeStudentPassword(req, res) {
        try {
            const { student_id } = req.params;
            const { new_password } = req.body;

            if (!new_password) {
                return res.status(400).json({
                    success: false,
                    message: 'New password is required'
                });
            }

            // Check if student exists
            const student = await StudentModel.getByStudentId(student_id);
            if (!student) {
                return res.status(404).json({
                    success: false,
                    message: 'Student not found'
                });
            }

            // Hash the new password
            const hashedPassword = await bcrypt.hash(new_password, 10);

            // Update the password (already hashed)
            await StudentModel.updatePassword(student_id, hashedPassword);

            res.json({
                success: true,
                message: 'Student password updated successfully'
            });
        } catch (error) {
            console.error('Error changing student password:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }

    static async changeLecturerPassword(req, res) {
        try {
            const { lecturer_id } = req.params;
            const { new_password } = req.body;

            if (!new_password) {
                return res.status(400).json({
                    success: false,
                    message: 'New password is required'
                });
            }

            // Check if lecturer exists
            const lecturer = await LecturerModel.getLecturerById(lecturer_id);
            if (!lecturer) {
                return res.status(404).json({
                    success: false,
                    message: 'Lecturer not found'
                });
            }

            // Hash the new password
            const hashedPassword = await bcrypt.hash(new_password, 10);

            // Update the password (already hashed)
            await LecturerModel.updatePassword(lecturer_id, hashedPassword);

            res.json({
                success: true,
                message: 'Lecturer password updated successfully'
            });
        } catch (error) {
            console.error('Error changing lecturer password:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }
}

module.exports = PasswordController;
