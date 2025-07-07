const nodemailer = require('nodemailer');

class EmailService {
    static transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: true,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
        }
    });

    static async sendFirstDayAttendanceEmail(studentData) {
        const { bgNumber, startDate, email } = studentData;
        console.log(studentData)
        if (email) {
            console.log('No email address provided');



            const formattedDate = new Date(startDate).toLocaleDateString('de-DE', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            });

            const mailOptions = {
                from: process.env.SMTP_USER,
                to: email,
                subject: `Antrittsmeldung BG-Nummer: ${bgNumber}`,
                text: `Sehr geehrte Damen und Herren,

Wir bestätigen Ihnen den planmäßigen Antritt Ihres Kunden am ${formattedDate} mit der BG Nummer:
${bgNumber}

Bei Fragen stehen wir Ihnen selbstverständlich zu Verfügung und wünschen Ihnen einen angenehmen Tag.

Mit freundlichen Grüßen
BAD Bildungsakademie Deutschland GmbH
Neue Hochstraße 50, 13347 Berlin
Handelsregisternummer: HRB 251635B
Tel.: +49 151 433 69879
info@bildungsakademie-deutschland.com`
            };

            try {
                await EmailService.transporter.sendMail(mailOptions);
                console.log(`First day attendance email sent for BG Number: ${bgNumber}`);
            } catch (error) {
                console.error('Error sending first day attendance email:', error);
                throw error;
            }
        }
    }
}

module.exports = EmailService;
