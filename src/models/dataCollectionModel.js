const db = require('../config/database');
const crypto = require('crypto');
const PDFGenerator = require('../utils/pdfGenerator');

class DataCollection {
    static async getAllForms() {
        const connection = await db.getConnection();
        try {
            const [forms] = await connection.execute(
                `SELECT 
                    fl.id,
                    fl.created_at,
                    COUNT(DISTINCT fr.id) as total_responses
                FROM form_links fl
                LEFT JOIN form_responses fr ON fl.id = fr.form_link_id
                GROUP BY fl.id
                ORDER BY fl.created_at DESC`
            );
            return forms;
        } finally {
            connection.release();
        }
    }

    static async generateLink() {
        const connection = await db.getConnection();
        try {
            await connection.beginTransaction();

            // Generate a random token
            const token = crypto.randomBytes(32).toString('hex');
            
            // Calculate expiry date (7 days from now)
            const expiryDate = new Date();
            expiryDate.setDate(expiryDate.getDate() + 7);

            const [result] = await connection.execute(
                `INSERT INTO form_links (token, expiry_date)
                 VALUES (?, ?)`,
                [token, expiryDate]
            );

            await connection.commit();
            return {
                id: result.insertId,
                token,
                expiryDate
            };
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }

    static async validateToken(token) {
        const connection = await db.getConnection();
        try {
            const [rows] = await connection.execute(
                `SELECT id, expiry_date
                 FROM form_links
                 WHERE token = ? AND expiry_date > NOW()`,
                [token]
            );

            return rows[0] || null;
        } finally {
            connection.release();
        }
    }

    static async getFormStructure() {
        return {
            sections: [
                {
                    name: 'Personal Information',
                    fields: [
                        { type: 'text', name: 'post_project_interest', label: 'When would or is the post/project interested in', required: true },
                        { type: 'text', name: 'name', label: 'Name', required: true },
                        { type: 'text', name: 'surname', label: 'Surname', required: true },
                        { type: 'number', name: 'measures_id', label: 'Measures ID', required: false },
                        { type: 'date', name: 'date_of_birth', label: 'Date of Birth', required: true },
                        { type: 'text', name: 'place_of_birth', label: 'Place of Birth', required: true },
                        { type: 'text', name: 'nationality', label: 'Nationality', required: true },
                        { type: 'text', name: 'address', label: 'Address', required: true },
                        { type: 'text', name: 'telephone', label: 'Telephone', required: true },
                        { type: 'text', name: 'email', label: 'Email', required: true }
                    ]
                },
                {
                    name: 'Current Occupation',
                    fields: [
                        { type: 'select', name: 'current_activity', label: 'Current activity', options: ['Employed', 'Unemployed', 'Student', 'Other'], required: true },
                        { type: 'text', name: 'current_employer', label: 'Current employer', required: true },
                        { type: 'text', name: 'current_position', label: 'Current position', required: true },
                        { type: 'text', name: 'years_of_experience', label: 'Years of experience', required: true }
                    ]
                },
                {
                    name: 'Personal availability',
                    fields: [
                        { type: 'select', name: 'early_shift', label: 'Daily working shifts (early)', options: ['6:00-14:00', '7:00-15:00', '8:00-16:00'], required: true },
                        { type: 'select', name: 'late_shift', label: 'Daily working shifts (late)', options: ['14:00-22:00', '15:00-23:00', '16:00-24:00'], required: true },
                        { type: 'select', name: 'night_shift', label: 'Night shift', options: ['22:00-6:00', '23:00-7:00', '24:00-8:00'], required: true },
                        { type: 'select', name: 'weekends', label: 'Weekends', options: ['Yes', 'No'], required: true }
                    ]
                },
                {
                    name: 'Personal Suitability',
                    fields: [
                        { type: 'boolean', name: 'shift_system', label: 'Can work in shift system?', required: true },
                        { type: 'boolean', name: 'working_hours', label: 'Flexible working hours?', required: true },
                        { type: 'boolean', name: 'health_restrictions', label: 'Any health restrictions?', required: true },
                        { type: 'boolean', name: 'furniture_transport', label: 'Can transport furniture?', required: true },
                        { type: 'text', name: 'miscellaneous', label: 'Miscellaneous', required: false }

                    ]
                },
                {
                    name: 'Professional Suitability',
                    fields: [
                        { type: 'boolean', name: 'has_internet_device', label: 'Has internet device?', required: true },
                        { type: 'boolean', name: 'b1_level_available', label: 'B1 level available?', required: true },
                        { type: 'boolean', name: 'job_board_access', label: 'Has job board access?', required: true },
                        { type: 'boolean', name: 'good_conduct_was_available', label: 'Good conduct was available?', required: true }
                    ]
                },
                {
                    name: 'Personal Information',
                    fields: [
                        { type: 'boolean', name: 'security_sector_experience', label: 'Has security sector experience?', required: true },
                        { type: 'boolean', name: 'last_employment', label: 'Last employment?', required: true },
                        { type: 'boolean', name: 'current_employment', label: 'Currently employed?', required: true }
                    ]
                },
                {
                    name: 'Assessment',
                    fields: [
                        { type: 'boolean', name: 'measure_target_achievable', label: 'Measure target achievable?', required: false },
                        { type: 'text', name: 'clerk_name', label: 'Clerk Name', required: false },
                        { type: 'date', name: 'clerk_date', label: 'Clerk Date', required: false },
                      
                    ]
                },
                {
                    name: 'Notes',
                    fields: [
                        { type: 'textarea', name: 'additional_notes', label: 'Additional Notes', required: false },
                        { type: 'date', name: 'submission_date', label: 'Submission Date', required: false },
                        { type: 'string', name: 'good_conduct_was_available', label: 'Good conduct was available?', required: false },
                        { type: 'boolean', name: 'will_be_submitted', label: 'Will be submitted?', required: true },
                        { type: 'date', name: 'date_of_entry', label: 'Date of entry', required: false },
                        { type: 'boolean', name: 'reminder_set', label: 'Reminder set?', required: true }
                    ]
                }
            ]
        };
    }

    static async submitResponses(formId, data) {
        const connection = await db.getConnection();
        try {
            await connection.beginTransaction();

            // Validate required sections
            const requiredSections = [
                'basic_info',
                'languages',
                'special_knowledge',
                'professional_suitability',
                'personal_suitability',
                'personal_information'
            ];

            for (const section of requiredSections) {
                if (!data[section]) {
                    throw new Error(`Missing required section: ${section}`);
                }
            }

            // Ensure all required objects exist with default empty objects
            const safeData = {
                basic_info: data.basic_info || {},
                languages: data.languages || {},
                special_knowledge: data.special_knowledge || {},
                professional_suitability: data.professional_suitability || {},
                personal_suitability: data.personal_suitability || {},
                personal_information: data.personal_information || {},
                assessment: data.assessment || {},
                notes: data.notes || {},
                personal_suitability_applicant_signature: data.personal_suitability_applicant_signature || '',
                professional_information_applicant_signature1: data.professional_information_applicant_signature1 || '',
                professional_information_applicant_signature2: data.professional_information_applicant_signature2 || ''
            };
            console.log("safeData",safeData);
            // Generate PDF
            const pdfResult = await PDFGenerator.generateDataCollectionPDF(safeData);
            const pdfUrl = `/uploads/${pdfResult.filename}`;

            // Expire the token by setting expiry_date to now
            await connection.execute(
                'UPDATE form_links SET expiry_date = NOW() WHERE id = ?',
                [formId]
            );

            const [result] = await connection.execute(
                `INSERT INTO form_responses (
                    form_link_id,
                    basic_info,
                    languages,
                    special_knowledge,
                    professional_suitability,
                    personal_suitability,
                    personal_information,
                    personal_suitability_applicant_signature,
                    professional_information_applicant_signature1,
                    professional_information_applicant_signature2,
                    assessment,
                    notes,
                    pdf_url
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    formId || null,
                    JSON.stringify(safeData.basic_info),
                    JSON.stringify(safeData.languages),
                    JSON.stringify(safeData.special_knowledge),
                    JSON.stringify(safeData.professional_suitability),
                    JSON.stringify(safeData.personal_suitability),
                    JSON.stringify(safeData.personal_information),
                    safeData.personal_suitability_applicant_signature,
                    safeData.professional_information_applicant_signature1,
                    safeData.professional_information_applicant_signature2,
                    JSON.stringify(safeData.assessment),
                    JSON.stringify(safeData.notes),
                    pdfUrl
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



    static async updateResponse(id, data) {
        const connection = await db.getConnection();
        try {
            await connection.beginTransaction();

            // Convert data to match database schema
            const updateData = {
                basic_info: JSON.stringify(data.basic_info),
                languages: JSON.stringify(data.languages),
                special_knowledge: JSON.stringify(data.special_knowledge),
                professional_suitability: JSON.stringify(data.professional_suitability),
                personal_suitability: JSON.stringify(data.personal_suitability),
                personal_information: JSON.stringify(data.personal_information),
                personal_suitability_applicant_signature: data.personal_suitability_applicant_signature,
                professional_information_applicant_signature1: data.professional_information_applicant_signature1,
                professional_information_applicant_signature2: data.professional_information_applicant_signature2,
                assessment: JSON.stringify(data.assessment),
                notes: JSON.stringify(data.notes)
            };

            // Build update query
            const updateFields = [];
            const updateValues = [];

            Object.entries(updateData).forEach(([key, value]) => {
                if (value !== undefined) {
                    updateFields.push(`${key} = ?`);
                    updateValues.push(value);
                }
            });

            // Add id to values array
            updateValues.push(id);

            const [result] = await connection.execute(
                `UPDATE form_responses SET ${updateFields.join(', ')} WHERE id = ?`,
                updateValues
            );

            await connection.commit();

            if (result.affectedRows === 0) {
                throw new Error('Form response not found');
            }

            // Return updated data
            const [updatedResponse] = await connection.execute(
                `SELECT fr.*, fl.token, fl.expiry_date
                 FROM form_responses fr
                 JOIN form_links fl ON fr.form_link_id = fl.id
                 WHERE fr.id = ?`,
                [id]
            );

            return this.formatResponse(updatedResponse[0]);
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }

    static async getResponse(responseId) {
        const connection = await db.getConnection();
        try {
            const [responses] = await connection.execute(
                `SELECT 
                    fr.*,
                    fl.token,
                    fl.expiry_date,
                    fr.pdf_url
                FROM form_responses fr
                JOIN form_links fl ON fr.form_link_id = fl.id
                WHERE fr.id = ?`,
                [responseId]
            );
            return responses[0] || null;
        } finally {
            connection.release();
        }
    }

    static async addComment(responseId, notes) {
        const connection = await db.getConnection();
        try {
            await connection.execute(
                `UPDATE form_responses 
                 SET notes = ?
                 WHERE id = ?`,
                [JSON.stringify(notes), responseId]
            );
            return true;
        } finally {
            connection.release();
        }
    }

    static async deleteResponse(responseId) {
        const connection = await db.getConnection();
        try {
            await connection.execute(
                'DELETE FROM form_responses WHERE id = ?',
                [responseId]
            );
            return true;
        } finally {
            connection.release();
        }
    }

    static formatResponse(response) {
        if (!response) return null;
        const fullPdfUrl = `${process.env.BACKEND_URL}${response.pdf_url}`;
        return {
            id: response.id,
            form_link_id: response.form_link_id,
            basic_info: JSON.parse(response.basic_info),
            languages: JSON.parse(response.languages),
            special_knowledge: JSON.parse(response.special_knowledge),
            professional_suitability: JSON.parse(response.professional_suitability),
            personal_suitability: JSON.parse(response.personal_suitability),
            personal_information: JSON.parse(response.personal_information),
            personal_suitability_applicant_signature: response.personal_suitability_applicant_signature,
            professional_information_applicant_signature1: response.professional_information_applicant_signature1,
            professional_information_applicant_signature2: response.professional_information_applicant_signature2,
            assessment: JSON.parse(response.assessment),
            notes: JSON.parse(response.notes),
            created_at: response.created_at,
            token: response.token,
            form_url: `${process.env.FRONTEND_URL}/data-collection-form?token=${response.token}`,
            expiry_date: response.expiry_date,
            pdf_url: fullPdfUrl
        };
    }

    static async getFormResponses(formId) {
        const connection = await db.getConnection();
        try {
            const [responses] = await connection.execute(
                `SELECT 
                    fr.*,
                    ff.label as field_label,
                    ff.field_type,
                    fs.name as section_name
                FROM form_responses fr
                JOIN form_fields ff ON fr.field_id = ff.id
                JOIN form_sections fs ON ff.section_id = fs.id
                WHERE fr.form_id = ?
                ORDER BY fs.order_number, ff.order_number`,
                [formId]
            );

            return responses;
        } finally {
            connection.release();
        }
    }
    static async deleteResponse(id) {
        const connection = await db.getConnection();
        try {
            await connection.execute(
                'DELETE FROM form_responses WHERE id = ?',
                [id]
            );
        } finally {
            connection.release();
        }
    }

    static async deleteForm(id) {
        const connection = await db.getConnection();
        try {
            await connection.beginTransaction();

            // First delete all responses associated with this form
            await connection.execute(
                'DELETE FROM form_responses WHERE form_link_id = ?',
                [id]
            );

            // Then delete the form itself
            const [result] = await connection.execute(
                'DELETE FROM form_links WHERE id = ?',
                [id]
            );

            await connection.commit();
            return result.affectedRows > 0;
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }

    static async getAllResponses() {
        const connection = await db.getConnection();
        try {
            const [rows] = await connection.execute(
                `SELECT 
                    fl.id as link_id,
                    fl.token,
                    fl.expiry_date,
                    fl.created_at as link_created_at,
                    fl.updated_at as link_updated_at,
                    fr.id as response_id,
                    fr.basic_info,
                    fr.languages,
                    fr.special_knowledge,
                    fr.professional_suitability,
                    fr.personal_suitability,
                    fr.personal_information,
                    fr.personal_suitability_applicant_signature,
                    fr.professional_information_applicant_signature1,
                    fr.professional_information_applicant_signature2,
                    fr.assessment,
                    fr.notes,
                    fr.pdf_url,
                    fr.created_at as response_created_at,
                    fr.updated_at as response_updated_at
                FROM form_links fl
                LEFT JOIN form_responses fr ON fr.form_link_id = fl.id
                ORDER BY fl.created_at DESC`
            );

            return rows.map(row => ({
                id: row.link_id,
                token: row.token,
                expiryDate: row.expiry_date,
                createdAt: row.link_created_at,
                updatedAt: row.link_updated_at,
                form_url: `${process.env.FRONTEND_URL}/data-collection-form?token=${row.token}`,
                response: row.response_id ? {
                    id: row.response_id,
                    basicInfo: JSON.parse(row.basic_info || 'null'),
                    languages: JSON.parse(row.languages || 'null'),
                    specialKnowledge: JSON.parse(row.special_knowledge || 'null'),
                    professionalSuitability: JSON.parse(row.professional_suitability || 'null'),
                    personalSuitability: JSON.parse(row.personal_suitability || 'null'),
                    personalInformation: JSON.parse(row.personal_information || 'null'),
                    personal_suitability_applicant_signature: row.personal_suitability_applicant_signature,
                    professional_information_applicant_signature1: row.professional_information_applicant_signature1,
                    professional_information_applicant_signature2: row.professional_information_applicant_signature2,
                    assessment: JSON.parse(row.assessment || 'null'),
                    notes: JSON.parse(row.notes || 'null'),
                    pdf_url: row.pdf_url ? `${process.env.BACKEND_URL}${row.pdf_url}` : null,
                    createdAt: row.response_created_at,
                    updatedAt: row.response_updated_at
                } : null
            }));
        } finally {
            connection.release();
        }
    }
}

module.exports = DataCollection;
