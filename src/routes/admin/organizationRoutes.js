const express = require('express');
const router = express.Router();
const Position = require('../../models/positionModel');
const { authenticateToken } = require('../../middleware/auth');

// Get organizational tree
router.get('/tree', authenticateToken, async (req, res) => {
    try {
        const { internal, external } = await Position.getOrganizationalTree();
        res.json({
            success: true,
            data: {
                internal: {
                    title: 'Internal Organization',
                    positions: internal
                },
                external: {
                    title: 'External Organization',
                    positions: external
                }
            }
        });
    } catch (error) {
        console.error('Error getting organizational tree:', error);
        res.status(500).json({
            success: false,
            message: 'Error getting organizational tree',
            error: error.message
        });
    }
});

module.exports = router;
