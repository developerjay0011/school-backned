const Intermediary = require('../../models/intermediaryModel');

class IntermediaryController {
    static async create(req, res) {
        try {
            const id = await Intermediary.create(req.body);
            const intermediary = await Intermediary.getById(id);
            res.status(201).json({
                success: true,
                message: 'Intermediary created successfully',
                data: intermediary
            });
        } catch (error) {
            console.error('Error creating intermediary:', error);
            res.status(500).json({
                success: false,
                message: 'Error creating intermediary',
                error: error.message
            });
        }
    }

    static async getAll(req, res) {
        try {
            const intermediaries = await Intermediary.getAll();
            res.json({
                success: true,
                message: 'Intermediaries retrieved successfully',
                data: intermediaries
            });
        } catch (error) {
            console.error('Error getting intermediaries:', error);
            res.status(500).json({
                success: false,
                message: 'Error retrieving intermediaries',
                error: error.message
            });
        }
    }

    static async getOne(req, res) {
        try {
            const intermediary = await Intermediary.getById(req.params.id);
            if (!intermediary) {
                return res.status(404).json({
                    success: false,
                    message: 'Intermediary not found'
                });
            }
            res.json({
                success: true,
                message: 'Intermediary retrieved successfully',
                data: intermediary
            });
        } catch (error) {
            console.error('Error getting intermediary:', error);
            res.status(500).json({
                success: false,
                message: 'Error retrieving intermediary',
                error: error.message
            });
        }
    }

    static async update(req, res) {
        try {
            const success = await Intermediary.update(req.params.id, req.body);
            if (!success) {
                return res.status(404).json({
                    success: false,
                    message: 'Intermediary not found'
                });
            }
            const intermediary = await Intermediary.getById(req.params.id);
            res.json({
                success: true,
                message: 'Intermediary updated successfully',
                data: intermediary
            });
        } catch (error) {
            console.error('Error updating intermediary:', error);
            res.status(500).json({
                success: false,
                message: 'Error updating intermediary',
                error: error.message
            });
        }
    }

    static async delete(req, res) {
        try {
            const success = await Intermediary.delete(req.params.id);
            if (!success) {
                return res.status(404).json({
                    success: false,
                    message: 'Intermediary not found'
                });
            }
            res.json({
                success: true,
                message: 'Intermediary deleted successfully'
            });
        } catch (error) {
            console.error('Error deleting intermediary:', error);
            res.status(500).json({
                success: false,
                message: 'Error deleting intermediary',
                error: error.message
            });
        }
    }
}

module.exports = IntermediaryController;
