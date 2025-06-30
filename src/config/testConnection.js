const db = require('./database');

async function testConnection() {
  try {
    const [rows] = await db.execute('SELECT 1');
    console.log('✅ Database connection successful!');
    
    // Test if we can access the admin_users table
    const [users] = await db.execute('SELECT COUNT(*) as count FROM admin_users');
    console.log('✅ Admin users table exists with', users[0].count, 'records');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    process.exit(1);
  }
}

testConnection();
