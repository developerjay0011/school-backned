const StudentInvoice = require('../models/studentInvoiceModel');
const StudentModel = require('../models/studentModel');
const PDFGenerator = require('../utils/pdfGenerator');
const db = require('../config/database');

class InvoiceReminderService {
    static async toggleAutoDispatch(invoiceId, enabled) {
     let connection;
        try {
            connection = await db.getConnection();
            await connection.beginTransaction();

            // Check if invoice exists
            const [invoices] = await connection.execute(
                'SELECT * FROM student_invoices WHERE id = ?',
                [invoiceId]
            );

            if (invoices.length === 0) {
                throw new Error('Invoice not found');
            }

            // Update reminder_auto_dispatch
            await connection.execute(
                'UPDATE student_invoices SET reminder_auto_dispatch = ? WHERE id = ?',
                [enabled ? 1 : 0, invoiceId]
            );

            await connection.commit();
            return {
                success: true,
                message: `Auto-dispatch ${enabled ? 'enabled' : 'disabled'} for invoice ${invoiceId}`,
                invoiceId,
                autoDispatchEnabled: enabled
            };
        } catch (error) {
            await connection.rollback();
            console.error('Error toggling auto-dispatch:', error);
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

    static async processReminders() {
     let connection;
        try {
            connection = await db.getConnection();
            await connection.beginTransaction();

            // Get all unpaid invoices that have reminder_auto_dispatch=1 and are due
            const [invoices] = await connection.execute(`
                SELECT i.*, 
                       COALESCE(COUNT(r.id), 0) as reminder_count
                FROM student_invoices i
                LEFT JOIN invoice_reminders r ON i.id = r.invoice_id
                WHERE i.payment_status = 'unpaid' 
                AND i.reminder_auto_dispatch = 1
                AND i.invoice_date <= DATE_SUB(CURDATE(), INTERVAL 14 DAY)
                AND (
                    SELECT COUNT(*) 
                    FROM invoice_reminders 
                    WHERE invoice_id = i.id
                ) < 3
                GROUP BY i.id
                HAVING (
                    reminder_count = 0 OR
                    (reminder_count > 0 AND 
                     (SELECT MAX(reminder_date) 
                      FROM invoice_reminders 
                      WHERE invoice_id = i.id) <= DATE_SUB(CURDATE(), INTERVAL 14 DAY))
                )
            `);

            for (const invoice of invoices) {
                // Get student data
                const studentData = await StudentModel.getByStudentId(invoice.student_id);
                
                // Generate reminder PDF
                const pdfData = {
                    authority_name: studentData.authority.name,
                    authority_bg_number: studentData.authority.bg_number,
                    authority_street: studentData.authority.street,
                    authority_city: studentData.authority.city,
                    authority_contact_person: studentData.authority.contact_person,
                    authority_postal_code: studentData.authority.postal_code,
                    student_name: studentData.first_name + ' ' + studentData.last_name,
                    invoice_number: invoice.invoice_number,
                    invoice_date: invoice.invoice_date,
                    invoice_amount: invoice.amount,
                    measures: studentData.measures,
                    reminder_number: invoice.reminder_count + 1
                };

                const pdfResult = await PDFGenerator.generateMahnungPDF(pdfData);

                // Create reminder record
                await connection.execute(
                    `INSERT INTO invoice_reminders (
                        invoice_id, 
                        reminder_number, 
                        reminder_date, 
                        pdf_path
                    ) VALUES (?, ?, CURDATE(), ?)`,
                    [invoice.id, invoice.reminder_count + 1, pdfResult.filePath]
                );
            }

            await connection.commit();
            return { success: true, remindersProcessed: invoices.length };
        } catch (error) {
            await connection.rollback();
            console.error('Error processing reminders:', error);
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

    static async createManualReminder(invoiceId) {
        if (!invoiceId) {
            throw new Error('Invoice ID is required');
        }

     let connection;
        try {
            connection = await db.getConnection();
            await connection.beginTransaction();

            // Get invoice details
            const [invoices] = await connection.execute(
                'SELECT * FROM student_invoices WHERE id = ?',
                [invoiceId]
            );

            if (invoices.length === 0) {
                throw new Error('Invoice not found');
            }

            const invoice = invoices[0];

            // Check reminder count
            const [reminders] = await connection.execute(
                'SELECT COUNT(*) as count FROM invoice_reminders WHERE invoice_id = ?',
                [invoiceId]
            );

            const reminderCount = reminders[0].count || 0;
            if (reminderCount >= 3) {
                throw new Error('Maximum number of reminders (3) already sent');
            }

            // Get student data
            const studentData = await StudentModel.getByStudentId(invoice.student_id);
            if (!studentData || !studentData.authority) {
                throw new Error('Student or authority data not found');
            }

            // Generate reminder PDF
            const pdfData = {
                authority_name: studentData.authority.name || '',
                authority_bg_number: studentData.authority.bg_number || '',
                authority_street: studentData.authority.street || '',
                authority_city: studentData.authority.city || '',
                authority_contact_person: studentData.authority.contact_person || '',
                authority_postal_code: studentData.authority.postal_code || '',
                student_name: `${studentData.first_name || ''} ${studentData.last_name || ''}`.trim(),
                invoice_number: invoice.invoice_number || '',
                invoice_date: invoice.invoice_date || new Date().toISOString().split('T')[0],
                invoice_amount: invoice.amount || 0,
                measures: studentData.measures || [],
                measures_number: studentData.measures_number || '',
                reminder_number: reminderCount + 1
            };

            const pdfResult = await PDFGenerator.generateMahnungPDF(pdfData);
            if (!pdfResult || !pdfResult.path) {
                throw new Error('Failed to generate reminder PDF');
            }

            // Create reminder record
            const nextReminderNumber = reminderCount + 1;
            await connection.execute(
                `INSERT INTO invoice_reminders (
                    invoice_id, 
                    reminder_number, 
                    reminder_date, 
                    pdf_path
                ) VALUES (?, ?, CURDATE(), ?)`,
                [invoiceId, nextReminderNumber, `/uploads/mahnung/${pdfResult.filename}`]
            );

            await connection.commit();
            return {
                success: true,
                reminderNumber: nextReminderNumber,
                pdfPath: pdfResult.path,
                pdfUrl: process.env.BACKEND_URL + pdfResult.url
            };
        } catch (error) {
            await connection.rollback();
            console.error('Error creating manual reminder:', error);
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



module.exports = InvoiceReminderService;
