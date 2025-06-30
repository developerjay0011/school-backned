const Examination = require('../../models/examinationModel');

class ExaminationController {
    static async create(req, res) {
        try {
            const id = await Examination.create(req.body);
            const examination = await Examination.getById(id);
            res.status(201).json({
                success: true,
                message: 'Examination created successfully',
                data: examination
            });
        } catch (error) {
            console.error('Error creating examination:', error);
            if (error.code === 'ER_DUP_ENTRY') {
                return res.status(400).json({
                    success: false,
                    message: 'Examination already exists'
                });
            }
            res.status(500).json({
                success: false,
                message: 'Error creating examination',
                error: error.message
            });
        }
    }

    static async getAll(req, res) {
        try {
            const examinations = await Examination.getAll();
            res.json({
                success: true,
                message: 'Examinations retrieved successfully',
                data: examinations
            });
        } catch (error) {
            console.error('Error getting examinations:', error);
            res.status(500).json({
                success: false,
                message: 'Error retrieving examinations',
                error: error.message
            });
        }
    }

    static async getOne(req, res) {
        try {
            const examination = await Examination.getById(req.params.id);
            if (!examination) {
                return res.status(404).json({
                    success: false,
                    message: 'Examination not found'
                });
            }
            res.json({
                success: true,
                message: 'Examination retrieved successfully',
                data: examination
            });
        } catch (error) {
            console.error('Error getting examination:', error);
            res.status(500).json({
                success: false,
                message: 'Error retrieving examination',
                error: error.message
            });
        }
    }

    static async update(req, res) {
        try {
            const success = await Examination.update(req.params.id, req.body);
            if (!success) {
                return res.status(404).json({
                    success: false,
                    message: 'Examination not found'
                });
            }
            const examination = await Examination.getById(req.params.id);
            res.json({
                success: true,
                message: 'Examination updated successfully',
                data: examination
            });
        } catch (error) {
            console.error('Error updating examination:', error);
            if (error.code === 'ER_DUP_ENTRY') {
                return res.status(400).json({
                    success: false,
                    message: 'Examination name already exists'
                });
            }
            res.status(500).json({
                success: false,
                message: 'Error updating examination',
                error: error.message
            });
        }
    }

    static async delete(req, res) {
        try {
            const success = await Examination.delete(req.params.id);
            if (!success) {
                return res.status(404).json({
                    success: false,
                    message: 'Examination not found'
                });
            }
            res.json({
                success: true,
                message: 'Examination deleted successfully'
            });
        } catch (error) {
            console.error('Error deleting examination:', error);
            res.status(500).json({
                success: false,
                message: 'Error deleting examination',
                error: error.message
            });
        }
    }
}

module.exports = ExaminationController;
