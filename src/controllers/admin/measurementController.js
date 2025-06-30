const Measurement = require('../../models/measurementModel');

class MeasurementController {
  static async create(req, res) {
    try {
      const measurementId = await Measurement.create(req.body);
      const measurement = await Measurement.findById(measurementId);
      res.status(201).json({
        success: true,
        data: measurement,
        message: 'Measurement created successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  static async getAll(req, res) {
    try {
      const measurements = await Measurement.findAll();
      res.json({
        success: true,
        data: measurements,
        message: 'Measurements retrieved successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  static async getOne(req, res) {
    try {
      const measurement = await Measurement.findById(req.params.id);
      if (!measurement) {
        return res.status(404).json({
          success: false,
          message: 'Measurement not found'
        });
      }
      res.json({
        success: true,
        data: measurement,
        message: 'Measurement retrieved successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  static async update(req, res) {
    try {
      const success = await Measurement.update(req.params.id, req.body);
      if (!success) {
        return res.status(404).json({
          success: false,
          message: 'Measurement not found'
        });
      }
      const measurement = await Measurement.findById(req.params.id);
      res.json({
        success: true,
        data: measurement,
        message: 'Measurement updated successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  static async delete(req, res) {
    try {
      const success = await Measurement.delete(req.params.id);
      if (!success) {
        return res.status(404).json({
          success: false,
          message: 'Measurement not found'
        });
      }
      res.json({
        success: true,
        message: 'Measurement deleted successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  static async toggleShowInDocuments(req, res) {
    try {
      const success = await Measurement.toggleShowInDocuments(req.params.id);
      if (!success) {
        return res.status(404).json({
          success: false,
          message: 'Measurement not found'
        });
      }
      const measurement = await Measurement.getById(req.params.id);
      res.json({
        success: true,
        message: `Show in documents ${measurement.show_in_documents ? 'enabled' : 'disabled'} successfully`,
        data: measurement
      });
    } catch (error) {
      console.error('Error toggling show in documents:', error);
      res.status(500).json({
        success: false,
        message: 'Error toggling show in documents',
        error: error.message
      });
    }
  }
}

module.exports = MeasurementController;
