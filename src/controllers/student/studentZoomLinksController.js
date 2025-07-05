const MeasuresZoomLinksModel = require('../../models/measuresZoomLinksModel');

class StudentZoomLinksController {
    static async getZoomLinks(req, res) {
        try {
            const studentId = req.user.student_id;

            // Get zoom links for the student's measure
            const zoomLinks = await MeasuresZoomLinksModel.getByStudentDetails(studentId);

            return res.json({
                success: true,
                data: zoomLinks
            });
        } catch (error) {
            console.error('Error getting zoom links:', error);
            return res.status(500).json({
                success: false,
                message: 'Error getting zoom links',
                error: error.message
            });
        }
    }
}

module.exports = StudentZoomLinksController;
