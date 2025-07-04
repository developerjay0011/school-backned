const db = require('../config/database');
const bcrypt = require('bcryptjs');

class User {
  static async create(userData) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(userData.password, salt);
    const [result] = await db.execute(
      'INSERT INTO admin_users (first_name, last_name, phone_number, email, address, password, role, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [userData.firstName, userData.lastName, userData.phoneNumber, userData.email, userData.address, hashedPassword, userData.role || 'admin', userData.status]
    );
    return result.insertId;
  }

  static async findByEmail(email) {
    const [rows] = await db.execute('SELECT * FROM admin_users WHERE email = ?', [email]);
    return rows[0];
  }

  static async findById(id) {
    const [rows] = await db.execute('SELECT id, first_name, last_name, phone_number, email, address, role, status FROM admin_users WHERE id = ?', [id]);
    return rows[0];
  }

  static async findAll() {
    const [rows] = await db.execute('SELECT id, first_name, last_name, phone_number, email, address, role, status FROM admin_users');
    return rows;
  }

  static async update(id, userData) {
    const [result] = await db.execute(
      'UPDATE admin_users SET first_name = ?, last_name = ?, phone_number = ?, email = ?, address = ?, status = ? WHERE id = ?',
      [userData.firstName, userData.lastName, userData.phoneNumber, userData.email, userData.address, userData.status, id]
    );
    return result.affectedRows > 0;
  }

  static async delete(id) {
    const [result] = await db.execute('DELETE FROM admin_users WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }

  static async changePassword(id, hashedPassword) {
    const [result] = await db.execute('UPDATE admin_users SET password = ? WHERE id = ?', [hashedPassword, id]);
    return result.affectedRows > 0;
  }
}

module.exports = User;
