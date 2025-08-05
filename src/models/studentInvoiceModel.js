const db = require('../config/database');

class StudentInvoice {
    static async create(studentId, invoiceData) {
        const connection = await db.getConnection();
        try {
            await connection.beginTransaction();

            const [result] = await connection.execute(
                `INSERT INTO student_invoices (
                    student_id, invoice_number, invoice_date, amount,
                    invoice_type, reminder_sent, reminder_auto_dispatch,
                    paid, paid_date, pdf_url, xml_url
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    studentId,
                    invoiceData.invoice_number,
                    invoiceData.invoice_date,
                    invoiceData.amount,
                    invoiceData.invoice_type,
                    invoiceData.reminder_sent || false,
                    invoiceData.reminder_auto_dispatch || false,
                    invoiceData.paid || false,
                    invoiceData.paid_date || null,
                    invoiceData.pdf_url || null,
                    invoiceData.xml_url || null
                ]
            );

            await connection.commit();
            return result.insertId;
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }

    static async update(id, invoiceData) {
        const connection = await db.getConnection();
        try {
            await connection.beginTransaction();

            const updateFields = [];
            const updateValues = [];

            // Remove reminder-related fields that are computed
            const { reminder_list, reminders, ...cleanData } = invoiceData;

            Object.entries(cleanData).forEach(([key, value]) => {
                if (value !== undefined) {
                    updateFields.push(`${key} = ?`);
                    updateValues.push(value);
                }
            });

            if (updateFields.length === 0) {
                throw new Error('No fields to update');
            }

            await connection.execute(
                `UPDATE student_invoices SET ${updateFields.join(', ')} WHERE id = ?`,
                [...updateValues, id]
            );

            await connection.commit();
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }

    static async cancel(id) {
        const connection = await db.getConnection();
        try {
            await connection.beginTransaction();

            // Get the invoice details
            const [invoices] = await connection.execute(
                'SELECT * FROM student_invoices WHERE id = ?',
                [id]
            );

            if (invoices.length === 0) {
                throw new Error('Invoice not found');
            }

            const invoice = invoices[0];
            if (invoice.cancelled) {
                throw new Error('Invoice is already cancelled');
            }

            // Update the invoice as cancelled
            await connection.execute(
                'UPDATE student_invoices SET cancelled = TRUE, cancelled_date = NOW() WHERE id = ?',
                [id]
            );

            await connection.commit();
            return invoice;
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }

    static async delete(id) {
        const connection = await db.getConnection();
        try {
            await connection.beginTransaction();
            await connection.execute('DELETE FROM student_invoices WHERE id = ?', [id]);
            await connection.commit();
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }

    static async getById(id) {
        const connection = await db.getConnection();
        try {
            const [invoices] = await connection.execute(
                `SELECT i.*, 
                    CASE 
                        WHEN COUNT(r.id) > 0 THEN
                            GROUP_CONCAT(
                                JSON_OBJECT(
                                    'id', r.id,
                                    'reminder_number', r.reminder_number,
                                    'reminder_date', DATE_FORMAT(r.reminder_date, '%Y-%m-%d'),
                                    'pdf_path', CONCAT(?, r.pdf_path)
                                )
                            )
                        ELSE NULL
                    END as reminder_list
                FROM student_invoices i
                LEFT JOIN invoice_reminders r ON i.id = r.invoice_id
                WHERE i.id = ?
                GROUP BY i.id`,
                [process.env.BACKEND_URL, id]
            );

            if (!invoices[0]) return null;

            const invoice = invoices[0];
            invoice.reminders = invoice.reminder_list 
                ? JSON.parse(`[${invoice.reminder_list}]`)
                : [];

            return invoice;
        } finally {
            connection.release();
        }
    }

    static async getByStudentId(studentId) {
        const connection = await db.getConnection();
        try {
            const [invoices] = await connection.execute(
                `SELECT i.*, 
                    CASE 
                        WHEN COUNT(r.id) > 0 THEN
                            GROUP_CONCAT(
                                JSON_OBJECT(
                                    'id', r.id,
                                    'reminder_number', r.reminder_number,
                                    'reminder_date', DATE_FORMAT(r.reminder_date, '%Y-%m-%d'),
                                    'pdf_path', CONCAT(?, r.pdf_path)
                                )
                            )
                        ELSE NULL
                    END as reminder_list
                FROM student_invoices i
                LEFT JOIN invoice_reminders r ON i.id = r.invoice_id
                WHERE i.student_id = ?
                GROUP BY i.id
                ORDER BY i.invoice_date DESC, i.id DESC`,
                [process.env.BACKEND_URL, studentId]
            );

            return invoices.map(invoice => ({
                ...invoice,
                reminders: invoice.reminder_list 
                    ? JSON.parse(`[${invoice.reminder_list}]`)
                    : []
            }));
        } finally {
            connection.release();
        }
    }

    static async getAll() {
        const connection = await db.getConnection();
        try {
            const [invoices] = await connection.execute(
                `SELECT i.*, 
                    CASE 
                        WHEN COUNT(r.id) > 0 THEN
                            GROUP_CONCAT(
                                JSON_OBJECT(
                                    'id', r.id,
                                    'reminder_number', r.reminder_number,
                                    'reminder_date', DATE_FORMAT(r.reminder_date, '%Y-%m-%d'),
                                    'pdf_path', CONCAT(?, r.pdf_path)
                                )
                            )
                        ELSE NULL
                    END as reminder_list
                FROM student_invoices i
                LEFT JOIN invoice_reminders r ON i.id = r.invoice_id
                GROUP BY i.id
                ORDER BY i.invoice_date DESC, i.id DESC`,
                [process.env.BACKEND_URL]
            );

            return invoices.map(invoice => ({
                ...invoice,
                reminders: invoice.reminder_list 
                    ? JSON.parse(`[${invoice.reminder_list}]`)
                    : []
            }));
        } finally {
            connection.release();
        }
    }
}

module.exports = StudentInvoice;
