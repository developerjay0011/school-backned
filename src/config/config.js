require('dotenv').config();

module.exports = {
    backendUrl: process.env.BACKEND_URL || 'http://localhost:3000'
};
