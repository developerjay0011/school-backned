const TrainingReportModel = require('../../models/trainingReportModel');

class TrainingReportController {
    static async create(req, res) {
        try {
            console.log('User from JWT:', req.user);
            console.log('Request body:', req.body);
            
            if (!req.user || !req.user.lecturer_id) {
                return res.status(400).json({
                    success: false,
                    message: 'Lecturer ID not found in token'
                });
            }

            const data = {
                ...req.body,
                lecturer_id: req.user.lecturer_id // From JWT token
            };
            
            console.log('Data to insert:', data);

            const reportId = await TrainingReportModel.create(data);
            const report = await TrainingReportModel.getById(reportId, req.user.lecturer_id);

            res.status(201).json({
                success: true,
                message: 'Training report created successfully',
                data: report
            });
        } catch (error) {
            console.error('Error creating training report:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }

    static async getAll(req, res) {
        try {
            const reports = await TrainingReportModel.getAll(req.user.lecturer_id);
            res.json({
                success: true,
                data: reports
            });
        } catch (error) {
            console.error('Error getting training reports:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }

    static async getOne(req, res) {
        try {
            console.log('Getting report with ID:', req.params.id, 'for lecturer:', req.user);
            const report = await TrainingReportModel.getById(req.params.id, req.user.lecturer_id);
            if (!report) {
                return res.status(404).json({
                    success: false,
                    message: 'Training report not found'
                });
            }

            res.json({
                success: true,
                data: report
            });
        } catch (error) {
            console.error('Error getting training report:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }

    static async update(req, res) {
        try {
            const success = await TrainingReportModel.update(
                req.params.id,
                req.body,
                req.user.lecturer_id
            );

            if (!success) {
                return res.status(404).json({
                    success: false,
                    message: 'Training report not found'
                });
            }

            const report = await TrainingReportModel.getById(req.params.id, req.user.id);
            res.json({
                success: true,
                message: 'Training report updated successfully',
                data: report
            });
        } catch (error) {
            console.error('Error updating training report:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }

    static async delete(req, res) {
        try {
            const success = await TrainingReportModel.delete(req.params.id, req.user.lecturer_id);
            if (!success) {
                return res.status(404).json({
                    success: false,
                    message: 'Training report not found'
                });
            }

            res.json({
                success: true,
                message: 'Training report deleted successfully'
            });
        } catch (error) {
            console.error('Error deleting training report:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }
}

module.exports = TrainingReportController;
