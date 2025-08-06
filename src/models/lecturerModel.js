const db = require('../config/database');
const bcrypt = require('bcrypt');

class LecturerModel {
    static async getAllLecturers() {
        try {
            const [rows] = await db.query(`
                SELECT l.*, m.measures_number, m.measures_title 
                FROM lecturers l
                LEFT JOIN measurements m ON l.measures_id = m.id
                WHERE l.deleted_at IS NULL
                ORDER BY l.created_at DESC
            `);
            return rows.map(row => ({
                ...row,
                start_time: row.start_time,
                end_time: row.end_time,
                lecturer_id: String(row.lecturer_id).padStart(7, '0'),
                photo: row?.photo ? process.env.BACKEND_URL + row.photo : '',
                certificates: JSON.parse(row.certificates || '[]').map(cert => process.env.BACKEND_URL + cert)
            }));
        } catch (error) {
            throw error;
        }
    }

    static async getByLecturerId(id) {
        try {
            console.log('Looking up lecturer with ID:', id);
            const [rows] = await db.query(
                `SELECT l.*, m.measures_number, m.measures_title 
                 FROM lecturers l
                 LEFT JOIN measurements m ON l.measures_id = m.id
                 WHERE l.lecturer_id = ?`, 
                [id]
            );
            console.log('Found lecturer rows:', rows);
            if (rows[0]) {
                // Ensure lecturer_id is properly formatted
                rows[0].lecturer_id = String(rows[0].lecturer_id).padStart(7, '0');
            }
            return rows[0];
        } catch (error) {
            console.error('Error in getByLecturerId:', error);
            throw error;
        }
    }

    static async getLecturerById(id) {
        try {
            const [rows] = await db.query(
                `SELECT l.*, m.measures_number, m.measures_title 
                 FROM lecturers l
                 LEFT JOIN measurements m ON l.measures_id = m.id
                 WHERE l.lecturer_id = ?`, 
                [id]
            );
            if (!rows[0]) return null;
            return {
                ...rows[0],
                lecturer_id: String(rows[0].lecturer_id).padStart(7, '0'),
                photo: rows[0].photo ? process.env.BACKEND_URL + rows[0].photo.replace(process.env.BACKEND_URL, '') : '',
                certificates: JSON.parse(rows[0].certificates || '[]').map(cert => 
                    cert ? process.env.BACKEND_URL + cert.replace(process.env.BACKEND_URL, '') : ''
                )
            };
        } catch (error) {
            throw error;
        }
    }

    static async createLecturer(lecturerData) {
        try {
            // Get the next available ID
            const [maxIdResult] = await db.query('SELECT MAX(lecturer_id) as maxId FROM lecturers');
            const nextId = maxIdResult[0].maxId ? maxIdResult[0].maxId + 1 : 1122001;

            // Generate password with BAD prefix
            const plainPassword = `BAD${nextId}`;
            const hashedPassword = await bcrypt.hash(plainPassword, 10);

            // Insert with the next ID
            const result = await db.query(
                'INSERT INTO lecturers (lecturer_id, first_name, last_name, start_time, end_time, course, joining_date, photo, certificates, password, measures_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
                [nextId, lecturerData.first_name, lecturerData.last_name, lecturerData.start_time, lecturerData.end_time, lecturerData.course, lecturerData.joining_date, lecturerData.photo, JSON.stringify(lecturerData.certificates), hashedPassword, lecturerData.measures_id || null]
            );
            return nextId;
        } catch (error) {
            throw error;
        }
    }

    static async updateLecturer(id, lecturerData) {
        try {
            console.log("lecturerData", lecturerData);
            // If password is provided, use it, otherwise keep existing
            let query = 'UPDATE lecturers SET first_name = ?, last_name = ?, start_time = ?, end_time = ?, course = ?, joining_date = ?, photo = ?, certificates = ?, measures_id = ?';
            let params = [lecturerData.first_name, lecturerData.last_name, lecturerData.start_time, lecturerData.end_time, lecturerData.course, lecturerData.joining_date, lecturerData.photo, JSON.stringify(lecturerData.certificates), lecturerData.measures_id || null];

            if (lecturerData.password) {
                query += ', password = ?';
                params.push(lecturerData.password);
            }

            query += ' WHERE lecturer_id = ?';
            params.push(id);

            const result = await db.query(query, params);
            return result[0].affectedRows > 0;
        } catch (error) {
            throw error;
        }
    }

    static async deleteLecturer(id) {
        try {
            const [result] = await db.query(
                'UPDATE lecturers SET deleted_at = CURRENT_TIMESTAMP WHERE lecturer_id = ? AND deleted_at IS NULL',
                [id]
            );
            return result.affectedRows > 0;
        } catch (error) {
            throw error;
        }
    }

    static async deleteCertificate(lecturerId, certificateUrl) {
        try {
            // Get current certificates
            const [rows] = await db.query('SELECT certificates FROM lecturers WHERE lecturer_id = ?', [lecturerId]);
            if (!rows[0]) return false;

            // Parse certificates array
            const certificates = JSON.parse(rows[0].certificates || '[]');
            
            // Remove the specified certificate
            const updatedCertificates = certificates.filter(cert => cert !== certificateUrl);
            
            // Update the lecturer record
            const [result] = await db.query(
                'UPDATE lecturers SET certificates = ? WHERE lecturer_id = ?',
                [JSON.stringify(updatedCertificates), lecturerId]
            );

            return result.affectedRows > 0;
        } catch (error) {
            throw error;
        }
    }
    static async updatePassword(id, password) {
        try {
            // Password should already be hashed by the controller
            const [result] = await db.query(
                'UPDATE lecturers SET password = ? WHERE lecturer_id = ? AND deleted_at IS NULL',
                [password, id]
            );
            return result.affectedRows > 0;
        } catch (error) {
            throw error;
        }
    }

    static async login(lecturer_id, password) {
        try {
            console.log('Looking up lecturer with ID:', lecturer_id);
            // Keep the original ID format for the query
            const [rows] = await db.query(
                'SELECT * FROM lecturers WHERE lecturer_id = ? AND deleted_at IS NULL',
                [lecturer_id]
            );
            console.log('Found lecturer rows:', rows);

            if (!rows[0]) {
                console.log('No lecturer found');
                return null;
            }

            // If password is not hashed (legacy), hash it first
            if (rows[0].password && !rows[0].password.startsWith('$2')) {
                console.log('Legacy password found, hashing it...');
                const hashedPassword = await bcrypt.hash(rows[0].password, 10);
                await db.query(
                    'UPDATE lecturers SET password = ? WHERE lecturer_id = ?',
                    [hashedPassword, lecturer_id]
                );
                rows[0].password = hashedPassword;
            }

            // Compare password
            console.log('Attempting password comparison...');
            try {
                const isValidPassword = await bcrypt.compare(password, rows[0].password);
                console.log('Password comparison result:', isValidPassword);
                if (!isValidPassword) {
                    console.log('Password invalid');
                    return null;
                }
            } catch (error) {
                console.error('Error comparing passwords:', error);
                throw error;
            }

            console.log('Authentication successful, returning lecturer data');
            return {
                ...rows[0],
                lecturer_id: String(rows[0].lecturer_id).padStart(7, '0'),
                photo: rows[0].photo ? process.env.BACKEND_URL + rows[0].photo.replace(process.env.BACKEND_URL, '') : '',
                certificates: JSON.parse(rows[0].certificates || '[]').map(cert => 
                    cert ? process.env.BACKEND_URL + cert.replace(process.env.BACKEND_URL, '') : ''
                )
            };
        } catch (error) {
            throw error;
        }
    }
}

module.exports = LecturerModel;
