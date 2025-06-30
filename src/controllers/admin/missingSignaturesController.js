const MissingSignaturesModel = require('../../models/missingSignaturesModel');

class MissingSignaturesController {
    static async getMissingSignatures(req, res) {
        try {
            const missingSignatures = await MissingSignaturesModel.getMissingSignatures();

            // Format dates and add missing days count
            const formattedData = missingSignatures.map(item => ({
                ...item,
                missing_dates: item.missing_dates ? item.missing_dates.split(',').map(date => date.trim()) : [],
                missing_days_count: item.missing_dates ? item.missing_dates.split(',').length : 0,
                date_from: item.date_from ? new Date(item.date_from).toISOString() : null,
                date_until: item.date_until ? new Date(item.date_until).toISOString() : null,
                absence_reasons: item.absence_reasons ? item.absence_reasons.split(',').filter(Boolean) : [],
                updated_at: new Date().toISOString()
            }));

            res.json({
                success: true,
                data: formattedData
            });
        } catch (error) {
            console.error('Error getting missing signatures:', error);
            res.status(500).json({
                success: false,
                message: 'Error getting missing signatures',
                error: error.message
            });
        }
    }
}

module.exports = MissingSignaturesController;
