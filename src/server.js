const express = require('express');
const path = require('path');
const cors = require('cors');
require('dotenv').config();

const adminRoutes = require('./routes/admin');
const studentRoutes = require('./routes/student');
const lecturerRoutes = require('./routes/lecturer');
const passwordRoutes = require('./routes/admin/passwordRoutes');
const feedbackEvaluationRoutes = require('./routes/admin/feedbackEvaluationRoutes');

const app = express();
const allowedOrigins = [
  'http://localhost:3000', 
  'http://localhost:3002',
  'http://localhost:5173',
  'http://127.0.0.1:3000',
  'http://127.0.0.1:3002',
  'http://127.0.0.1:5173',
  'http://192.168.31.19:3000',
  'https://testadmin.meteorinfotech.com',
  'https://student.meteorinfotech.com',
  'http://192.168.31.110:3000',
  'http://192.168.31.110:3001',
  'http://192.168.31.19:3002',
  'http://145.223.102.131:3000',
  'http://145.223.102.131:3001',
  'http://teilnehmerportal.bad-kursmanager.de',
  'http://verwaltung.bad-kursmanager.de',
  'https://teilnehmerportal.bad-kursmanager.de',
  'https://verwaltung.bad-kursmanager.de'
];

// CORS configuration
app.use((req, res, next) => {
    const origin = req.headers.origin;
    
    // Allow localhost development
    if (origin && (origin.startsWith('http://localhost:') || origin.startsWith('http://127.0.0.1:') || allowedOrigins.includes(origin))) {
        res.header('Access-Control-Allow-Origin', origin);
        res.header('Access-Control-Allow-Credentials', 'true');
        res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
        res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
        res.header('Access-Control-Expose-Headers', 'Content-Disposition');
    }

    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});

// Body parser middleware

// Body parser middleware
app.use(express.json());

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Special CORS handling for uploads directory
app.use('/uploads', (req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  }
  res.header('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

app.use('/uploads', express.static('uploads', {
  setHeaders: (res, path) => {
    if (path.endsWith('.pdf')) {
      res.set('Content-Type', 'application/pdf');
      res.set('Content-Disposition', 'inline');
    }
  }
}));


// Routes
app.use('/api/admin', adminRoutes);
app.use('/api/student', studentRoutes);
app.use('/api/lecturer', lecturerRoutes);
app.use('/api/admin', passwordRoutes);
app.use('/api/admin/feedback-evaluations', feedbackEvaluationRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log('BACKEND_URL:', process.env.BACKEND_URL);
});

