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

    static async sendAttendanceListEmail(data) {
        const { 
            email, 
            cc,
            bgNumber, 
            studentName,
            startDate,
            endDate,
            measureNumber,
            measureTitle,
            pdfPath
        } = data;

        if (!email) {
            console.log('No email address provided');
            return;
        }

        const month = new Date(startDate).toLocaleDateString('de-DE', { month: '2-digit', year: 'numeric' });

        const mailOptions = {
            from: process.env.SMTP_USER,
            to: email,
            cc: cc || 'info@bad.de',
            subject: `Anwesenheitsliste: ${month}, BG-Nummer: ${bgNumber} - ${studentName}`,
            text: `Sehr geehrte Damen und Herren!

Hier ist die Anwesenheitliste von:
BG-Nummer: ${bgNumber}
Vor- und Nachname: ${studentName}
Datum von: ${startDate} bis: ${endDate}
Maßnahme: ${measureNumber} - ${measureTitle}

Die Anwesenheitsliste ist als PDF-Datei im Anhang abrufbar.

Mit freundlichen Grüßen
BAD Bildungsakademie Deutschland GmbH
Neue Hochstraße 50, 13347 Berlin
Handelsregisternummer: HRB 251635B
Tel.: +49 151 433 69879
info@bildungsakademie-deutschland.com`,
            attachments: [{
                filename: `Anwesenheitsliste_${bgNumber}_${month}.pdf`,
                path: pdfPath
            }]
        };

        try {
            await EmailService.transporter.sendMail(mailOptions);
            console.log(`Attendance list email sent for BG Number: ${bgNumber}`);
        } catch (error) {
            console.error('Error sending attendance list email:', error);
            throw error;
        }
    }

    static async sendExamCompletionEmail({ email, bgNumber, measureTitle, measureNumber, completionDate }) {
        if (!email) {
            console.log('No email address provided');
            return;
        }

        const formattedDate = new Date(completionDate).toLocaleDateString('de-DE', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });

        const mailOptions = {
            from: process.env.SMTP_USER,
            to: email,
            subject: `Maßnahme beendet, BG-Nr: ${bgNumber}`,
            text: `Sehr geehrte Damen und Herren,

Hiermit Informieren wir Sie, dass die Maßnahme:
${measureTitle}
mit der Nummer: ${measureNumber}
ihres Kunden mit der BG-Nummer: ${bgNumber}
am ${formattedDate} beendet ist.

Mit freundlichen Grüßen
BAD Bildungsakademie Deutschland GmbH
Neue Hochstraße 50, 13347 Berlin
Handelsregisternummer: HRB 251635B
Tel.: +49 151 433 69879
info@bildungsakademie-deutschland.com`
        };

        try {
            await EmailService.transporter.sendMail(mailOptions);
            console.log(`Exam completion email sent for BG Number: ${bgNumber}`);
        } catch (error) {
            console.error('Error sending exam completion email:', error);
            throw error;
        }
    }
}

module.exports = EmailService;
