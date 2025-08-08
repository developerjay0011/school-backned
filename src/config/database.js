const mysql = require('mysql2');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  port: process.env.DB_PORT,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 25, // Increased to handle more concurrent connections
  queueLimit: 0, // When 0, returns error immediately if no connections are available
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
  // Add connection timeout to prevent hanging connections
  connectTimeout: 10000 // 10 seconds
});

// Add event listeners for connection pool
pool.on('connection', function (connection) {
  console.log('DB Connection established');
});

pool.on('release', function (connection) {
  console.log('Connection %d released', connection.threadId);
});

pool.on('acquire', function (connection) {
  console.log('Connection %d acquired', connection.threadId);
});

pool.on('enqueue', function () {
  console.log('Waiting for available connection slot');
});

module.exports = pool.promise();
