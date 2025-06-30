const PDFGenerator = require('../../utils/pdfGenerator');

class PDFController {
    static async generateFeedbackSheet(req, res) {
        try {
            // Dummy data for feedback sheet
            const data = {
                responses: [
                    {
                        name: "Daniel Fard",
                        topic: "Strukturierte Mitarbeitergespräche erfolgreich führen",
                        date: "23.10.2024"
                    },
                    {
                        name: "Maria Schmidt",
                        topic: "Konfliktmanagement im Team",
                        date: "15.11.2024"
                    }
                ]
            };

            const result = await PDFGenerator.generateFeedbackSheetPDF(data);
            res.json({
                success: true,
                data: result
            });
        } catch (error) {
            console.error('Error generating feedback sheet PDF:', error);
            res.status(500).json({
                success: false,
                message: 'Error generating feedback sheet PDF'
            });
        }
    }

    static async generateSuccessAndPlacementStatistics(req, res) {
        try {
            // Dummy data for success and placement statistics
            const data = {
                responses: [
                    {
                        name: "Daniel Fard",
                        course: "Strukturierte Mitarbeitergespräche",
                        planned: "4 Quartal 2024",
                        actual: "23.10.2024",
                        participated: "ja"
                    },
                    {
                        name: "Maria Schmidt",
                        course: "Konfliktmanagement",
                        planned: "1 Quartal 2024",
                        actual: "15.01.2024",
                        participated: "ja"
                    }
                ]
            };

            const result = await PDFGenerator.generateSuccessAndPlacementStatisticsPDF(data);
            res.json({
                success: true,
                data: result
            });
        } catch (error) {
            console.error('Error generating success statistics PDF:', error);
            res.status(500).json({
                success: false,
                message: 'Error generating success statistics PDF'
            });
        }
    }

    static async generateQualifizierungsplan(req, res) {
        try {
            const { start_date, end_date } = req.query;

            if (!start_date || !end_date) {
                return res.status(400).json({
                    success: false,
                    message: 'Start year and end year are required'
                });
            }

            // Extract years and create full date range
            const startYear = parseInt(start_date);
            const endYear = parseInt(end_date);

            if (isNaN(startYear) || isNaN(endYear)) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid year format. Use YYYY'
                });
            }

            // Create date objects for January 1st and December 31st of the respective years
            const startDate = new Date(startYear, 0, 1); // January 1st
            const endDate = new Date(endYear, 11, 31); // December 31st

            if (endDate < startDate) {
                return res.status(400).json({
                    success: false,
                    message: 'End date cannot be before start date'
                });
            }

            const TrainingModel = require('../../models/trainingModel');
            const trainings = await TrainingModel.getTrainingsByDateRange(startYear, endYear);
            console.log("trainings", trainings);
            const data = {
                start_date: startYear.toString(),
                end_date: endYear.toString(),
                responses: trainings.map(training => ({
                    actual_date: new Date(training.actual_date).toLocaleDateString('de-DE'),
                    topic: training.topic,
                    first_name: training.first_name,
                    last_name: training.last_name,
                    quarter: training.quarter,
                    participant: training.participant ? "Ja" : "Nein",
                    feedback_assessment: training.feedback_assessment,
                    reason_non_participation: training.reason_non_participation,
                    effectiveness: training.effectiveness
                }))
            };
            const result = await PDFGenerator.generateQualifizierungsplanPDF(data);
            
            // Save to database
            const QualifizierungsplanModel = require('../../models/qualifizierungsplanModel');
            await QualifizierungsplanModel.create({
                start_date: start_date,
                end_date: end_date,
                description: 'Qualifizierungsplan ' + ( start_date == end_date ? start_date : start_date + ' - ' + end_date),
                pdf_url: result,
                year: start_date // Using start_date as the year since this is a yearly plan
            });

            res.json({
                success: true,
                data: result
            });
        } catch (error) {
            console.error('Error generating Qualifizierungsplan PDF:', error);
            res.status(500).json({
                success: false,
                message: 'Error generating Qualifizierungsplan PDF'
            });
        }
    }
    static async getQualifizierungsplanList(req, res) {
        try {
            const QualifizierungsplanModel = require('../../models/qualifizierungsplanModel');
            const plans = await QualifizierungsplanModel.getAll();
            
            res.json({
                success: true,
                data: plans.map(plan => ({
                    id: plan.id,
                    start_date: plan.start_date,
                    end_date: plan.end_date,
                    description: plan.description,
                    pdf_url: plan.pdf_url,
                    created_at: plan.created_at
                }))
            });
        } catch (error) {
            console.error('Error getting Qualifizierungsplan list:', error);
            res.status(500).json({
                success: false,
                message: 'Error getting Qualifizierungsplan list'
            });
        }
    }

    static async deleteQualifizierungsplan(req, res) {
        try {
            const { id } = req.params;
            const QualifizierungsplanModel = require('../../models/qualifizierungsplanModel');
            
            // Check if plan exists
            const plan = await QualifizierungsplanModel.getById(id);
            if (!plan) {
                return res.status(404).json({
                    success: false,
                    message: 'Qualifizierungsplan not found'
                });
            }

            // Delete the plan
            const deleted = await QualifizierungsplanModel.delete(id);
            if (!deleted) {
                return res.status(500).json({
                    success: false,
                    message: 'Failed to delete Qualifizierungsplan'
                });
            }

            res.json({
                success: true,
                message: 'Qualifizierungsplan deleted successfully'
            });
        } catch (error) {
            console.error('Error deleting Qualifizierungsplan:', error);
            res.status(500).json({
                success: false,
                message: 'Error deleting Qualifizierungsplan'
            });
        }
    }
}

module.exports = PDFController;
