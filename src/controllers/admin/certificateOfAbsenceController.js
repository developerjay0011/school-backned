const CertificateOfAbsence = require('../../models/certificateOfAbsenceModel');

class CertificateOfAbsenceController {
    static async getByStudentId(req, res) {
        const { studentId } = req.params;

        try {
            const certificates = await CertificateOfAbsence.getByStudentId(studentId);
            
            res.status(200).json({
                success: true,
                message: certificates.length > 0 ? 'Certificates retrieved successfully' : 'No certificates found for this student',
                data: certificates
            });
        } catch (error) {
            console.error('Error retrieving certificates by student ID:', error);
            res.status(500).json({
                success: false,
                message: 'Error retrieving certificates',
                error: error.message
            });
        }
    }
    static async delete(req, res) {
        const { id } = req.params;

        try {
            const deleted = await CertificateOfAbsence.delete(id);
            
            if (!deleted) {
                return res.status(404).json({
                    success: false,
                    message: 'Certificate not found'
                });
            }

            res.status(200).json({
                success: true,
                message: 'Certificate deleted successfully'
            });
        } catch (error) {
            console.error('Error deleting certificate:', error);
            res.status(500).json({
                success: false,
                message: 'Error deleting certificate',
                error: error.message
            });
        }
    }
    static async getAll(req, res) {
        try {
            const certificates = await CertificateOfAbsence.getAll();
            
            res.status(200).json({
                success: true,
                message: 'Certificates retrieved successfully',
                data: certificates
            });
        } catch (error) {
            console.error('Error retrieving certificates:', error);
            res.status(500).json({
                success: false,
                message: 'Error retrieving certificates',
                error: error.message
            });
        }
    }
}

module.exports = CertificateOfAbsenceController;
