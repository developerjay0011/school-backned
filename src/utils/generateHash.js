const bcrypt = require('bcryptjs');

async function generateHash() {
    const password = 'SuperAdmin@123';
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    
    // Verify the hash
    const isValid = await bcrypt.compare(password, hash);
}

generateHash();
