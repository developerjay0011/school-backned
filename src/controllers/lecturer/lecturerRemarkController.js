const LecturerRemarkModel = require('../../models/lecturerRemarkModel');

class LecturerRemarkController {
    static async addRemark(req, res) {
        try {
            const { student_id, remark } = req.body;
            const lecturerId = req.user.lecturer_id;

            if (!student_id || !remark) {
                return res.status(400).json({
                    success: false,
                    message: 'Student ID and remark are required'
                });
            }

            const success = await LecturerRemarkModel.addRemark(student_id, lecturerId, remark);
            
            if (!success) {
                return res.status(404).json({
                    success: false,
                    message: 'Unable to add remark. Student not found or not assigned to this lecturer.'
                });
            }

            // Get updated remark
            const updatedRemark = await LecturerRemarkModel.getRemark(student_id, lecturerId);

            return res.json({
                success: true,
                message: 'Remark added successfully',
                data: updatedRemark
            });
        } catch (error) {
            console.error('Error adding remark:', error);
            return res.status(500).json({
                success: false,
                message: 'Error adding remark',
                error: error.message
            });
        }
    }

    static async getRemark(req, res) {
        try {
            const { student_id } = req.params;
            const lecturerId = req.user.lecturer_id;

            const remark = await LecturerRemarkModel.getRemark(student_id, lecturerId);
            
            if (!remark) {
                return res.status(404).json({
                    success: false,
                    message: 'Remark not found or student not assigned to this lecturer'
                });
            }

            return res.json({
                success: true,
                message: 'Remark retrieved successfully',
                data: remark
            });
        } catch (error) {
            console.error('Error getting remark:', error);
            return res.status(500).json({
                success: false,
                message: 'Error getting remark',
                error: error.message
            });
        }
    }

    static async getAllRemarks(req, res) {
        try {
            const lecturerId = req.user.lecturer_id;
            const remarks = await LecturerRemarkModel.getRemarksByLecturer(lecturerId);
            
            return res.json({
                success: true,
                message: 'Remarks retrieved successfully',
                data: remarks
            });
        } catch (error) {
            console.error('Error getting remarks:', error);
            return res.status(500).json({
                success: false,
                message: 'Error getting remarks',
                error: error.message
            });
        }
    }
}

module.exports = LecturerRemarkController;
