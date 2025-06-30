const express = require('express');
const router = express.Router();

// Import routes
const studentAuthRoutes = require('./student/authRoutes');
const studentRoutes = require('./student/studentRoutes');
const attendanceRoutes = require('./student/attendanceRoutes');
const lecturerRoutes = require('./lecturer');

// Mount routes
router.use('/api/student/auth', studentAuthRoutes);
router.use('/api/student', studentRoutes);
router.use('/api/student/attendance', attendanceRoutes);
router.use('/api/lecturer', lecturerRoutes);

module.exports = router;
