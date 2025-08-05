const express = require('express');
const router = express.Router();
const StudentInvoiceController = require('../../controllers/admin/studentInvoiceController');
const { studentInvoiceValidation, validate } = require('../../middleware/studentInvoiceValidation');
const { authenticateToken } = require('../../middleware/auth');

// All routes are protected with authentication
router.use(authenticateToken);

// Student invoice management routes
router.get('/invoices', StudentInvoiceController.getAll);
router.get('/students/:studentId/invoices', StudentInvoiceController.getByStudentId);
router.post('/students/:studentId/invoices', validate(studentInvoiceValidation.create), StudentInvoiceController.create);
router.put('/invoices/:id', validate(studentInvoiceValidation.update), StudentInvoiceController.update);
router.delete('/invoices/:id', StudentInvoiceController.delete);
router.get('/invoices/:id/mahnung', StudentInvoiceController.mahnungPDF);

// Create manual reminder for an invoice
router.post('/invoices/:id/reminder', StudentInvoiceController.createReminder);

// Cancel invoice and generate storno PDF
router.post('/invoices/:id/cancel', StudentInvoiceController.cancel);

// Toggle auto-dispatch for reminders
router.put('/invoices/:id/auto-dispatch',
    validate(studentInvoiceValidation.toggleAutoDispatch),
    StudentInvoiceController.toggleAutoDispatch
);

module.exports = router;
