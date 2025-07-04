const LecturerStudentModel = require('../../models/lecturerStudentModel');

class LecturerStudentController {
    static async getStudents(req, res) {
        try {
            console.log('User from token:', req.user);
            const lecturerId = req.user.lecturer_id; // Get lecturer ID from JWT token
            console.log('Lecturer ID from token:', lecturerId);
            
            const students = await LecturerStudentModel.getStudentsByLecturerId(lecturerId);
            
            return res.json({
                success: true,
                message: 'Students retrieved successfully',
                data: students
            });
        } catch (error) {
            console.error('Error retrieving students:', error);
            return res.status(500).json({
                success: false,
                message: 'Error retrieving students',
                error: error.message
            });
        }
    }
}

module.exports = LecturerStudentController;
