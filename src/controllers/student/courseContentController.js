const CourseContent = require('../../models/courseContentModel');

class CourseContentController {
    static async getAllContent(req, res) {
        try {
            const { language } = req.query;
            const result = await CourseContent.getAllContent(language);
            res.json(result);
        } catch (error) {
            console.error('Error fetching course content:', error);
            res.status(500).json({
                success: false,
                message: 'Error fetching course content',
                error: error.message
            });
        }
    }

    static getSupportedLanguages(req, res) {
        res.json({
            success: true,
            data: CourseContent.SUPPORTED_LANGUAGES
        });
    }
}

module.exports = CourseContentController;
