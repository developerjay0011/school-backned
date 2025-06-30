const express = require('express');
const router = express.Router();
const Training = require('../../models/trainingModel');
const { authenticateToken } = require('../../middleware/auth');
const Joi = require('joi');

// Validation schema
const trainingValidation = {
    create: Joi.object({
        topic: Joi.string().required(),
        quarter: Joi.string().valid('Q1', 'Q2', 'Q3', 'Q4').required(),
        year: Joi.number().integer().min(2000).max(2100).required(),
        actual_date: Joi.date().iso().required(),
        participation: Joi.string(),
        reason_non_participation: Joi.string().allow(null, ''),
        effectiveness: Joi.string().allow(null, ''),
        feedback_assessment: Joi.string().allow(null, '')
    })
};

const validate = (schema) => {
    return (req, res, next) => {
        const { error } = schema.validate(req.body, { abortEarly: false });
        if (error) {
            const errorMessage = error.details.map(detail => detail.message).join(', ');
            return res.status(400).json({
                success: false,
                message: 'Validation error',
                errors: errorMessage
            });
        }
        next();
    };
};

// Get all trainings for a user
router.get('/users/:userId/trainings', authenticateToken, async (req, res) => {
    try {
        const userId = parseInt(req.params.userId);
        if (isNaN(userId)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid user ID'
            });
        }

        const trainings = await Training.getByUserId(userId);
        res.json({
            success: true,
            data: trainings
        });
    } catch (error) {
        console.error('Error getting trainings:', error);
        res.status(500).json({
            success: false,
            message: 'Error getting trainings',
            error: error.message
        });
    }
});

// Add a new training for a user
router.post('/users/:userId/trainings', authenticateToken, validate(trainingValidation.create), async (req, res) => {
    try {
        const userId = parseInt(req.params.userId);
        if (isNaN(userId)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid user ID'
            });
        }

        const trainingId = await Training.create(userId, req.body);
        const training = await Training.getByUserId(userId);
        
        res.status(201).json({
            success: true,
            message: 'Training added successfully',
            data: training
        });
    } catch (error) {
        console.error('Error adding training:', error);
        res.status(500).json({
            success: false,
            message: 'Error adding training',
            error: error.message
        });
    }
});

// Update a training
router.put('/trainings/:id', authenticateToken, validate(trainingValidation.create), async (req, res) => {
    try {
        const trainingId = req.params.id;
        const success = await Training.update(trainingId, req.body);
        
        if (!success) {
            return res.status(404).json({
                success: false,
                message: 'Training not found'
            });
        }

        res.json({
            success: true,
            message: 'Training updated successfully'
        });
    } catch (error) {
        console.error('Error updating training:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating training',
            error: error.message
        });
    }
});

// Delete a training
router.delete('/trainings/:id', authenticateToken, async (req, res) => {
    try {
        const success = await Training.delete(req.params.id);
        
        if (!success) {
            return res.status(404).json({
                success: false,
                message: 'Training not found'
            });
        }

        res.json({
            success: true,
            message: 'Training deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting training:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting training',
            error: error.message
        });
    }
});

module.exports = router;
