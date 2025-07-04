const fs = require('fs').promises;
const path = require('path');
const pdf = require('pdf-creator-node');

class EndAssessmentPdfGenerator {
    static async generatePdf(assessment, studentInfo) {
        try {
            console.log('Generating PDF with:', { assessment, studentInfo });
            // Check and read HTML template
            const templatePath = path.join(__dirname, '../templates/end-assessment.html');
            console.log('Template path:', templatePath);
            
            try {
                await fs.access(templatePath, fs.constants.R_OK);
            } catch (err) {
                console.error('Template file not found or not readable:', err);
                throw new Error('PDF template not found');
            }
            
            const templateHtml = await fs.readFile(templatePath, 'utf8');
            console.log('Template loaded successfully');
            
            // Format date
            const date = new Date().toLocaleDateString('de-DE');
            
            // Prepare data for template
            const data = {
                date,
                student_name: `${studentInfo.first_name} ${studentInfo.last_name}`,
                course_duration: `${studentInfo.measures_number} - ${studentInfo.measures_title}`,
                greatest_success: assessment.greatest_success_experience,
                personal_development: assessment.personal_development,
                biggest_challenge: assessment.biggest_challenge,
                oral_participation: assessment.oral_participation,
                written_performance: assessment.written_performance,
                learning_difficulties: assessment.handling_learning_difficulties,
                weaker_areas: assessment.development_weaker_areas,
                support_services: assessment.utilization_support_services,
                overall_assessment: assessment.overall_assessment,
                instructor_signature: assessment.instructor_signature,
                participant_name: assessment.participant_name
            };
            
            console.log('Template data:', data);
            
            // Set up PDF options
            // const options = {
            //     format: 'A4',
            //     orientation: 'portrait',
            //     border: '20mm',
            //     footer: {
            //         height: '20mm',
            //         contents: {
            //             default: '<div style="text-align: center; font-size: 12px;">{{page}}/{{pages}}</div>'
            //         }
            //     }
            // };
            const options = {
                format: "A4",
                orientation: "portrait",
                border: "10mm",
                padding: "10mm",
                footer: {
                    height: "10mm",
                    contents: "<p class='page' style='  padding-left: 6pt;margin-top: 10pt;font: 8pt Arial, sans-serif;text-align: right;'>Seite {{page}}/{{pages}}</p>"
                },
                childProcessOptions: {
                    env: {
                        OPENSSL_CONF: '/dev/null',
                    },
                },
                renderDelay: 20,
                timeout: 180000,
                printBackground: true,
                height: "11.69in",
                width: "8.27in"
            };
            
            // Create PDF document
            const document = {
                html: templateHtml,
                data,
                path: '',
                type: ''
            };
            
            // Create directory if it doesn't exist
            const pdfDir = path.join(__dirname, '../../uploads/end-assessments');
            await fs.mkdir(pdfDir, { recursive: true });
            
            // Generate unique filename
            const filename = `end_assessment_${assessment.student_id}_${Date.now()}.pdf`;
            const pdfPath = path.join(pdfDir, filename);
            
            console.log('PDF directory:', pdfDir);
            console.log('PDF path:', pdfPath);
            
            try {
                // Check directory permissions
                await fs.access(pdfDir, fs.constants.W_OK);
                
                // Set output path
                document.path = pdfPath;
                
                console.log('Generating PDF at:', pdfPath);
                
                // Generate PDF
                await pdf.create(document, options);
                
                // Verify file was created
                await fs.access(pdfPath, fs.constants.F_OK);
                
                console.log('PDF generated successfully');
                
                return {
                    filename,
                    path: `/uploads/end-assessments/${filename}`
                };
            } catch (err) {
                console.error('Error during PDF generation:', err);
                throw new Error(`PDF generation failed: ${err.message}`);
            }
        } catch (error) {
            console.error('Error generating PDF:', error);
            throw error;
        }
    }
}

module.exports = EndAssessmentPdfGenerator;
