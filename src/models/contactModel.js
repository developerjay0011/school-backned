const db = require('../config/database');

class Contact {
    static async getByStudent(studentId) {
     let connection;
        try {
            connection = await db.getConnection();
            const [contact] = await connection.execute(
                'SELECT * FROM student_contact_details WHERE student_id = ?',
                [studentId]
            );
            return contact[0];
        } finally {
            if (connection) {
                try {
                    connection.release();
                    console.log('Connection released in User.delete');
                } catch (releaseError) {
                    console.error('Error releasing connection in User.delete:', releaseError);
                }
            }
        }
    }

    static async create(studentId, contactData) {
     let connection;
        try {
            connection = await db.getConnection();
            await connection.beginTransaction();

            const fields = ['student_id'];
            const values = [studentId];

            Object.entries(contactData).forEach(([key, value]) => {
                if (value !== undefined) {
                    fields.push(key);
                    values.push(value);
                }
            });

            await connection.execute(
                `INSERT INTO student_contact_details (${fields.join(', ')}) VALUES (${'?, '.repeat(fields.length - 1)}?)`,
                values
            );

            await connection.commit();
            return true;
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            if (connection) {
                try {
                    connection.release();
                    console.log('Connection released in User.delete');
                } catch (releaseError) {
                    console.error('Error releasing connection in User.delete:', releaseError);
                }
            }
        }
    }

    static async update(studentId, contactData) {
     let connection;
        try {
            connection = await db.getConnection();
            await connection.beginTransaction();

            const updateFields = [];
            const updateValues = [];

            Object.entries(contactData).forEach(([key, value]) => {
                if (value !== undefined) {
                    updateFields.push(`${key} = ?`);
                    updateValues.push(value);
                }
            });

            if (updateFields.length > 0) {
                await connection.execute(
                    `UPDATE student_contact_details SET ${updateFields.join(', ')} WHERE student_id = ?`,
                    [...updateValues, studentId]
                );
            }

            await connection.commit();
            return true;
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            if (connection) {
                try {
                    connection.release();
                    console.log('Connection released in User.delete');
                } catch (releaseError) {
                    console.error('Error releasing connection in User.delete:', releaseError);
                }
            }
        }
    }
}

module.exports = Contact;
