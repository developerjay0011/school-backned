const BridgeDay = require('../../models/bridgeDayModel');

class BridgeDayController {
    static async create(req, res) {
        try {
            const id = await BridgeDay.create(req.body);
            const bridgeDay = await BridgeDay.getById(id);
            res.status(201).json({
                success: true,
                message: 'Bridge day created successfully',
                data: bridgeDay
            });
        } catch (error) {
            console.error('Error creating bridge day:', error);
            if (error.code === 'ER_DUP_ENTRY') {
                return res.status(400).json({
                    success: false,
                    message: 'Bridge day already exists for this date'
                });
            }
            res.status(500).json({
                success: false,
                message: 'Error creating bridge day',
                error: error.message
            });
        }
    }

    static async getAll(req, res) {
        try {
            const bridgeDays = await BridgeDay.getAll();
            res.json({
                success: true,
                message: 'Bridge days retrieved successfully',
                data: bridgeDays
            });
        } catch (error) {
            console.error('Error getting bridge days:', error);
            res.status(500).json({
                success: false,
                message: 'Error retrieving bridge days',
                error: error.message
            });
        }
    }

    static async getOne(req, res) {
        try {
            const bridgeDay = await BridgeDay.getById(req.params.id);
            if (!bridgeDay) {
                return res.status(404).json({
                    success: false,
                    message: 'Bridge day not found'
                });
            }
            res.json({
                success: true,
                message: 'Bridge day retrieved successfully',
                data: bridgeDay
            });
        } catch (error) {
            console.error('Error getting bridge day:', error);
            res.status(500).json({
                success: false,
                message: 'Error retrieving bridge day',
                error: error.message
            });
        }
    }

    static async update(req, res) {
        try {
            const success = await BridgeDay.update(req.params.id, req.body);
            if (!success) {
                return res.status(404).json({
                    success: false,
                    message: 'Bridge day not found'
                });
            }
            const bridgeDay = await BridgeDay.getById(req.params.id);
            res.json({
                success: true,
                message: 'Bridge day updated successfully',
                data: bridgeDay
            });
        } catch (error) {
            console.error('Error updating bridge day:', error);
            if (error.code === 'ER_DUP_ENTRY') {
                return res.status(400).json({
                    success: false,
                    message: 'Bridge day already exists for this date'
                });
            }
            res.status(500).json({
                success: false,
                message: 'Error updating bridge day',
                error: error.message
            });
        }
    }

    static async delete(req, res) {
        try {
            const success = await BridgeDay.delete(req.params.id);
            if (!success) {
                return res.status(404).json({
                    success: false,
                    message: 'Bridge day not found'
                });
            }
            res.json({
                success: true,
                message: 'Bridge day deleted successfully'
            });
        } catch (error) {
            console.error('Error deleting bridge day:', error);
            res.status(500).json({
                success: false,
                message: 'Error deleting bridge day',
                error: error.message
            });
        }
    }
}

module.exports = BridgeDayController;
