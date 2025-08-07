const db = require('../config/database');
const bcrypt = require('bcryptjs');

class User {
    // Helper method to format ID
    static formatId(id) {
        return String(id).padStart(7, '0');
    }

    static async create(data) {
        const connection = await db.getConnection();
        try {
            // Add timestamp to email if it already exists
            const timestamp = Date.now();
            const email = data.email;

            // Check if email exists
            const [existingEmail] = await connection.execute(
                'SELECT id FROM admin_users WHERE email = ?',
                [email]
            );

            // If email exists, insert timestamp before @
            if (existingEmail.length > 0) {
                const [localPart, domain] = email.split('@');
                data.email = `${localPart}_${timestamp}@${domain}`;
            }

            const hashedPassword = await bcrypt.hash(data.password, 10);
            const [result] = await connection.execute(
                `INSERT INTO admin_users (
                    first_name, last_name, phone_number, 
                    email, street, pincode, city, country,
                    password, role, status, reason_non_participation
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    data.first_name, data.last_name, 
                    data.phone_number, data.email, data.street,
                    data.pincode, data.city, data.country,
                    hashedPassword, data.role || 'admin', 
                    data.status || 'Active',
                    data.reason_non_participation || null
                ]
            );
            return result.insertId;
        } catch (error) {
            throw error;
        } finally {
            connection.release();
        }
    }

    static async createMinimal(data) {
        const connection = await db.getConnection();
        try {
            if (!data.first_name || !data.last_name || !data.password) {
                throw new Error('First name, last name, and password are required');
            }

            // Check if email exists
            if (data.email) {
                const [existingEmail] = await connection.execute(
                    'SELECT id FROM admin_users WHERE email = ?',
                    [data.email]
                );

                if (existingEmail.length > 0) {
                    throw new Error('Email already exists');
                }
            }

            const hashedPassword = await bcrypt.hash(data.password, 10);
            
            // Prepare insert data with proper null handling
            const params = [
                data.first_name,
                data.last_name,
                hashedPassword,
                data.role || 'admin',
                data.status || 'Active',
                data.phone_number || null,
                data.email || null,
                data.street || null,
                data.pincode || null,
                data.city || null,
                data.country || null,
                data.reason_non_participation || null
            ];

            const [result] = await connection.execute(
                `INSERT INTO admin_users (
                    first_name, last_name, password,
                    role, status, phone_number, email, street,
                    pincode, city, country, reason_non_participation
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                params
            );
            return result.insertId;
        } catch (error) {
            throw error;
        } finally {
            connection.release();
        }
    }

    static async getAll() {
        const connection = await db.getConnection();
        try {
            const [rows] = await connection.execute(
                `SELECT id, first_name, last_name, 
                phone_number, email, street, pincode, city, 
                country, role, status, reason_non_participation,
                created_at, updated_at 
                FROM admin_users
                WHERE deleted_at IS NULL
                ORDER BY created_at DESC`
            );
            return rows.map(row => ({
                ...row,
                id: this.formatId(row.id)
            }));
        } catch (error) {
            throw error;
        } finally {
            connection.release();
        }
    }

    static async getById(id) {
        const connection = await db.getConnection();
        try {
            const [rows] = await connection.execute(
                `SELECT id, first_name, last_name, 
                phone_number, email, street, pincode, city, 
                country, role, status, created_at, updated_at 
                FROM admin_users WHERE id = ? AND deleted_at IS NULL`,
                [id]
            );
            if (rows[0]) {
                return {
                    ...rows[0],
                    id: this.formatId(rows[0].id)
                };
            }
            return null;
        } catch (error) {
            throw error;
        } finally {
            connection.release();
        }
    }

    static async update(id, data) {
        const connection = await db.getConnection();
        try {
            const updates = [];
            const values = [];
            
            // Build dynamic update query
          
            if (data.first_name) {
                updates.push('first_name = ?');
                values.push(data.first_name);
            }
            if (data.last_name) {
                updates.push('last_name = ?');
                values.push(data.last_name);
            }
            if (data.phone_number) {
                updates.push('phone_number = ?');
                values.push(data.phone_number);
            }
            if (data.email) {
                updates.push('email = ?');
                values.push(data.email);
            }
            if (data.street) {
                updates.push('street = ?');
                values.push(data.street);
            }
            if (data.pincode) {
                updates.push('pincode = ?');
                values.push(data.pincode);
            }
            if (data.city) {
                updates.push('city = ?');
                values.push(data.city);
            }
            if (data.country) {
                updates.push('country = ?');
                values.push(data.country);
            }
            if (data.password) {
                updates.push('password = ?');
                values.push(await bcrypt.hash(data.password, 10));
            }
            if (data.role) {
                updates.push('role = ?');
                values.push(data.role);
            }
            if (data.status) {
                updates.push('status = ?');
                values.push(data.status);
            }

            if (updates.length === 0) {
                return true; // No updates needed
            }

            values.push(id);
            const [result] = await connection.execute(
                `UPDATE admin_users SET ${updates.join(', ')} WHERE id = ?`,
                values
            );
            return result.affectedRows > 0;
        } catch (error) {
            throw error;
        } finally {
            connection.release();
        }
    }

    static async delete(id) {
        const connection = await db.getConnection();
        try {
            const [result] = await connection.execute(
                'UPDATE admin_users SET deleted_at = CURRENT_TIMESTAMP WHERE id = ? AND deleted_at IS NULL',
                [id]
            );
            return result.affectedRows > 0;
        } catch (error) {
            throw error;
        } finally {
            connection.release();
        }
    }

    static async findByEmail(email) {
        const connection = await db.getConnection();
        try {
            const [rows] = await connection.execute(
                'SELECT * FROM admin_users WHERE email = ? AND deleted_at IS NULL',
                [email]
            );
            if (rows[0]) {
                return {
                    ...rows[0],
                    id: this.formatId(rows[0].id)
                };
            }
            return null;
        } catch (error) {
            throw error;
        } finally {
            connection.release();
        }
    }
}

module.exports = User;
