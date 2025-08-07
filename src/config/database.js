const mysql = require('mysql2');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  port: process.env.DB_PORT,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10, // Reduced to prevent resource exhaustion
  queueLimit: 0, // When 0, returns error immediately if no connections are available
  enableKeepAlive: true,
  keepAliveInitialDelay: 0
});

module.exports = pool.promise();
