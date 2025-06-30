const Paragraph = require('../../models/paragraphModel');

class ParagraphController {
    static async getAll(req, res) {
        try {
            const paragraphs = await Paragraph.getAll();
            res.json({
                success: true,
                message: 'According to paragraph options retrieved successfully',
                data: paragraphs
            });
        } catch (error) {
            console.error('Error getting according to paragraph options:', error);
            res.status(500).json({
                success: false,
                message: 'Error retrieving according to paragraph options',
                error: error.message
            });
        }
    }

    static async getOne(req, res) {
        try {
            const paragraph = await Paragraph.getById(req.params.id);
            if (!paragraph) {
                return res.status(404).json({
                    success: false,
                    message: 'According to paragraph option not found'
                });
            }
            res.json({
                success: true,
                message: 'According to paragraph option retrieved successfully',
                data: paragraph
            });
        } catch (error) {
            console.error('Error getting according to paragraph option:', error);
            res.status(500).json({
                success: false,
                message: 'Error retrieving according to paragraph option',
                error: error.message
            });
        }
    }
}

module.exports = ParagraphController;
