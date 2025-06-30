const DataCollection = require('../../models/dataCollectionModel');

class DataCollectionController {
    static async getAllForms(req, res) {
        try {
            const forms = await DataCollection.getAllForms();
            res.json({
                success: true,
                message: 'Forms retrieved successfully',
                data: forms
            });
        } catch (error) {
            console.error('Error retrieving forms:', error);
            res.status(500).json({
                success: false,
                message: 'Error retrieving forms',
                error: error.message
            });
        }
    }

    static async generateLink(req, res) {
        try {
            const link = await DataCollection.generateLink();

            res.status(201).json({
                success: true,
                message: 'Form link generated successfully',
                data: {
                    token: link.token,
                    expiry_date: link.expiryDate,
                    form_url: `${process.env.FRONTEND_URL}/data-collection-form?token=${link.token}`
                }
            });
        } catch (error) {
            console.error('Error generating form link:', error);
            res.status(500).json({
                success: false,
                message: 'Error generating form link',
                error: error.message
            });
        }
    }

    static async validateToken(req, res) {
        try {
            const { token } = req.params;
            const link = await DataCollection.validateToken(token);

            if (!link) {
                return res.status(404).json({
                    success: false,
                    message: 'Invalid or expired form link'
                });
            }

            res.json({
                success: true,
                message: 'Valid form link',
                data: {
                    expiry_date: link.expiry_date
                }
            });
        } catch (error) {
            console.error('Error validating token:', error);
            res.status(500).json({
                success: false,
                message: 'Error validating token',
                error: error.message
            });
        }
    }

    static async getFormStructure(req, res) {
        try {
            const { token } = req.params;
            const link = await DataCollection.validateToken(token);

            if (!link) {
                return res.status(404).json({
                    success: false,
                    message: 'Invalid or expired form link'
                });
            }

            const formStructure = await DataCollection.getFormStructure();

            res.json({
                success: true,
                message: 'Form structure retrieved successfully',
                data: formStructure
            });
        } catch (error) {
            console.error('Error retrieving form structure:', error);
            res.status(500).json({
                success: false,
                message: 'Error retrieving form structure',
                error: error.message
            });
        }
    }

    static async submitResponses(req, res) {
        try {
            const { token } = req.params;
            const link = await DataCollection.validateToken(token);

            if (!link) {
                return res.status(404).json({
                    success: false,
                    message: 'Invalid or expired form link'
                });
            }

            const responseId = await DataCollection.submitResponses(link.id, req.body);

            res.json({
                success: true,
                message: 'Form responses submitted successfully',
                data: { id: responseId }
            });
        } catch (error) {
            console.error('Error submitting form responses:', error);
            res.status(500).json({
                success: false,
                message: 'Error submitting form responses',
                error: error.message
            });
        }
    }

    static async getAllForms(req, res) {
        try {
            const forms = await DataCollection.getAllForms();

            res.json({
                success: true,
                message: 'Forms retrieved successfully',
                data: forms
            });
        } catch (error) {
            console.error('Error retrieving forms:', error);
            res.status(500).json({
                success: false,
                message: 'Error retrieving forms',
                error: error.message
            });
        }
    }

    static async getFormResponses(req, res) {
        try {
            const { id } = req.params;
            const responses = await DataCollection.getFormResponses(id);

            res.json({
                success: true,
                message: 'Form responses retrieved successfully',
                data: responses
            });
        } catch (error) {
            console.error('Error retrieving form responses:', error);
            res.status(500).json({
                success: false,
                message: 'Error retrieving form responses',
                error: error.message
            });
        }
    }

    static async addComment(req, res) {
        try {
            const { id } = req.params;
            const { comment } = req.body;

            await DataCollection.addComment(id, comment);

            res.json({
                success: true,
                message: 'Comment added successfully'
            });
        } catch (error) {
            console.error('Error adding comment:', error);
            res.status(500).json({
                success: false,
                message: 'Error adding comment',
                error: error.message
            });
        }
    }

    static async deleteForm(req, res) {
        try {
            const { id } = req.params;
            const deleted = await DataCollection.deleteForm(id);

            if (!deleted) {
                return res.status(404).json({
                    success: false,
                    message: 'Form not found'
                });
            }

            res.json({
                success: true,
                message: 'Form deleted successfully'
            });
        } catch (error) {
            console.error('Error deleting form:', error);
            res.status(500).json({
                success: false,
                message: 'Error deleting form',
                error: error.message
            });
        }
    }
    static async deleteResponse(req, res) {
        try {
            const { id } = req.params;
            await DataCollection.deleteResponse(id);
            res.json({
                success: true,
                message: 'Response deleted successfully'
            });
        } catch (error) {
            console.error('Error deleting response:', error);
            res.status(500).json({
                success: false,
                message: 'Error deleting response',
                error: error.message
            });
        }
    }

    static async editResponse(req, res) {
        try {
            const { id } = req.params;
            const updatedData = req.body;
            
            const result = await DataCollection.updateResponse(id, updatedData);
            
            res.json({
                success: true,
                message: 'Form response updated successfully',
                data: result
            });
        } catch (error) {
            console.error('Error updating form response:', error);
            res.status(500).json({
                success: false,
                message: 'Error updating form response',
                error: error.message
            });
        }
    }

    static async getAllResponses(req, res) {
        try {
            const responses = await DataCollection.getAllResponses();
            res.json({
                success: true,
                data: responses
            });
        } catch (error) {
            console.error('Error getting responses:', error);
            res.status(500).json({
                success: false,
                message: 'Error getting responses',
                error: error.message
            });
        }
    }
}

module.exports = DataCollectionController;
