const path = require('path');
const StudentInvoice = require('../../models/studentInvoiceModel');
const db = require('../../config/database');
const StudentModel = require('../../models/studentModel');
const PDFGenerator = require('../../utils/pdfGenerator');
const InvoiceReminderService = require('../../services/invoiceReminderService');
const EmailService = require('../../utils/emailService');

class StudentInvoiceController {
    static async toggleAutoDispatch(req, res) {
        try {
            const result = await InvoiceReminderService.toggleAutoDispatch(
                req.params.id,
                req.body.enabled
            );
            
            res.status(200).json({
                success: true,
                message: result.message,
                data: {
                    invoiceId: result.invoiceId,
                    autoDispatchEnabled: result.autoDispatchEnabled
                }
            });
        } catch (error) {
            console.error('Error toggling auto-dispatch:', error);
            res.status(error.message.includes('not found') ? 404 : 500).json({
                success: false,
                message: error.message || 'Internal server error'
            });
        }
    }

    static async createReminder(req, res) {
        try {
            const result = await InvoiceReminderService.createManualReminder(req.params.id);
            
            res.status(200).json({
                success: true,
                message: `Reminder ${result.reminderNumber} created successfully`,
                data: result
            });
        } catch (error) {
            console.error('Error creating reminder:', error);
            res.status(error.message.includes('not found') ? 404 : 
                      error.message.includes('Maximum number') ? 400 : 500)
               .json({
                    success: false,
                    message: error.message || 'Internal server error'
                });
        }
    }

    static async create(req, res) {
        const connection = await db.getConnection();
        try {
            const studentId = req.params.studentId;

            // Check if student exists
            const [student] = await connection.execute(
                'SELECT student_id FROM student WHERE student_id = ?',
                [studentId]     
            );

            if (student.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Student not found'
                });
            } 
            const studentData = await StudentModel.getByStudentId(studentId);

            const pdfdata = {
                authority_name: studentData.invoice_company || studentData.authority.name,
                authority_bg_number: studentData.authority.bg_number,
                authority_street: studentData.invoice_street || studentData.authority.street,
                authority_city: studentData.invoice_city || studentData.authority.city,
                authority_contact_person: studentData.invoice_contact_person || studentData.authority.contact_person,
                authority_postal_code: studentData.invoice_postal_code || studentData.authority.postal_code,
                student_name: studentData.first_name + ' ' + studentData.last_name,
                invoice_number: req.body.invoice_number,
                invoice_date: req.body.invoice_date,
                invoice_amount: req.body.amount,
                invoice_type: req.body.invoice_type,
                measures_number: studentData.measures_number || '',
                measures: studentData.measures_title || '',
                reminder_number: 1,
                invoice_recipients: req.body.invoice_recipients
            }
            const pdfResult = await PDFGenerator.generateBAD(pdfdata);
           

            const invoiceId = await StudentInvoice.create(studentId, {
                ...req.body,
                pdf_url: pdfResult.pdf.url,
                xml_url: pdfResult.xml.url
            });
            const createdInvoice = await StudentInvoice.getById(invoiceId);

            // Send invoice reminder email
            if (studentData.authority.email) {
                try {
                    const dueDate = new Date(req.body.invoice_date);
                    dueDate.setDate(dueDate.getDate() + 14); // Due date is 14 days after invoice date

                    await EmailService.sendInvoiceReminderEmail({
                        email: studentData.authority.email,
                        invoiceNumber: req.body.invoice_number,
                        bgNumber: studentData.authority.bg_number,
                        invoiceDate: new Date(req.body.invoice_date).toLocaleDateString('de-DE'),
                        dueDate: dueDate.toLocaleDateString('de-DE'),
                        amount: new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(req.body.amount),
                        pdfPath: pdfResult.pdf.path
                    });
                    console.log('Invoice reminder email sent successfully');
                } catch (emailError) {
                    console.error('Error sending invoice reminder email:', emailError);
                    // Don't fail the request if email fails
                }
            } else {
                console.log('No authority email found, skipping invoice reminder email');
            }

            console.log("pdfResult",pdfResult);
            res.status(201).json({
                success: true,
                message: 'Invoice created successfully',
                data: createdInvoice
            });
        } catch (error) {
            console.error('Error creating invoice:', error);
            res.status(500).json({
                success: false,
                message: 'Error creating invoice',
                error: error.message
            });
        } finally {
            connection.release();
        }
    }

    static async update(req, res) {
        const connection = await db.getConnection();
        try {
            const { id } = req.params;

            const invoice = await StudentInvoice.getById(id);
            if (!invoice) {
                return res.status(404).json({
                    success: false,
                    message: 'Invoice not found'
                });
            }
            const studentData = await StudentModel.getByStudentId(invoice.student_id);

            const pdfdata = {
                authority_name: studentData.invoice_company || studentData.authority.name,
                authority_bg_number: studentData.authority.bg_number,
                authority_street: studentData.invoice_street || studentData.authority.street,
                authority_city: studentData.invoice_city || studentData.authority.city,
                authority_contact_person: studentData.invoice_contact_person || studentData.authority.contact_person,
                authority_postal_code: studentData.invoice_postal_code || studentData.authority.postal_code,
                student_name: studentData.first_name + ' ' + studentData.last_name,
                invoice_number: req.body.invoice_number,
                invoice_date: req.body.invoice_date,
                invoice_amount: req.body.amount,
                invoice_type: req.body.invoice_type,
                measures_number: studentData.measures_number || '',
                measures: studentData.measures_title || '',
                reminder_number: 1,
                invoice_recipients: req.body.invoice_recipients
            }
            const pdfResult = await PDFGenerator.generateBAD(pdfdata);
           
            await StudentInvoice.update(id, {
                ...req.body,
                pdf_url: pdfResult.pdf.url,
                xml_url: pdfResult.xml.url
            });
            const updatedInvoice = await StudentInvoice.getById(id);

            res.json({
                success: true,
                message: 'Invoice updated successfully',
                data: updatedInvoice
            });
        } catch (error) {
            console.error('Error updating invoice:', error);
            res.status(500).json({
                success: false,
                message: 'Error updating invoice',
                error: error.message
            });
        } finally {
            connection.release();
        }
    }
    static async mahnungPDF(req, res) {
        const connection = await db.getConnection();
        try {
            const { id } = req.params;

            const invoice = await StudentInvoice.getById(id);
            console.log('Invoice from getById:', invoice);
            if (!invoice) {
                return res.status(404).json({
                    success: false,
                    message: 'Invoice not found'
                });
            }
            console.log('Student ID from invoice:', invoice.student_id);
            const studentData = await StudentModel.getByStudentId(invoice.student_id);
            console.log('Student data:', studentData);
            console.log("studentinvoiceData",invoice);
            const pdfdata = {
                authority_name: studentData.invoice_company || studentData.authority.name,
                authority_bg_number: studentData.authority.bg_number,
                authority_street: studentData.invoice_street || studentData.authority.street,
                authority_city: studentData.invoice_city || studentData.authority.city,
                authority_contact_person: studentData.invoice_contact_person || studentData.authority.contact_person,
                authority_postal_code: studentData.invoice_postal_code || studentData.authority.postal_code,
                student_name: studentData.first_name + ' ' + studentData.last_name,
                invoice_number: invoice.invoice_number,
                invoice_date: invoice.invoice_date,
                invoice_amount: invoice.amount,
                measures: studentData.measures,
                measures_number: studentData.measures_number,
                measures_title: studentData.measures_title,
            }
            const pdfResult = await PDFGenerator.generateMahnungPDF(pdfdata);

            await StudentInvoice.update(id, {...invoice,reminder_sent: 1});
            const updatedInvoice = await StudentInvoice.getById(id);

            // Send invoice reminder email
            console.log("studentData",studentData.authority.email);
            if (studentData.authority.email) {
                try {
                    await EmailService.sendInvoiceReminderEmail({
                        email: studentData.authority.email,
                        invoiceNumber: invoice.invoice_number,
                        bgNumber: studentData.authority.bg_number,
                        invoiceDate: invoice.invoice_date,
                        dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toLocaleDateString('de-DE'),
                        amount: invoice.amount.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' }),
                        pdfPath: path.join(process.cwd(), 'uploads', 'mahnung', path.basename(pdfResult.url))
                    });
                    console.log('Invoice reminder email sent successfully');
                } catch (emailError) {
                    console.error('Error sending invoice reminder email:', emailError);
                    // Don't fail the request if email fails
                }
            } else {
                console.log('No authority email found, skipping invoice reminder email');
            }

            res.json({
                success: true,
                message: 'Invoice reminder sent successfully',
                data: updatedInvoice,
                url: pdfResult.url
            });
        } catch (error) {
            console.error('Error updating invoice:', error);
            res.status(500).json({
                success: false,
                message: 'Error updating invoice',
                error: error.message
            });
        } finally {
            connection.release();
        }
    }

    static async delete(req, res) {
        const connection = await db.getConnection();
        try {
            const { id } = req.params;

            const invoice = await StudentInvoice.getById(id);
            if (!invoice) {
                return res.status(404).json({
                    success: false,
                    message: 'Invoice not found'
                });
            }

            await StudentInvoice.delete(id);

            res.json({
                success: true,
                message: 'Invoice deleted successfully'
            });
        } catch (error) {
            console.error('Error deleting invoice:', error);
            res.status(500).json({
                success: false,
                message: 'Error deleting invoice',
                error: error.message
            });
        } finally {
            connection.release();
        }
    }

    static async cancel(req, res) {
        const connection = await db.getConnection();
        try {
            const { id } = req.params;

            // Cancel the invoice
            const invoice = await StudentInvoice.cancel(id);

            // Get student data for PDF generation
            const studentData = await StudentModel.getByStudentId(invoice.student_id);

            // Generate storno PDF
            const pdfdata = {
                authority_name: studentData.invoice_company || studentData.authority.name,
                authority_bg_number: studentData.authority.bg_number,
                authority_street: studentData.invoice_street || studentData.authority.street,
                authority_city: studentData.invoice_city || studentData.authority.city,
                authority_contact_person: studentData.invoice_contact_person || studentData.authority.contact_person,
                authority_postal_code: studentData.invoice_postal_code || studentData.authority.postal_code,
                student_name: studentData.first_name + ' ' + studentData.last_name,
                invoice_number: invoice.invoice_number,
                invoice_date: invoice.invoice_date,
                invoice_amount: invoice.amount,
                invoice_type: invoice.invoice_type,
                measures_number: studentData.measures_number || '',
                measures: studentData.measures_title || '',
                isStorno: true
            };

            const pdfResult = await PDFGenerator.generateBAD(pdfdata);

            // Update invoice with storno PDF URL
            await StudentInvoice.update(id, {
                storno_pdf_url:  process.env.BACKEND_URL + pdfResult.pdf.url
            });

            // Get updated invoice data
            const updatedInvoice = await StudentInvoice.getById(id);

            res.json({
                success: true,
                message: 'Invoice cancelled successfully',
                data: updatedInvoice
            });
        } catch (error) {
            console.error('Error cancelling invoice:', error);
            res.status(error.message.includes('not found') ? 404 : 500).json({
                success: false,
                message: error.message || 'Error cancelling invoice'
            });
        } finally {
            connection.release();
        }
    }

    static async getByStudentId(req, res) {
        const connection = await db.getConnection();
        try {
            const { studentId } = req.params;

            // Check if student exists
            const [student] = await connection.execute(
                'SELECT student_id FROM student WHERE student_id = ?',
                [studentId]
            );

            if (student.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Student not found'
                });
            }

            const invoices = await StudentInvoice.getByStudentId(studentId);

            res.json({
                success: true,
                message: 'Invoices retrieved successfully',
                data:invoices.map(invoice => ({
                    ...invoice,
                    xml_url: invoice.xml_url ? process.env.BACKEND_URL + invoice.xml_url : null,
                    pdf_url: invoice.pdf_url ? process.env.BACKEND_URL + invoice.pdf_url : null
                }))
            });
        } catch (error) {
            console.error('Error retrieving invoices:', error);
            res.status(500).json({
                success: false,
                message: 'Error retrieving invoices',
                error: error.message
            });
        } finally {
            connection.release();
        }
    }

    static async getAll(req, res) {
        try {
            const invoices = await StudentInvoice.getAll();

            res.json({
                success: true,
                message: 'All invoices retrieved successfully',
                data: invoices.map(invoice => ({
                    ...invoice,
                    pdf_url: process.env.BACKEND_URL + invoice.pdf_url
                }))
            });
        } catch (error) {
            console.error('Error retrieving all invoices:', error);
            res.status(500).json({
                success: false,
                message: 'Error retrieving all invoices',
                error: error.message
            });
        }
    }
}

module.exports = StudentInvoiceController;
