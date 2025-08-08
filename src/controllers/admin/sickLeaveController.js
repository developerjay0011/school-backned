const SickLeave = require('../../models/sickLeaveModel');
const db = require('../../config/database');
const PDFGenerator = require('../../utils/pdfGenerator');
const CertificateOfAbsence = require('../../models/certificateOfAbsenceModel');

class SickLeaveController {
    static async getLeavesByMonth(req, res) {
     let connection;
        try {
            connection = await db.getConnection();
            const studentId = req.params.studentId;
            const month = parseInt(req.params.month);
            const year = parseInt(req.params.year);

            // Validate month and year
            if (isNaN(month) || month < 1 || month > 12) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid month. Month must be between 1 and 12'
                });
            }

            if (isNaN(year) || year < 2000 || year > 2100) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid year. Year must be between 2000 and 2100'
                });
            }

            // Check if student exists
            const [student] = await connection.execute(
                'SELECT student_id FROM student WHERE student_id = ?',
                [studentId]
            );

            if (student.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Student not found'
                });
            }

            const leaveData = await SickLeave.getLeavesByMonth(studentId, month, year);
            console.log("leaveData", leaveData)
            if (!leaveData) {
                return res.status(404).json({
                    success: false,
                    message: 'No leaves found for this month'
                });
            }
            const response = {
                success: true,
                data: leaveData
            };

            const pdfResult = await PDFGenerator.generateCertificateOfAbsence(leaveData);
            const baseUrl = process.env.BACKEND_URL || 'http://localhost:3000';
            const pdfUrl = `${baseUrl}${pdfResult.url}`;
            
            // Store certificate information
            const certificateData = {
                date: new Date(),
                description: `Certificate of absence ${leaveData.month}`,
                sent_to: leaveData.authority.email || 'N/A',
                pdf_url: pdfUrl,
                student_id: parseInt(studentId)
            };
            
            await CertificateOfAbsence.create(certificateData);
            
            res.status(200).json({
                success: true,
                message: 'Certificate of absence pdf generated successfully' ,
                data: certificateData,
            });
        } catch (error) {
            console.error('Error generating certificate of absence pdf:', error);
            res.status(500).json({
                success: false,
                message: 'Error generating certificate of absence pdf',
                error: error.message
            });
        } finally {
            if (connection) {
                try {
                    connection.release();
                    console.log('Connection released in User.delete');
                } catch (releaseError) {
                    console.error('Error releasing connection in User.delete:', releaseError);
                }
            }
        }
    }

    static async create(req, res) {
     let connection;
        try {
            connection = await db.getConnection();
            const studentId = req.params.studentId;

            // Format dates to MySQL format (YYYY-MM-DD)
            const formatDate = (date) => {
                if (!date) return null;
                return new Date(date).toISOString().split('T')[0];
            };

            const sickLeaveData = {
                date_from: formatDate(req.body.date_from),
                date_until: formatDate(req.body.date_until),
                status: req.body.status,
                description: req.body.description
            };

            // Check if student exists
            const [student] = await connection.execute(
                'SELECT student_id FROM student WHERE student_id = ?',
                [studentId]
            );

            if (student.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Student not found'
                });
            }

            const sickLeaveId = await SickLeave.create(studentId, sickLeaveData);
            const createdSickLeave = await SickLeave.getById(sickLeaveId);

            res.status(201).json({
                success: true,
                message: 'Sick leave created successfully',
                data: createdSickLeave
            });
        } catch (error) {
            console.error('Error creating sick leave:', error);
            res.status(500).json({
                success: false,
                message: 'Error creating sick leave',
                error: error.message
            });
        } finally {
            if (connection) {
                try {
                    connection.release();
                    console.log('Connection released in User.delete');
                } catch (releaseError) {
                    console.error('Error releasing connection in User.delete:', releaseError);
                }
            }
        }
    }

    static async update(req, res) {
     let connection;
        try {
            connection = await db.getConnection();
            const { id } = req.params;

            // Format dates to MySQL format (YYYY-MM-DD)
            const formatDate = (date) => {
                if (!date) return null;
                return new Date(date).toISOString().split('T')[0];
            };

            const sickLeaveData = {
                date_from: formatDate(req.body.date_from),
                date_until: formatDate(req.body.date_until),
                status: req.body.status,
                description: req.body.description
            };

            // Remove undefined fields
            Object.keys(sickLeaveData).forEach(key => {
                if (sickLeaveData[key] === undefined) {
                    delete sickLeaveData[key];
                }
            });

            const sickLeave = await SickLeave.getById(id);
            if (!sickLeave) {
                return res.status(404).json({
                    success: false,
                    message: 'Sick leave not found'
                });
            }

            await SickLeave.update(id, sickLeaveData);
            const updatedSickLeave = await SickLeave.getById(id);

            res.json({
                success: true,
                message: 'Sick leave updated successfully',
                data: updatedSickLeave
            });
        } catch (error) {
            console.error('Error updating sick leave:', error);
            res.status(500).json({
                success: false,
                message: 'Error updating sick leave',
                error: error.message
            });
        } finally {
            if (connection) {
                try {
                    connection.release();
                    console.log('Connection released in User.delete');
                } catch (releaseError) {
                    console.error('Error releasing connection in User.delete:', releaseError);
                }
            }
        }
    }

    static async delete(req, res) {
     let connection;
        try {
            connection = await db.getConnection();
            const { id } = req.params;

            const sickLeave = await SickLeave.getById(id);
            if (!sickLeave) {
                return res.status(404).json({
                    success: false,
                    message: 'Sick leave not found'
                });
            }

            await SickLeave.delete(id);

            res.json({
                success: true,
                message: 'Sick leave deleted successfully'
            });
        } catch (error) {
            console.error('Error deleting sick leave:', error);
            res.status(500).json({
                success: false,
                message: 'Error deleting sick leave',
                error: error.message
            });
        } finally {
            if (connection) {
                try {
                    connection.release();
                    console.log('Connection released in User.delete');
                } catch (releaseError) {
                    console.error('Error releasing connection in User.delete:', releaseError);
                }
            }
        }
    }

    static async getByStudentId(req, res) {
     let connection;
        try {
            connection = await db.getConnection();
            const { studentId } = req.params;

            // Check if student exists
            const [student] = await connection.execute(
                'SELECT student_id FROM student WHERE student_id = ?',
                [studentId]
            );

            if (student.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Student not found'
                });
            }

            const sickLeaves = await SickLeave.getByStudentId(studentId);

            res.json({
                success: true,
                message: 'Sick leaves retrieved successfully',
                data: sickLeaves
            });
        } catch (error) {
            console.error('Error retrieving sick leaves:', error);
            res.status(500).json({
                success: false,
                message: 'Error retrieving sick leaves',
                error: error.message
            });
        } finally {
            if (connection) {
                try {
                    connection.release();
                    console.log('Connection released in User.delete');
                } catch (releaseError) {
                    console.error('Error releasing connection in User.delete:', releaseError);
                }
            }
        }
    }
}



module.exports = SickLeaveController;
