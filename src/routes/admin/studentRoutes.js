const express = require('express');
const router = express.Router();
const StudentController = require('../../controllers/admin/studentController');
const { authenticateToken } = require('../../middleware/auth');
const { studentValidation, validate } = require('../../middleware/studentValidation');

// Protected routes
router.use(authenticateToken);

// Student management routes
router.get('/students', StudentController.getAll);
router.get('/students/:id', StudentController.getById);
router.post('/students', validate(studentValidation.create), StudentController.create);
router.put('/students/:id', validate(studentValidation.update), StudentController.update);
router.delete('/students/:id', StudentController.delete);

module.exports = router;
