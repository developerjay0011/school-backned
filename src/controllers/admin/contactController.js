const Contact = require('../../models/contactModel');
const db = require('../../config/database');

class ContactController {
    static async getByStudent(req, res) {
        try {
            const studentId = req.params.studentId;

            // Check if student exists
            const [student] = await db.execute(
                'SELECT * FROM student WHERE student_id = ?',
                [studentId]
            );

            if (student.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Student not found'
                });
            }

            const contact = await Contact.getByStudent(studentId);

            if (!contact) {
                return res.status(200).json({
                    success: true,
                    data: null
                });
            }

            res.json({
                success: true,
                data: contact
            });
        } catch (error) {
            console.error('Error fetching contact details:', error);
            res.status(500).json({
                success: false,
                message: 'Error fetching contact details',
                error: error.message
            });
        }
    }

    static async update(req, res) {
        try {
            const studentId = req.params.studentId;

            // Check if student exists
            const [student] = await db.execute(
                'SELECT * FROM student WHERE student_id = ?',
                [studentId]
            );

            if (student.length == 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Student not found'
                });
            }

            // Check if contact details exist
            const contact = await Contact.getByStudent(studentId);

            if (!contact) {
                // No contact exists, create new
                await Contact.create(studentId, req.body);
            } else {
                // Contact exists, update it
                await Contact.update(studentId, req.body);
            }

            const updatedContact = await Contact.getByStudent(studentId);

            res.json({
                success: true,
                message: 'Contact details updated successfully',
                data: updatedContact
            });
        } catch (error) {
            console.error('Error updating contact details:', error);
            res.status(500).json({
                success: false,
                message: 'Error updating contact details',
                error: error.message
            });
        }
    }
}

module.exports = ContactController;
