const express = require('express');
const router = express.Router();
const AdminAuthController = require('../../controllers/admin/adminAuthController');
const UserController = require('../../controllers/admin/userController');
const { authenticateToken } = require('../../middleware/auth');
const { userValidation, validate } = require('../../middleware/userValidation');

// Auth routes (no authentication required)
router.post('/login', AdminAuthController.login);

// Protected routes
router.use(authenticateToken);

// User management routes
router.post('/register', UserController.register);  // Simplified registration endpoint
router.post('/users', validate(userValidation.create), UserController.register);  // Full registration endpoint
router.get('/users', UserController.getAll);
router.get('/users/:id', UserController.getOne);
router.put('/users/:id', validate(userValidation.update), UserController.update);
router.delete('/users/:id', UserController.delete);
router.put('/users/:id/change-password', UserController.changePassword);

module.exports = router;
