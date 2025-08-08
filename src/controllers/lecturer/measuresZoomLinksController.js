const MeasuresZoomLinksModel = require('../../models/measuresZoomLinksModel');
const DateTimeUtils = require('../../utils/dateTimeUtils');

class MeasuresZoomLinksController {
    static async create(req, res) {
        const connection = await require('../../config/database').getConnection();
        try {
            const lecturerId = req.user.lecturer_id;
            const { measures_id, zoom_link, start_date, end_date } = req.body;

            // Validate required fields
            if (!measures_id || !zoom_link || !start_date || !end_date) {
                return res.status(400).json({
                    success: false,
                    message: 'Missing required fields'
                });
            }

            // Parse and validate dates
            const parsedStartDate = DateTimeUtils.parseToDateTime(start_date);
            const parsedEndDate = DateTimeUtils.parseToDateTime(end_date);

            if (!parsedStartDate.isValid() || !parsedEndDate.isValid()) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid date format'
                });
            }

            if (parsedEndDate.isBefore(parsedStartDate)) {
                return res.status(400).json({
                    success: false,
                    message: 'End date must be after start date'
                });
            }

            // Format dates for database
            const formattedStartDate = parsedStartDate.format('YYYY-MM-DD');
            const formattedEndDate = parsedEndDate.format('YYYY-MM-DD');

            const id = await MeasuresZoomLinksModel.create({
                measures_id,
                lecturer_id: lecturerId,
                zoom_link,
                start_date: formattedStartDate,
                end_date: formattedEndDate
            });

            return res.json({
                success: true,
                message: 'Zoom link created successfully',
                data: { id }
            });
        } catch (error) {
            console.error('Error creating zoom link:', error);
            return res.status(500).json({
                success: false,
                message: 'Error creating zoom link',
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
        const connection = await require('../../config/database').getConnection();
        try {
            const lecturerId = req.user.lecturer_id;
            const { id } = req.params;
            const { zoom_link, start_date, end_date } = req.body;

            // Validate required fields
            if (!zoom_link || !start_date || !end_date) {
                return res.status(400).json({
                    success: false,
                    message: 'Missing required fields'
                });
            }

            // Parse and validate dates
            const parsedStartDate = DateTimeUtils.parseToDateTime(start_date);
            const parsedEndDate = DateTimeUtils.parseToDateTime(end_date);

            if (!parsedStartDate.isValid() || !parsedEndDate.isValid()) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid date format'
                });
            }

            if (parsedEndDate.isBefore(parsedStartDate)) {
                return res.status(400).json({
                    success: false,
                    message: 'End date must be after start date'
                });
            }

            // Format dates for database
            const formattedStartDate = parsedStartDate.format('YYYY-MM-DD');
            const formattedEndDate = parsedEndDate.format('YYYY-MM-DD');

            const success = await MeasuresZoomLinksModel.update(id, {
                zoom_link,
                start_date: formattedStartDate,
                end_date: formattedEndDate
            });

            if (!success) {
                return res.status(404).json({
                    success: false,
                    message: 'Zoom link not found or not authorized'
                });
            }

            return res.json({
                success: true,
                message: 'Zoom link updated successfully'
            });
        } catch (error) {
            console.error('Error updating zoom link:', error);
            return res.status(500).json({
                success: false,
                message: 'Error updating zoom link',
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

    static async getByLecturer(req, res) {
        const connection = await require('../../config/database').getConnection();
        try {
            const lecturerId = req.user.lecturer_id;
            const zoomLinks = await MeasuresZoomLinksModel.getByLecturerId(lecturerId);

            return res.json({
                success: true,
                data: zoomLinks
            });
        } catch (error) {
            console.error('Error getting zoom links:', error);
            return res.status(500).json({
                success: false,
                message: 'Error getting zoom links',
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
        const connection = await require('../../config/database').getConnection();
        try {
            const lecturerId = req.user.lecturer_id;
            const { id } = req.params;

            const success = await MeasuresZoomLinksModel.delete(id, lecturerId);

            if (!success) {
                return res.status(404).json({
                    success: false,
                    message: 'Zoom link not found or not authorized'
                });
            }

            return res.json({
                success: true,
                message: 'Zoom link deleted successfully'
            });
        } catch (error) {
            console.error('Error deleting zoom link:', error);
            return res.status(500).json({
                success: false,
                message: 'Error deleting zoom link',
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

module.exports = MeasuresZoomLinksController;
