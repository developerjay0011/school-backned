const express = require('express');
const cors = require('cors');
const path = require('path');
const CronService = require('./services/cronService');
const quizService = require('./services/quizService');

// Initialize services
CronService.initialize();
quizService.loadQuizzes().catch(err => {
    console.error('Failed to load quizzes:', err);
});

// Import routes
const monthlyReportRoutes = require('./routes/lecturer/monthlyReportRoutes');
const adminRoutes = require('./routes/admin');
const studentFileRoutes = require('./routes/admin/studentFileRoutes');
const quizRoutes = require('./routes/student/quizRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// API routes
app.use('/api/lecturer', monthlyReportRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/admin', studentFileRoutes);
app.use('/api/student/quizzes', quizRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Internal server error'
    });
});

module.exports = app;
