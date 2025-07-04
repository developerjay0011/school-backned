const fs = require('fs');
const path = require('path');
const pdf = require('pdf-creator-node');

class InterimAssessmentPdfGenerator {
    static async generatePdf(assessment, student) {
        try {
            const templatePath = path.join(__dirname, '../templates/interim-assessment.html');
            const outputDir = path.join(__dirname, '../../uploads/interim-assessments');
            
            // Ensure template exists
            if (!fs.existsSync(templatePath)) {
                throw new Error('Template file not found');
            }

            // Create output directory if it doesn't exist
            if (!fs.existsSync(outputDir)) {
                fs.mkdirSync(outputDir, { recursive: true });
            }

            // Read HTML template
            const html = fs.readFileSync(templatePath, 'utf8');

            // Format date
            const formattedDate = new Date(assessment.assessment_date).toLocaleDateString('de-DE');
            // Prepare document data
            const document = {
                html: html,
                data: {
                    ...assessment,
                    ...student,
                    date: formattedDate,
                    is_measure_at_risk: assessment.is_measure_at_risk ? 'Ja' : 'Nein'
                },
                path: path.join(outputDir, `${student.student_id}_${Date.now()}.pdf`),
                type: 'pdf'
            };

            // PDF options
            const options = {
                format: 'A4',
                orientation: 'portrait',
                border: '10mm',
                footer: {
                    height: '10mm',
                    contents: {
                        default: '<div style="text-align: center; font-size: 10px;">Seite {{page}}/{{pages}}</div>'
                    }
                },
                childProcessOptions: {
                    env: {
                        OPENSSL_CONF: '/dev/null',
                    },
                },
                timeout: 30000,
                renderDelay: 1000,
                printBackground: true
            };

            // Generate PDF
            await pdf.create(document, options);
            console.log('PDF generated successfully at:', document.path);

            // Return relative path from uploads directory
            const relativePath = path.relative(
                path.join(__dirname, '../../uploads'),
                document.path
            );

            return {
                filename: path.basename(document.path),
                path: '/uploads/' + relativePath.replace(/\\/g, '/')
            };
        } catch (error) {
            console.error('Error generating PDF:', error);
            throw error;
        }
    }
}

module.exports = InterimAssessmentPdfGenerator;
