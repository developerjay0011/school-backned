const fs = require('fs');
const path = require('path');
const pdf = require("pdf-creator-node");
const { PDFDocument, PDFName } = require('pdf-lib');
const SuccessPlacementStatisticsModel = require('../models/successPlacementStatisticsModel');
const questions = [
    {
        title: "1. Bildungsstätte / Austattung",
        questions: [
            { "question": "Die vorhandenen Räumlichkeiten (Unterrichts- und Arbeitsräume, Werkstätten, Pausenräume, sanitäre Anlagen) sind in ordnungsgemäßem Zustand.", "value": "" },
            { "question": "Eine ausreichende technische Ausstattung (PC, Maschinen, Werkzeuge) ist vorhanden.) sind in ordnungsgemäßem Zustand.", "value": "" },
            { "question": "Lehr- und Lernmittel (z.B. Arbeitskleidung, Bücher, Skripte, Arbeitsblätter) stehen zur Verfügung.", "value": "" },
        ]
    },
    {
        title: "2. Personal (Ausbilder/innen, Lehrkräfte",
        questions: [
            { "question": "Die Ausbilder/innen und Lehrkräfte vermitteln die Lehrgangsinhalte verständlich", "value": "" },
            { "question": "Die Ausbilder/innen und Lehrkräfte gehen im Unterricht auf die Teilnehmer/innen ein und unterstützen sie", "value": "" },
            { "question": "Die Ausbilder/innen und Lehrkräfte geben Rückmeldungen zum jeweiligen Leistungsstand.", "value": "" },
            { "question": "Mitarbeiter/innen der Bildungseinrichtung unterstützen die Teilnehmer/innen bei persönlichen Schwierigkeiten.", "value": "" },
            { "question": "Mitarbeiter/innen der Bildungseinrichtung unterstützen die Teilnehmer/innen bei der Suche nach einem geeigneten Arbeitsplatz.", "value": "" },
        ]
    },
    {
        title: "3. Organisation und Inhalte der Maßnahme",
        questions: [
            { "question": "Vor Lehrgangsbeginn erfolgte eine ausreichende Information über Inhalte und (zeitlichen) Ablauf.", "value": "" },
            { "question": "Die Bildungseinrichtung hat mit mir einen Schulungsvertrag abgeschlossen, der wesentliche Angaben zur Qualifizierung enthält (z.B. Qualifizierungsinhalte, Praktikazeiten, Angaben zu Lernmitteln und Arbeitskleidung, Rücktritts- und Kündigungsmodalitäten).", "value": "" },
            { "question": "Die Teilnehmer des Lehrgangs passen hinsichtlich ihrer Berufsausbildung bzw. ihren Vorkenntnissen gut zusammen.", "value": "" },
            { "question": "Die Lehrgangsinhalte / der vermittelte Lehrstoff entsprechen meinen Vorkennt-nissen und Erwartungen.", "value": "" },
            { "question": "Die Lehrstoff wird verständlich vermittelt.", "value": "" },
            { "question": "Der Unterricht ist so ausgestaltet, dass mir gentigend Zeit bleibt, das Erlernte zu verarbeiten und zu verfestigen.", "value": "" },
            { "question": "Der Lehrgang ist gut organisiert (z.B. hinsichtlich rechtzeitiger und umfassender ereitstellung von Stundenplänen, Pausenregelungen, Ubungs-möglichkeiten).", "value": "" },
            { "question": "Im Lehrgang werden unterschiedliche Medien eingesetzt (z.B. Flip-Chart, Unterrichtsfolien, Beamer, Filme, interaktive Medien).", "value": "" },
            { "question": "Es gibt regelmäßig Lernerfolgskontrollen (z.B. Klassenarbeiten, Tests, praktische Aufgaben).", "value": "" },
            { "question": "Bei Ausfall von Lehrkräften / Ausbilder/innen ist eine Vertretung sichergestellt.", "value": "", "options": [{ "label": "form.yes", "value": "Yes" }, { "label": "vocationalTraining.partial", "value": "Partial" }, { "label": "form.no", "value": "No" }] },
        ]
    },
    {
        title: "4. Organisation und Inhalte der Maßnahme",
        questions: [
            { "question": "Welche der genannten Aussagen trifit bei der Beurteilung der Qualifizierungs-maßnahmen Ihrer Meinung nach am ehesten zu?", "value": "", "size": { "xs": 12, "md": 12, "lg": 6 }, "options": [{ "label": "vocationalTraining.helpful", "value": "The training helps me to find a job more easily" }, { "label": "vocationalTraining.unchanged", "value": "My chances of getting a job have not changed" }, { "label": "vocationalTraining.worse", "value": "I just lost time, and my chances of getting a job have worsened" }, { "label": "vocationalTraining.unknown", "value": "I cannot yet say whether something has changed" }] },
            { "question": "Die Dauer der Qualifizierungsmaßnahme ist nach meiner jetzigen Einschätzung für mich insgesamt ..", "value": "", "size": { "xs": 6, "md": 3, "lg": 2.4 }, "options": [{ "label": "vocationalTraining.justRight", "value": "Just right" }, { "label": "vocationalTraining.tooShort", "value": "Too short" }, { "label": "vocationalTraining.tooLong", "value": "Too long" }, { "label": "vocationalTraining.canSayYet", "value": "I can't say yet" }] },
            { "question": "Insgesamt bin ich mit der Qualfizierungsmaßnahme zufrieden oder nicht zufrieden?", "value": "" }
        ]
    }
]
class PDFGenerator {
    // static async generateFeedbackSheetPDF(data, feedbacks, measureInfo) {
    //     try {
    //         const template = fs.readFileSync(
    //             path.join(__dirname, '../templates/feedback-sheet-template.html'),
    //             'utf8'
    //         );

    //         const filename = `feedback-sheet-${Date.now()}.pdf`;
    //         const outputPath = path.join(__dirname, '../../uploads/feedback-sheets', filename);

    //         // Ensure directory exists
    //         const dir = path.dirname(outputPath);
    //         if (!fs.existsSync(dir)) {
    //             fs.mkdirSync(dir, { recursive: true });
    //         }

    //         // Format feedbacks for template
    //         const formattedFeedbacks = feedbacks.map(feedback => {
    //             const responses = JSON.parse(feedback.responses);
    //             return {
    //                 date: new Date(feedback.feedback_date).toLocaleDateString('de-DE'),
    //                 student: `${feedback.first_name} ${feedback.last_name}`,
    //                 studentId: feedback.student_id,
    //                 rating: responses.rating || 0,
    //                 attendance: responses.attendance || 0,
    //                 participation: responses.participation || 0,
    //                 comments: feedback.remarks || '-'
    //             };
    //         });

    //         // Calculate averages
    //         const avgAttendance = formattedFeedbacks.length > 0
    //             ? Math.round(formattedFeedbacks.reduce((sum, f) => sum + (f.attendance || 0), 0) / formattedFeedbacks.length)
    //             : 0;

    //         const avgParticipation = formattedFeedbacks.length > 0
    //             ? Math.round(formattedFeedbacks.reduce((sum, f) => sum + (f.participation || 0), 0) / formattedFeedbacks.length)
    //             : 0;

    //         const document = {
    //             html: template,
    //             data: {
    //                 dateFrom: new Date(data.dateFrom).toLocaleDateString('de-DE'),
    //                 dateUntil: new Date(data.dateUntil).toLocaleDateString('de-DE'),
    //                 measureNumber: measureInfo.measures_number,
    //                 measureTitle: measureInfo.measures_title,
    //                 feedbacks: formattedFeedbacks,
    //                 totalFeedbacks: formattedFeedbacks.length,
    //                 averageRating: formattedFeedbacks.length > 0 
    //                     ? (formattedFeedbacks.reduce((sum, f) => sum + f.rating, 0) / formattedFeedbacks.length).toFixed(2)
    //                     : 'N/A',
    //                 averageAttendance: `${avgAttendance}%`,
    //                 averageParticipation: `${avgParticipation}%`
    //             },
    //             path: outputPath,
    //             type: 'pdf'
    //         };

    //         await pdf.create(document, {
    //             format: 'A4',
    //             orientation: 'portrait',
    //             border: '10mm'
    //         });

    //         return {
    //             url: `/uploads/feedback-sheets/${filename}`,
    //             filename
    //         };
    //     } catch (error) {
    //         console.error('Error generating feedback sheet PDF:', error);
    //         throw error;
    //     }
    // }

    static async generateTrainingReport(data) {
        const formatdate = (date) => {
            const d = new Date(date);
            return d.getDate() + '.' + (d.getMonth() + 1) + '.' + d.getFullYear();
        }
        const getDayName = (date) => {
            const d = new Date(date);
            const days = ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'];
            return days[d.getDay()];
        }
        let questionHtml = '';
        // console.log(Adata.responses)
        if (Array.isArray(data)) {



            data.forEach((q, questionIndex) => {

                questionHtml += `
                              <tr>
                    <td style="width: 93pt">
                        <p class="s1">${formatdate(q.created_at)} ${getDayName(q.created_at)}</p>
                    </td>
                    <td style="width: 37pt; border-left: none; border-right: none;">
                        <p class="s1">Nr: </p>
                        <p class="s1" style="margin-top: 5pt;">${q.nr}</p>
                    </td>
                    <td style="width: 262pt; border-left: none; border-right: none;">
                        <p class="s1">Thema:</p>
                        <p class="s2" style="margin-top: 5pt;">${q.title}<span class="s1">&gt;</span></p>
                        <p class="s1">${q.description}</p>
                    </td>
                    <td style="width: 29pt; border-left: none; border-right: none;">
                        <p class="s1">UE: </p>
                        <p class="s1" style="margin-top: 5pt;">${q.ue}</p>
                    </td>
                    <td style="width: 46pt; border-left: none;">
                        <p class="s1" style="text-align: center">Kürzel:</p>
                        <p style="padding-top: 2pt;text-indent: 0pt;text-align: left;"><br /></p>
                        <p style="padding-left: 11pt;text-indent: 0pt;text-align: left;"><span>
                                <img width="38" height="19"
                                                src=${q.signature} />
                                       
                  
                </tr>
                       `;


            });
        }
        // Load your HTML file (or pass HTML content directly)
        const htmlContent = `<!DOCTYPE html>
        <html lang="de">
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Schulungsreport</title>
            <meta name="keywords" content="Schulungsreport">
            <meta name="description" content="Schulungsreport">
            <style>
                * {
                    margin: 0;
                    padding: 0;
                    text-indent: 0;
                    box-sizing: border-box;
                }
        
                body {
                    font-family: Arial, sans-serif;
                    color: black;
                    line-height: 1.4;
                }
        
                h1, p, .s1, .s2 {
                    font-family: Arial, sans-serif;
                    font-style: normal;
                    text-decoration: none;
                }
        
                h1 {
                    font-size: 8pt;
                    font-weight: bold;
                    padding: 0pt 0 0 0pt;
                }
        
                p, .s1 {
                    font-size: 7pt;
                    font-weight: normal;
                    margin: 0;
                }
        
                .s2 {
                    font-size: 7pt;
                    font-weight: bold;
                }
        
                table {
                    border-collapse: collapse;
                    width: auto;
                }
        
                td {
                    vertical-align: top;
                    padding: 2pt;
                    border: 1pt solid black;
                }
        
                .no-border td {
                    border: none;
                }
            </style>
        </head>
        
        <body>
            <h1>Schulungsreport: 2025</h1>
            <p style="padding: 2pt 0 5pt 0pt;">Dozent: Fr. Große Elbert</p>
            <table>
                <tr>
                    <td style="width: 93pt">
                        <p class="s1">Datum:</p>
                    </td>
                    <td style="width: 374pt" colspan="4">
                        <p class="s1">Themen:</p>
                    </td>
                </tr>
              ${questionHtml}
            </table>
            <table class="no-border">
                <tr>
                    <td><img width="159" height="53" alt="Signature"
                            src=${data[0]?.signature} />
                    </td>
                </tr>
            </table></span></p>
            <p style="margin-top: 1em; padding-left: 5pt;">Unterschrift Dozent</p>
        </body>
        
        </html>`;



        const timestamp = Math.floor(Date.now() / 1000);
        const filename = `schulungsreport_${timestamp}.pdf`;
        const outputPath = path.join(__dirname, '../../uploads/schulungsreport', filename);

        const file = {
            html: htmlContent,
            data: data,
            path: outputPath

        };

        const options = {
            format: "A4",
            orientation: "portrait",
            border: "10mm",
            padding: "10mm",
            footer: {
                height: "10mm",
                contents: "<p class='page'>Seite {{page}}/{{pages}}</p>"
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



        // Ensure uploads directory exists
        const uploadsDir = path.dirname(outputPath);
        if (!fs.existsSync(uploadsDir)) {
            fs.mkdirSync(uploadsDir, { recursive: true });
        }
        try {
            const result = await pdf.create(file, options);
            console.log("PDF generated:", result.filename);
            return {
                filename,
                path: `/uploads/schulungsreport/${filename}`,
                url: process.env.BACKEND_URL + `/uploads/schulungsreport/${filename}`
            };
        } catch (error) {
            console.error("Error generating PDF:", error);
            throw error;
        }





    }
    static async generateMahnungPDF(data) {
        const templatePath = path.join(__dirname, '../../templates/Mahnung.pdf');
        const existingPdfBytes = fs.readFileSync(templatePath);

        const formattedDate = new Date(data.invoice_date).toLocaleDateString('de-DE', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
        const futureDate = new Date();
        futureDate.setDate(futureDate.getDate() + 14);

        const nextdate = futureDate.toLocaleDateString('de-DE', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
        const formartamount = data.invoice_amount?.replace('.', ',');
        const pdfDoc = await PDFDocument.load(existingPdfBytes);

        pdfDoc.getPage(0).drawText(data.authority_name, {
            x: 80,
            y: 640,
            size: 10
        })
        pdfDoc.getPage(0).drawText(data.authority_street, {
            x: 80,
            y: 625,
            size: 10
        })
        pdfDoc.getPage(0).drawText(data.authority_postal_code + " " + data.authority_city, {
            x: 80,
            y: 610,
            size: 10
        })
        pdfDoc.getPage(0).drawText(data.authority_contact_person, {
            x: 80,
            y: 580,
            size: 10
        })
        pdfDoc.getPage(0).drawText(new Date().toLocaleDateString('de-DE', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        }), {
            x: 470,
            y: 600,
            size: 10
        })
        pdfDoc.getPage(0).drawText(`${data.authority_bg_number} , ${data.student_name}`, {
            x: 155,
            y: 544,
            size: 9
        })
        pdfDoc.getPage(0).drawText(data.measures_number || '', {
            x: 175,
            y: 531,
            size: 9
        })
        pdfDoc.getPage(0).drawText(`leider haben Sie die Rechnung mit der Nummer ${data.invoice_number} vom ${formattedDate} noch nicht beglichen. Wir möchten Sie nun dringend bitten, die Zahlung der noch offenen Rechnung in Auftrag zu geben.`, {
            x: 78,
            y: 455,
            size: 11,
            lineHeight: 15,
            maxWidth: 450,
        })
        pdfDoc.getPage(0).drawText(`Bitte überweisen Sie den fälligen Betrag von insgesamt ${formartamount} € bis zum ${nextdate} auf das Konto`, {
            x: 78,
            y: 343,
            size: 11,
            lineHeight: 15,
            maxWidth: 450,
        })
        pdfDoc.getPage(0).drawText(data.invoice_number, {
            x: 140,
            y: 257,
            size: 10
        })
        pdfDoc.getPage(0).drawText(data.reminder_number?.toString() || '1', {
            x: 75,
            y: 502,
            size: 18,
            bold: true
        })
        // Save PDF
        const pdfBytes = await pdfDoc.save();
        const timestamp = Math.floor(Date.now() / 1000);
        const filename = `Mahnung_${timestamp}.pdf`;

        // Ensure uploads directory exists
        const uploadsDir = path.join(__dirname, `../../uploads/mahnung/`);
        if (!fs.existsSync(uploadsDir)) {
            console.log('Creating uploads directory:', uploadsDir);
            fs.mkdirSync(uploadsDir, { recursive: true });
        }

        const outputPath = path.join(uploadsDir, filename);
        console.log('Writing PDF to:', outputPath);

        fs.writeFileSync(outputPath, pdfBytes);
        console.log('PDF written successfully');

        // Return the result with URL
        const result = {
            filename,
            path: outputPath,
            url: `${process.env.BACKEND_URL}/uploads/mahnung/${filename}`
        };
        console.log('Generated PDF result:', result);
        return result;
    }
    static async generateBAD(data) {
        // Generate XML first
        const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
        <BAD>
            <Header>
                <Authority>${data.authority_name || ''}</Authority>
                <Date>${new Date(data.invoice_date).toLocaleDateString('de-DE')}</Date>
                <InvoiceNumber>${data.invoice_number || ''}</InvoiceNumber>
            </Header>
            <Details>
                <Amount>${new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(data.invoice_amount)}</Amount>
                <Student>
                    <FirstName>${data.first_name || ''}</FirstName>
                    <LastName>${data.last_name || ''}</LastName>
                </Student>
                <Measures>
                    <MeasuresNumber>${data.measures_number || ''}</MeasuresNumber>
                    <MeasuresTitle>${data.measures_title || ''}</MeasuresTitle>
                </Measures>
            </Details>
        </BAD>`;

        // Save XML file
        const xmlFileName = `BAD_${data.invoice_number}_${Date.now()}.xml`;
        const xmlPath = path.join(__dirname, '../../uploads/bad/', xmlFileName);

        // Ensure directory exists
        await fs.promises.mkdir(path.dirname(xmlPath), { recursive: true });

        // Write XML file
        await fs.promises.writeFile(xmlPath, xmlContent, 'utf8');

        const templatePath = path.join(__dirname, '../../templates/BriefbogenBAD.pdf');
        const existingPdfBytes = fs.readFileSync(templatePath);

        const pdfDoc = await PDFDocument.load(existingPdfBytes);
        const formattedDate = new Date(data.invoice_date).toLocaleDateString('de-DE', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
        const formatamount = new Intl.NumberFormat('de-DE', {
            style: 'currency',
            currency: 'EUR'
        }).format(data.invoice_amount);
        pdfDoc.getPage(0).drawText(data.authority_name, {
            x: 80,
            y: 640,
            size: 10
        })
        pdfDoc.getPage(0).drawText(data.authority_street, {
            x: 80,
            y: 625,
            size: 10
        })
        pdfDoc.getPage(0).drawText(data.authority_postal_code + " " + data.authority_city, {
            x: 80,
            y: 610,
            size: 10
        })
        pdfDoc.getPage(0).drawText(data.authority_contact_person, {
            x: 80,
            y: 580,
            size: 10
        })
        pdfDoc.getPage(0).drawText(formattedDate, {
            x: 470,
            y: 600,
            size: 10
        })
        pdfDoc.getPage(0).drawText(data.invoice_number, {
            x: 185,
            y: 497,
            size: 10
        })
        pdfDoc.getPage(0).drawText(data.student_name, {
            x: 138,
            y: 476,
            size: 10
        })
        pdfDoc.getPage(0).drawText(data.authority_bg_number, {
            x: 120,
            y: 455,
            size: 10
        })
        pdfDoc.getPage(0).drawText(data.measures_number || '', {
            x: 285,
            y: 431,
            size: 10,
        })
        pdfDoc.getPage(0).drawText(data.measures || '', {
            x: 80,
            y: 385,
            size: 10,
            maxWidth: 145,
            lineHeight: 15
        })
        pdfDoc.getPage(0).drawText(formatamount, {
            x: 425,
            y: 385,
            size: 10,
        })
        pdfDoc.getPage(0).drawText(formatamount, {
            x: 425,
            y: 330,
            size: 10,
        })
        pdfDoc.getPage(0).drawText(data.invoice_number, {
            x: 140,
            y: 205,
            size: 10
        })
        // Save PDF
        const pdfBytes = await pdfDoc.save();
        const timestamp = Math.floor(Date.now() / 1000);
        const filename = `Rechnung_orrektur_${timestamp}.pdf`;

        // Ensure uploads directory exists
        const uploadsDir = path.join(__dirname, `../../uploads/bad/`);
        if (!fs.existsSync(uploadsDir)) {
            console.log('Creating uploads directory:', uploadsDir);
            fs.mkdirSync(uploadsDir, { recursive: true });
        }

        const outputPath = path.join(uploadsDir, filename);
        console.log('Writing PDF to:', outputPath);

        fs.writeFileSync(outputPath, pdfBytes);
        console.log('PDF written successfully');

        // Return the result with URL
        const result = {
            pdf: {
                filename,
                path: outputPath,
                url: `/uploads/bad/${filename}`
            },
            xml: {
                filename: xmlFileName,
                path: xmlPath,
                url: `/uploads/bad/${xmlFileName}`
            }
        };
        console.log('Generated PDF result:', result);
        return result;
    }
    static async generateAttendancePDF(mainData) {
        const { data, start_date, end_date } = mainData;
        const formatDate = (dateStr) => {
            if (!dateStr) return '';
            const date = new Date(dateStr);
            const day = String(date.getDate()).padStart(2, '0');
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const year = date.getFullYear();
            return `${day}.${month}.${year}`;
        };

        console.log("Attendance List", data[0])
        const stempelBase64 = fs.readFileSync('./BAD_Stempel_70x27_05_24_DRUCK.jpg', { encoding: 'base64' });
        const getDayName = (date) => {
            const days = ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'];
            const dayIndex = new Date(date).getDay();
            return days[dayIndex];
        };
        const getLeaveStatus = async (leave) => {
            // E: entschuldigt (excused), UE: unentschuldigt (unexcused), K: Krankheit (sick), S: Sonstiges (other)
            switch (leave) {
                case "E":
                    return "entschuldigt";
                case "UE":
                    return "unentschuldigt";
                case "K":
                    return "Krankheit";
                case "S":
                    return "Sonstiges";
                default:
                    return "";
            }

        }
        // console.log(Adata.responses)
        // Generate table rows HTML
        let questionHtml = "";
        if (Array.isArray(data)) {
            try {
                // Convert forEach to map to get array of promises
                const promises = data.map(async (q, questionIndex) => {
                    const morningStatus = q.is_weekend ? getDayName(q.date) :
                        q.is_holiday ? "Feiertag" :
                            q.sick_leave ? await getLeaveStatus(q.sick_leave.status) :
                                q.morning_attendance ? `Teilnahme am Onlinekurs <img class="signature" src="data:image/jpeg;base64,${stempelBase64}"/>` : "";

                    const afternoonStatus = q.is_weekend ? "" :
                        q.is_holiday ? "" :
                            q.sick_leave ? "" :
                                q.afternoon_attendance ? `Teilnahme am Onlinekurs <img class="signature" src="data:image/jpeg;base64,${stempelBase64}"/>` : "";

                    return `
              <tr>
                <td>${q.date} ${getDayName(q.date)}</td>
                <td style="border-bottom: 1px solid #ccc;">${morningStatus}</td>
                <td style="border-bottom: 1px solid #ccc;">${afternoonStatus}</td>
              </tr>
            `;
                });

                // Wait for all promises to resolve
                const rows = await Promise.all(promises);
                questionHtml = rows.join("");
            } catch (error) {
                console.error('Error generating table rows:', error);
                throw error;
            }
        }
        // Load your HTML file (or pass HTML content directly)
        const htmlContent = `<!DOCTYPE html>
      <html lang="de">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Anwesenheitsliste</title>
          <style>
              * {
                  box-sizing: border-box;
                  margin: 0;
                  padding: 0;
                  font-family: Arial, sans-serif;
              }
              page {
                    padding-left: 6pt;
                    margin-top: 10pt;
                    font: 8pt Arial, sans-serif;
                    text-align: right;
                }
              body {
                  max-width: 210mm;
                  min-height: 297mm;
                  margin: 20px auto;
                  padding: 30px;
                  background: white;
              }
      
              table {
                  width: 100%;
                  border-collapse: collapse;
                  table-layout: fixed;
              }
              
              th {
                  background: #EDEDED;
      
                  text-align: center;
                  font-size: 7pt;
                  padding: 10px;
              }
      
              td {
                  padding: 10px;
                  text-align: left;
                  vertical-align: top;
                  font-size: 7pt;
                  text-align: center;
              }
      
              h1 {
                  font-size: 12pt;
      
              }
              .header-info p {
                  margin: 8px 0;
                  font-size: 7pt;
              }
      
             .signature {
                  max-width: 130px;
                  height: auto;
                  margin: 10px 0;
              }
              @media screen and (max-width: 768px) {
                  body {
                      padding: 15px;
                      zoom: 0.95;
                  }
      
                  th, td {
                      padding: 10px;
                      font-size: 7pt;
                  }
      
                  .signature-box {
                      padding: 15px;
                      min-height: 70px;
                  }
              }
      
              @media print {
                  @page {
                      size: A4;
                      margin: 2cm;
                  }
                  body {
                      padding: 0;
                      max-width: 100%;
                  }
              }
          </style>
      </head>
      <body>
          <h1>Anwesenheitsliste</h1>
          
          <div class="header-info">
              <p><strong>Vor- und Nachname:</strong> ${data[0]?.first_name} ${data[0]?.last_name}</p>
              <p><strong>Datum von:</strong> ${formatDate(start_date)} bis ${formatDate(end_date)}</p>
              <p><strong>BG-Nummer:</strong> ${data[0]?.bg_number}</p>
              <p><strong>Maßnahme:</strong> ${data[0]?.measures}</p>
          </div>
      
          <table>
              <thead>
                  <tr>
                      <th style="width: 30%">DATUM</th>
                      <th style="width: 30%">UNTERSCHRIFT BEGINN</th>
                      <th style="width: 30%">UNTERSCHRIFT ENDE</th>
                  </tr>
              </thead>
              <tbody>
                 ${questionHtml}
                  <!-- Add more rows as needed -->
              </tbody>
          </table>
      
         
      </body>
      </html>
      `;

        // Create PDF document


        const timestamp = Math.floor(Date.now() / 1000);
        const filename = `attendance_${timestamp}.pdf`;
        const outputPath = path.join(__dirname, '../../uploads/attendance', filename);

        const file = {
            html: htmlContent,
            data: data,
            path: outputPath

        };

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



        // Ensure uploads directory exists
        const uploadsDir = path.dirname(outputPath);
        if (!fs.existsSync(uploadsDir)) {
            fs.mkdirSync(uploadsDir, { recursive: true });
        }
        try {
            const result = await pdf.create(file, options);
            console.log("PDF generated:", result.filename);
            return {
                filename,
                path: `/uploads/attendance/${filename}`,
                url: process.env.BACKEND_URL + `/uploads/attendance/${filename}`
            };
        } catch (error) {
            console.error("Error generating PDF:", error);
            throw error;
        }





    }
    static async generateQualificationMatrixPDF(data) {
        console.log("data", data)
        const formarttime = (time) => {
            const date = new Date(time);
            return date.toLocaleTimeString('de-DE', {
                hour: '2-digit',
                minute: '2-digit'
            });
        };
        // Read logo file as base64
        let questionHtml = '';
        // console.log(Adata.responses)
        if (Array.isArray(data)) {



            data.forEach((q, questionIndex) => {
                questionHtml += `
                      <tr>
                    <td><p class="s2">${questionIndex + 1}</p></td>
                    <td>
                        <img class="small-img" src="${q.photo}"/>
                    </td>
                    <td><p class="s2">${q.first_name} ${q.last_name}</p></td>
                    <td>
                        <p class="s2">${q.course}</p>
                        <p class="s2">${formarttime(q.start_time)} bis ${formarttime(q.end_time)}</p>
                    </td>
                    <td>
                        <p class="s2">${q.certificates.map((c) => c.split('/').pop()).join(', ')}</p>
                    </td>
                </tr>
                       `;
            });
        }
        // Load your HTML file (or pass HTML content directly)
        const htmlContent = `<!DOCTYPE html>
        <html xmlns="http://www.w3.org/1999/xhtml" xml:lang="de" lang="de">
        <head>
            <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
            <title>Qualifizierungsmatrix</title>
            <meta name="keywords" content="Qualifizierungsmatrix"/>
            <meta name="description" content="Qualifizierungsmatrix"/>
            <style type="text/css">
                * { margin:0; padding:0; }
                .header-box {
                    border:0.8pt solid #000;
                    min-height:32.9pt;
                    width:99.7%;
                    margin-bottom: 2pt;
                }
                .matrix-table {
                    margin-top: 2pt;
                    border-collapse: collapse;
                    width: 100%;
                }
                .matrix-table td {
                    border: 1pt solid #000;
                    width: 150pt;
                    vertical-align: top;
                }
                .s1 {
                    font: bold 10pt Arial, sans-serif;
                    text-align: center;
                    padding: 9pt 0;
                    width: 100%;
                }
                .s2 {
                    font: 8pt Arial, sans-serif;
                    padding: 2pt;
                }
                .cell-content {
                 padding: 2pt;
                    line-height: 1.2;
                    word-break: break-word;
                }
                .small-img {
                     max-width: 100%;
                    height: auto;
                    display: block;
                    margin: 0 auto;
                }
                .timestamp {
                    padding-left: 6pt;
                    margin-top: 10pt;
                    font: 8pt Arial, sans-serif;
                }
                .page {
                    padding-left: 6pt;
                    margin-top: 10pt;
                    font: 8pt Arial, sans-serif;
                    text-align: right;
                }
            </style>
        </head>
        <body>
            <div class="header-box">
                <p class="s1">Qualifizierungsmatrix:</p>
            </div>
        
            <table class="matrix-table">
                <tr>
                    <td><p class="s2">Nr:</p></td>
                    <td></td>
                    <td><p class="s2">Dozent:</p></td>
                    <td><p class="s2">Maßnahme:</p></td>
                    <td><p class="s2">Qualifikationsnachweise / Zertifikate</p></td>
                </tr>
                
                <!-- Repeat this block for each entry -->
                ${questionHtml}
                <!-- End repeat block -->
        
                <!-- Additional rows here -->
            </table>
        
            <p class="timestamp">Erstellt: am ${formarttime(new Date())}</p>
        </body>
        </html>
        `;




        const timestamp = Math.floor(Date.now() / 1000);
        const filename = `qualifizierungsmatrix_${timestamp}.pdf`;
        const outputPath = path.join(__dirname, '../../uploads/qualifizierungsmatrix', filename);

        const file = {
            html: htmlContent,
            data: data,
            path: outputPath

        };

        const options = {
            format: "A4",
            orientation: "landscape",
            border: "10mm",
            padding: "10mm",
            footer: {
                height: "10mm",
                contents: "<p class='page'>Seite {{page}}/{{pages}}</p>"
            },
            childProcessOptions: {
                env: {
                    OPENSSL_CONF: '/dev/null',
                },
            },
            renderDelay: 20,
            timeout: 180000,
            printBackground: true,
            height: "8.27in",
            width: "11.69in"
        };



        // Ensure uploads directory exists
        const uploadsDir = path.dirname(outputPath);
        if (!fs.existsSync(uploadsDir)) {
            fs.mkdirSync(uploadsDir, { recursive: true });
        }
        try {
            const result = await pdf.create(file, options);
            console.log("PDF generated:", result.filename);
            return {
                filename,
                path: `/uploads/qualifizierungsmatrix/${filename}`,
                url: process.env.BACKEND_URL + `/uploads/qualifizierungsmatrix/${filename}`
            };
        } catch (error) {
            console.error("Error generating PDF:", error);
            throw error;
        }





    }
    static async generateCertificateOfAbsence(data) {
        const templatePath = path.join(__dirname, '../../templates/dok_ba037459.pdf');
        const existingPdfBytes = fs.readFileSync(templatePath);

        const pdfDoc = await PDFDocument.load(existingPdfBytes);
        const form = pdfDoc.getForm();
        const fields = form.getFields();

        fields.forEach(field => {
            const name = field.getName();
            console.log('Field name:', name);
        });

        const field1 = form.getTextField('SGBIII-BescheinigungFehlzeitenfuerMonat-Jahr[0].Seite1[0].AgenturfuerArbeit[0]');
        const field2 = form.getTextField('SGBIII-BescheinigungFehlzeitenfuerMonat-Jahr[0].Seite1[0].MonatJahr[0]');
        const field3 = form.getTextField('SGBIII-BescheinigungFehlzeitenfuerMonat-Jahr[0].Seite1[0].NameVorname[0]');
        const field4 = form.getTextField('SGBIII-BescheinigungFehlzeitenfuerMonat-Jahr[0].Seite1[0].StrasseHausnummer[0]');
        const field5 = form.getTextField('SGBIII-BescheinigungFehlzeitenfuerMonat-Jahr[0].Seite1[0].PLZOrt[0]');
        const field6 = form.getTextField('SGBIII-BescheinigungFehlzeitenfuerMonat-Jahr[0].Seite1[0].Kunden-Nummer[0]');
        const field7 = form.getTextField('SGBIII-BescheinigungFehlzeitenfuerMonat-Jahr[0].Seite1[0].Maßnahmenummer[0]');
        const field8 = form.getTextField('SGBIII-BescheinigungFehlzeitenfuerMonat-Jahr[0].Seite1[0].Maßnahmebezeichnung[0]');
        const field9 = form.getTextField('SGBIII-BescheinigungFehlzeitenfuerMonat-Jahr[0].Seite1[0].Teilformular-Fehlzeiten[0].Begruendung[0]');
        const DATE = form.getTextField('SGBIII-BescheinigungFehlzeitenfuerMonat-Jahr[0].Seite1[0].Datum-1[0]');
        DATE.setText(new Date().toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' }));
        const DATE2 = form.getTextField('SGBIII-BescheinigungFehlzeitenfuerMonat-Jahr[0].Seite2[0].Datum-2[0]');
        DATE2.setText(new Date().toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' }));
        const page = pdfDoc.getPage(0);
        for (let i = 0; i < data.days.length; i++) {
            if (data?.days[i]?.status) {

                page.drawText(data?.days[i]?.status[0], {
                    x: 69 + (i * 15 + i),
                    y: 297,
                    size: 8
                })
                if (data?.days[i]?.status[1]) {
                    page.drawText(data?.days[i]?.status[1], {
                        x: 69 + (i * 15 + i),
                        y: 288,
                        size: 8
                    })
                }
            }
        }




        field1.setText(`${data.authority.name} \n${data.authority.address} \n${data.authority.city} , ${data.authority.zip}`);
        field2.setText(data.month);
        field3.setText(`${data.student.first_name} ${data.student.last_name}`);
        field4.setText(`${data.student.address.street} ${data.student.address.street_number}`);
        field5.setText(`${data.student.address.city}, ${data.student.address.postal_code}`);
        field6.setText(data.authority.bg_number);
        field7.setText(data.student.measures_number);
        field8.setText(data.student.measures_title);

        const checkbox1 = form.getCheckBox('SGBIII-BescheinigungFehlzeitenfuerMonat-Jahr[0].Seite1[0].Teilformular-Stellungnahme[0].trotzaufgrundbisherigerFehltage[0]');
        checkbox1.check();
        const field10 = form.getTextField('SGBIII-BescheinigungFehlzeitenfuerMonat-Jahr[0].Seite1[0].Teilformular-Fehlzeiten[0].Begruendung[0]');
        field10.setText(data?.currentMonthLeaves);
        const field11 = form.getTextField('SGBIII-BescheinigungFehlzeitenfuerMonat-Jahr[0].Seite1[0].Teilformular-Stellungnahme[0].TagenseitTeilnahmebeginnvoraussichtlnocherreicht[0]');
        field11.setText(data?.totalLeaves.days);

        // Use PNG or JPG based on your image
        const imageBuffer = fs.readFileSync('./BAD_Stempel_70x27_05_24_DRUCK.jpg')
        const image = await pdfDoc.embedJpg(imageBuffer); // or embedJpg(imageBuffer)


        const { width, height } = image.scale(0.18); // Adjust scale if needed


        page.drawImage(image, {
            x: 350,
            y: 55,
            width,
            height,
        });
        const page2 = pdfDoc.getPage(1);

        page2.drawText(data?.student?.first_name + " " + data?.student?.last_name, {
            x: 390,
            y: 420,
            size: 8
        })

        // Save PDF
        const pdfBytes = await pdfDoc.save();
        const timestamp = Math.floor(Date.now() / 1000);
        const filename = `certificate-of-absence_${timestamp}.pdf`;

        // Ensure uploads directory exists
        const uploadsDir = path.join(__dirname, `../../uploads/certificate-of-absence/`);
        if (!fs.existsSync(uploadsDir)) {
            console.log('Creating uploads directory:', uploadsDir);
            fs.mkdirSync(uploadsDir, { recursive: true });
        }

        const outputPath = path.join(uploadsDir, filename);
        console.log('Writing PDF to:', outputPath);

        fs.writeFileSync(outputPath, pdfBytes);
        console.log('PDF written successfully');

        // Return the result with URL
        const result = {
            filename,
            path: outputPath,
            url: `/uploads/certificate-of-absence/${filename}`
        };
        console.log('Generated PDF result:', result);
        return result;
    }
    static async generateReportPDF(data) {
        const templatePath = path.join(__dirname, '../../templates/formular-zur-austritts-oder-nichtantrittsmeldung_ba032155.pdf');
        const existingPdfBytes = fs.readFileSync(templatePath);

        const pdfDoc = await PDFDocument.load(existingPdfBytes);
        const form = pdfDoc.getForm();

        const formatDate = (dateStr) => {
            if (!dateStr) return '';
            const date = new Date(dateStr);
            const day = String(date.getDate()).padStart(2, '0');
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const year = date.getFullYear();
            return `${day}.${month}.${year}`;
        };

        // Common fields for both report types
        const field1 = form.getTextField('TeilnehmerbezogenerBericht[0].Seite1[0].Teilformular-Kundendaten[0].Vorname_Name[0]');
        const field2 = form.getTextField('TeilnehmerbezogenerBericht[0].Seite1[0].Teilformular-Kundendaten[0].Kundennummer[0]');
        const field3 = form.getTextField('TeilnehmerbezogenerBericht[0].Seite1[0].Teilformular-Kundendaten[0].Geburtsdatum[0]');
        const field4 = form.getTextField('TeilnehmerbezogenerBericht[0].Seite1[0].Teilformular-Maßnahmedaten[0].Maßnahmenummer[0]');
        const field5 = form.getTextField('TeilnehmerbezogenerBericht[0].Seite1[0].Teilformular-Maßnahmedaten[0].Maßnahmebezeichnung[0]');
        const field6 = form.getTextField('TeilnehmerbezogenerBericht[0].Seite1[0].Teilformular-Maßnahmedaten[0].GeplanterEintritt[0]');
        const field7 = form.getTextField('TeilnehmerbezogenerBericht[0].Seite1[0].Teilformular-Maßnahmedaten[0].TatsaechlicherEintritt[0]');

        // Fill common fields
        field1.setText(data.first_name || '');
        field2.setText(data.bg_number ? data.bg_number.toString() : '');
        field3.setText(data.birth_date ? formatDate(data.birth_date) : '');
        field4.setText(data.measures || '');
        field5.setText(data.measures_name || '');
        field6.setText(data.first_day_attendance ? formatDate(data.first_day_attendance) : '');
        field7.setText(data.date_of_entry ? formatDate(data.date_of_entry) : '');

        // Get all checkboxes and fields for report type specific data
        const notStartedBox = form.getCheckBox('TeilnehmerbezogenerBericht[0].Seite1[0].Teilformular-Gruende-Nichtantritt-Austritt[0].MaßnahmePruefungTeilnahme[0]');
        const earlyCompletionBox = form.getCheckBox('TeilnehmerbezogenerBericht[0].Seite1[0].Teilformular-Gruende-Nichtantritt-Austritt[0].MaßnahmePruefungTeilnahme[1]');
        const examFailedBox = form.getCheckBox('TeilnehmerbezogenerBericht[0].Seite1[0].Teilformular-Gruende-Nichtantritt-Austritt[0].MaßnahmePruefungTeilnahme[2]');
        const terminationBox = form.getCheckBox('TeilnehmerbezogenerBericht[0].Seite1[0].Teilformular-Gruende-Nichtantritt-Austritt[0].MaßnahmePruefungTeilnahme[3]');
        const lastAttendanceField = form.getTextField(data.type === 'discharge' ? 'TeilnehmerbezogenerBericht[0].Seite1[0].Teilformular-Gruende-Nichtantritt-Austritt[0].letzterpersoenlAnwesenheitstag-1[0]' : 'TeilnehmerbezogenerBericht[0].Seite1[0].Teilformular-Gruende-Nichtantritt-Austritt[0].letzterpersoenlAnwesenheitstag-2[0]');
        const reasonsField = form.getTextField('TeilnehmerbezogenerBericht[0].Seite1[0].Teilformular-Gruende-Nichtantritt-Austritt[0].sonstigeGruendeEingabe[0]');
        const employmentDateField = form.getTextField('TeilnehmerbezogenerBericht[0].Seite1[0].Teilformular-Gruende-Nichtantritt-Austritt[0].ArbeitsaufnahmezumDatum[0]');
        const dateField = form.getTextField('TeilnehmerbezogenerBericht[0].Seite1[0].Datum[0]');

        // Handle report type specific fields
        if (data.type === 'discharge') {
            // For discharge report (early completion)
            earlyCompletionBox.check();
            lastAttendanceField.setText(formatDate(data.last_day_attendance));

            examFailedBox.check();

        } else if (data.type === 'termination') {
            // For termination report
            terminationBox.check();
            lastAttendanceField.setText(formatDate(data.last_day_attendance));

            // Check absence reasons if provided

            const m2 = form.getCheckBox('TeilnehmerbezogenerBericht[0].Seite1[0].Teilformular-Gruende-Nichtantritt-Austritt[0].Maßnahmeabbruchwegen[0]');
            if (data.is_employment) m2.check();
            const m3 = form.getCheckBox('TeilnehmerbezogenerBericht[0].Seite1[0].Teilformular-Gruende-Nichtantritt-Austritt[0].Maßnahmeabbruchwegen[1]');
            if (data.insufficient_performance) m3.check();
            const m4 = form.getCheckBox('TeilnehmerbezogenerBericht[0].Seite1[0].Teilformular-Gruende-Nichtantritt-Austritt[0].Maßnahmeabbruchwegen[2]');
            if (data.longer_periods_absence) m4.check();
            const m5 = form.getCheckBox('TeilnehmerbezogenerBericht[0].Seite1[0].Teilformular-Gruende-Nichtantritt-Austritt[0].Maßnahmeabbruchwegen[3]');
            if (data.other_reasons) m5.check();
            const m6 = form.getTextField('TeilnehmerbezogenerBericht[0].Seite1[0].Datum[0]');
            m6.setText(formatDate(data.created_at));





        }

        // Set additional fields if provided
        if (data.reasons) {
            reasonsField.setText(data.reasons);
        }
        if (data.employment_date) {
            employmentDateField.setText(formatDate(data.employment_date));
        }
        console.log("testste", data.created_at, data.date_of_entry);
        dateField.setText(formatDate(data.created_at));

        // Add stamp
        const imageBuffer = fs.readFileSync('./BAD_Stempel_70x27_05_24_DRUCK.jpg');
        const image = await pdfDoc.embedJpg(imageBuffer);
        const page = pdfDoc.getPage(0);
        const { width, height } = image.scale(0.2);

        page.drawImage(image, {
            x: 350,
            y: 85,
            width,
            height,
        });

        // Save PDF
        const pdfBytes = await pdfDoc.save();
        const timestamp = Math.floor(Date.now() / 1000);
        const reportType = data.type === 'discharge' ? 'discharge' : 'termination';
        const filename = `${reportType}-report_${timestamp}.pdf`;

        // Ensure uploads directory exists
        const uploadsDir = path.join(__dirname, `../../uploads/${reportType}-report/`);
        if (!fs.existsSync(uploadsDir)) {
            console.log('Creating uploads directory:', uploadsDir);
            fs.mkdirSync(uploadsDir, { recursive: true });
        }

        const outputPath = path.join(uploadsDir, filename);
        console.log('Writing PDF to:', outputPath);

        fs.writeFileSync(outputPath, pdfBytes);
        console.log('PDF written successfully');

        // Return the result with URL
        const result = {
            filename,
            path: outputPath,
            url: `/uploads/${reportType}-report/${filename}`
        };
        console.log('Generated PDF result:', result);
        return result;
    }
    static async generateFeedbackSheetPDF(data, feedbacks, measureInfo) {
        console.log("feedbacks", feedbacks)
        console.log("measureInfo", measureInfo)
        console.log("data", data)
        const getMonths = (dateFrom, dateUntil) => {
            const from = new Date(`${dateFrom}-01`);
            const until = new Date(`${dateUntil}-01`);

            const months = [];

            while (from <= until) {
                const monthName = from.toLocaleString('de-DE', { month: 'short' });
                months.push(monthName + " " + from.getFullYear());             // Increment month
                from.setMonth(from.getMonth() + 1);
            }
            console.log("months", months)
            return months;
        }
        const getMonthsEN = (dateFrom, dateUntil) => {
            const from = new Date(`${dateFrom}-01`);
            const until = new Date(`${dateUntil}-01`);

            const months = [];
            while (from <= until) {
                const month = from.toISOString().slice(0, 7); // Format: YYYY-MM
                months.push(month);
              
                // Increment month
                from.setMonth(from.getMonth() + 1);
              }
              
            console.log("months", months)
            return months;
        }

        const calculateMonthlyAverages = (feedbacks, months) => {
            // Initialize averages object
            const monthlyAverages = {};
            questions.forEach((_, index) => {
                monthlyAverages[index + 1] = {};
                months.forEach(month => {
                    monthlyAverages[index + 1][month] = {
                        sum: 0,
                        count: 0
                    };
                });
            });

            // Calculate sums and counts
            feedbacks.forEach(feedback => {
                const feedbackMonth = new Date(feedback.feedback_date).toISOString().slice(0, 7);
                const responses = JSON.parse(feedback.responses);

                Object.entries(responses).forEach(([questionNum, response]) => {
                    // Convert response to numeric value
                    let value;
                    switch (response) {
                        case 'Satisfied': value = 1; break;
                        case 'Neutral': value = 2; break;
                        case 'Not Satisfied': value = 3; break;
                        case 'Partial': value = 2; break;
                        default: return; // Skip non-numeric responses
                    }

                    if (monthlyAverages[questionNum]?.[feedbackMonth]) {
                        monthlyAverages[questionNum][feedbackMonth].sum += value;
                        monthlyAverages[questionNum][feedbackMonth].count++;
                    }
                });
            });

            // Calculate averages
            Object.keys(monthlyAverages).forEach(questionNum => {
                Object.keys(monthlyAverages[questionNum]).forEach(month => {
                    const { sum, count } = monthlyAverages[questionNum][month];
                    monthlyAverages[questionNum][month] = count > 0 ? (sum / count).toFixed(2) : '-';
                });
            });

            return monthlyAverages;
        }
        // Read logo file as base64
        const logoPath = path.join(__dirname, '../assets/logo.png');
        let logoBase64;
        try {
            logoBase64 = fs.readFileSync(logoPath, { encoding: 'base64' });
        } catch (error) {
            console.warn('Logo not found:', error.message);
            logoBase64 = null;
        }

        let questionHtml = '';
        // console.log(Adata.responses)
        if (Array.isArray(data.responses)) {



            data.responses.forEach((q, questionIndex) => {
                questionHtml += `
                        <tr class=${questionIndex % 2 == 0 ? "stripe" : ""}>
                        <td class="cell">Daniel Fard</td>
                        <td class="cell">Strukturierte Mitarbeitergespräche erfolgreich führen</td>
                        <td class="cell">
                            Geplant: 4 Quartal 2024<br>
                            Tatsächlich: 23.10.2024
                        </td>
                        <td class="cell">ja</td>
                        <td class="cell"></td>
                        <td class="cell"></td>
                        <td class="cell">Wirksamkeit nach AZAV</td>
                    </tr>
                       `;
            });
        }
        // Load your HTML file (or pass HTML content directly)
        const htmlContent = `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
        <html xmlns="http://www.w3.org/1999/xhtml" xml:lang="de" lang="de">
        <head>
            <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
            <title>Fragebogen für Teilnehmerinnen und Teilnehmer an beruflichen Weiterbildungmaßnahmen</title>
            <meta name="keywords" content="Feedbackbogen:"/>
            <meta name="description" content="Feedbackbogen:"/>
            <style type="text/css">
                * { margin: 0; padding: 0; }
                
                body { font-family: Arial, sans-serif; font-size: 12pt; }
                
                .header { 
                    padding: 4pt 0 1pt 12pt;
                    border-bottom: 1pt solid #EDEDED;
                    font-size: 8pt;
                }
                
                .table-container {
                    margin-left: 5.61969pt;
                    border-collapse: collapse;
                    width: 98%;
                }
                
                .section-header {
                    background: #000;
                    color: #FFF;
                    padding: 4pt 6pt;
                    font-size: 7pt;
                    margin-top: 4pt;
                }
                
                .question-row td, .header-row td {
                    padding: 4pt 10pt;
                    border: 1pt solid #EDEDED;
                    font-size: 8pt;
                }
                
                .header-row { background: #DDDDDD; }
                .alternate-row { background: #EDEDED; }
                
                .numeric-cell { text-align: center; }
                .total-column { font-weight: bold; }
                
                .footer {
                    background: #000;
                    color: #FFF;
                    padding: 3pt 7pt;
                    font-size: 8pt;
                }
            </style>
        </head>
        <body>
            <h1 class="header">Auswertung: von ${data?.dateFrom} bis ${data?.dateUntil}</h1>
            <p class="header">Auswertung der Fragebögen für Teilnehmerinnen und Teilnehmer an beruflichen Weiterbildungmaßnahmen.</p>
        
            <!-- Repeat this table structure for each section -->
            <table class="table-container">
               
               
                   
                ${(() => {
                const displayMonths = getMonths(data.dateFrom, data.dateUntil);
                const calculationMonths = getMonthsEN(data.dateFrom, data.dateUntil);
                const monthlyAverages = calculateMonthlyAverages(feedbacks, calculationMonths);

                return questions.map((question, index) => {
                    const questionNum = (index + 1).toString();
                    const monthAverages = calculationMonths.map(month => monthlyAverages[questionNum]?.[month] || '-');
                    const validAverages = monthAverages.filter(avg => avg !== '-').map(Number);
                    const totalAvg = validAverages.length ?
                        (validAverages.reduce((sum, val) => sum + val, 0) / validAverages.length).toFixed(2) :
                        '-';

                    return `
                     <tr><td colspan=${displayMonths.length + 2} style="margin-top: 4pt;" class="section-header">${question.title}</td></tr>
                     <tr class="header-row">
                     <td style="font-size: 7pt;">Frage:</td>
                     ${displayMonths.map(month =>
                        `<td style="font-size: 7pt;" class="numeric-cell">${month}</td>`
                    ).join('')}
                    <td style="font-size: 7pt;" class="total-column">Note Gesamt</td>
                </tr>
                       ${question?.questions.map((questionsub, index) => {
                        return `<tr class="question-row">
                           <td style="font-size: 7pt; background-color:${index % 2 != 0 ? '#EDEDED' : '#FFFFFF'}">${questionsub.question}</td>
                            ${monthAverages.map(avg => `<td style="font-size: 7pt; background-color:${index % 2 != 0 ? '#EDEDED' : '#FFFFFF'}" class="numeric-cell">${avg}</td>`).join('')}
                            <td style="font-size: 7pt; background-color:${index % 2 != 0 ? '#EDEDED' : '#FFFFFF'}" class="numeric-cell">${totalAvg}</td>
                        </tr>`;
                    }).join('')}`;
                }).join('');
            })()}
            <tr><td style="font-size: 7pt;" colspan="${getMonths(data.dateFrom, data.dateUntil).length + 2}" class="footer">Anzahl der Feedbackbögen in der Auswertung: ${data?.feedbacks?.length || 0}</td></tr>
            </table>
          
        </body>
        </html>
        `;

        const timestamp = Math.floor(Date.now() / 1000);
        const filename = `feedbackbogen-auswertung_${timestamp}.pdf`;
        const outputPath = path.join(__dirname, '../../uploads', filename);

        const file = {
            html: htmlContent,
            data: data,
            path: outputPath

        };

        const options = {
            format: "A4",
            orientation: "landscape",
            border: "10mm",
            childProcessOptions: {
                env: {
                    OPENSSL_CONF: '/dev/null',
                },
            },
            renderDelay: 20,
            timeout: 180000,
            printBackground: true,
            height: "8.27in",
            width: "11.69in"
        };



        // Ensure uploads directory exists
        const uploadsDir = path.dirname(outputPath);
        if (!fs.existsSync(uploadsDir)) {
            fs.mkdirSync(uploadsDir, { recursive: true });
        }
        try {
            const result = await pdf.create(file, options);
            console.log("PDF generated:", result.filename);
            return {
                filename,
                path: `/uploads/${filename}`,
                url: process.env.BACKEND_URL + `/uploads/${filename}`
            };
        } catch (error) {
            console.error("Error generating PDF:", error);
            throw error;
        }





    }
    static async generateSuccessAndPlacementStatisticsPDF(data) {

        // Read logo file as base64
        const logoPath = path.join(__dirname, '../assets/logo.png');
        let logoBase64;
        try {
            logoBase64 = fs.readFileSync(logoPath, { encoding: 'base64' });
        } catch (error) {
            console.warn('Logo not found:', error.message);
            logoBase64 = null;
        }

        // Get statistics data
        const stats = await SuccessPlacementStatisticsModel.getStatisticsData(data.measureInfo.id, data.year);
console.log("stats",stats);
        // Generate rows for quarterly data
        let questionHtml = '';
        stats.quarterlyData.forEach((row, index) => {
            questionHtml += `
                <tr${index % 2 === 1 ? ' class="stripe"' : ''}>
                    <td class="cell">${row.start_date || ''}.${data.year}</td>
                    <td class="cell">${row.end_date || ''}.${data.year}</td>
                    <td class="cell" style="text-align: center">${row.total_students || 0}</td>
                    <td class="cell" style="text-align: center">${row.dropouts || 0}</td>
                    <td class="cell">${row.dropout_percentage || '0.00'}%</td>
                    <td class="cell" style="text-align: center">${row.exam_taken || 0}</td>
                    <td class="cell" style="text-align: center">${row.exam_passed || 0}</td>
                    <td class="cell">${row.success_rate || '0.00'}%</td>
                    <td class="cell" style="text-align: center">${row.surveyed_count || 0}</td>
                    <td class="cell" style="text-align: center">${row.employed_count || 0}</td>
                    <td class="cell" style="text-align: center">${row.placement_rate || '0.00'}%</td>
                </tr>
            `;
        });

        // Add totals row
        const totals = stats.totals;
        questionHtml += `
            <tr>
                <td colspan="2" class="cell header">Gesamt:</td>
                <td class="cell header" style="text-align: center">${stats.totals.total_students || 0}</td>
                <td class="cell header" style="text-align: center">${stats.totals.dropouts || 0}</td>
                <td class="cell header">${stats.totals.dropout_percentage || '0.00'}%</td>
                <td class="cell header" style="text-align: center">${stats.totals.exam_taken || 0}</td>
                <td class="cell header" style="text-align: center">${stats.totals.exam_passed || 0}</td>
                <td class="cell header">${stats.totals.success_rate || '0.00'}%</td>
                <td class="cell header" style="text-align: center">${stats.totals.surveyed_count || 0}</td>
                <td class="cell header" style="text-align: center">${stats.totals.employed_count || 0}</td>
                <td class="cell header" style="text-align: center">${stats.totals.placement_rate || '0.00'}%</td>
            </tr>
        `;
        // Load your HTML file (or pass HTML content directly)
        const htmlContent = `<!DOCTYPE html>
        <html lang="de">
        <head>
            <meta charset="utf-8">
            <title>Erfolgs- und Vermittlungsstatistik</title>
            <style>
                .cell { 
                    border: 1px solid #000;
                    padding: 4px;
                    font-size: 8pt;
                    vertical-align: top;
                }
                .header {
                    /* background-color: #f2f2f2; */
                    font-weight: bold;
                }
                .stripe { background-color: #EDEDED; }
            </style>
        </head>
        <body style="font-family: Arial; margin: 5px 10px 10px 5px;">
            <h1 style="padding-bottom: 4px; font-size: 10pt;">
                Erfolgs- und Vermittlungsstatistik ${data.year}
            </h1>
        
            <div style="margin-bottom: 10px;">
                <p style="padding: 4px;font-size: 10pt;margin-bottom: -4px;">Maßnahmenbezeichnung:</p>
                <div style="border: 1px solid #000; padding: 2px; margin-bottom: 6px;">
                    <p style="text-align: center; margin: 2px 0; font-size: 10pt;padding: 5px;">${data.measureInfo.measures_title}</p>
                </div>
                <p style="padding: 4px;font-size: 10pt;margin-bottom: -4px;">Maßnahme-Nummer:</p>
                <div style="border: 1px solid #000; padding: 2px;">
                    <p style="text-align: center; margin: 2px 0; font-size: 10pt;padding: 5px;">${data.measureInfo.measures_number}</p>
                </div>
            </div>
        
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 12px;">
                <thead>
                    <tr>
                        <td colspan="2" class="cell header">Maßnahmenzeitraum</td>
                        <td class="cell header">Anzahl:</td>
                        <td class="cell header">Anzahl: </td>
                        <td  class="cell header">Quote in % </td>
                        <td colspan="3" class="cell header">Prüfung gem § 34a GewO</td>
                        <td colspan="3" class="cell header">Vermittlungserfolg nach erfolgreicher Prüfung</td>
                    </tr>
                    <tr>
                        <td class="cell header">vom</td>
                        <td class="cell header">bis</td>
                        <td class="cell header">Teilnehmer</td>
                        <td class="cell header">Abbrüche</td>
                        <td class="cell header">Abbrüche</td>
                        <td class="cell header">angetreten</td>
                        <td class="cell header">bestanden</td>
                        <td class="cell header">Erfolgsquote</td>
                        <td class="cell header">Befragung nach 6 Monaten</td>
                        <td class="cell header">davon in Arbeit</td>
                        <td class="cell header">Verm.Quote</td>
                    </tr>
                </thead>
                <tbody>
                    <!-- Data Rows - Repeat pattern for other rows -->
                    ${questionHtml}
                </tbody>
            </table>
        
            <p style="font-size: 8pt; margin-top: 0px;">Erstellt: ${new Date().toLocaleDateString('de-DE')}</p>
        </body>
        </html>
        `;

        const timestamp = Math.floor(Date.now() / 1000);
        const filename = `erfolgsstatistik_${timestamp}.pdf`;
        const outputPath = path.join(__dirname, '../../uploads', filename);

        // Ensure uploads directory exists
        // Ensure uploads directory exists
        const uploadsDir = path.dirname(outputPath);
        if (!fs.existsSync(uploadsDir)) {
            fs.mkdirSync(uploadsDir, { recursive: true });
        }

        // if (!process.env.BACKEND_URL) {
        //     throw new Error('BACKEND_URL environment variable is not set');
        // }

        const file = {
            html: htmlContent,
            data: data,
            path: outputPath
        };

        const options = {
            format: "A4",
            orientation: "landscape",
            border: "10mm",
            padding: "10mm",
            childProcessOptions: {
                env: {
                    OPENSSL_CONF: '/dev/null',
                },
            },
            renderDelay: 20,
            timeout: 180000,
            printBackground: true,
            height: "8.27in",
            width: "11.69in"
        };
        try {
            const result = await pdf.create(file, options);
            console.log("PDF generated:", result.filename);
            return {
                filename,
                path: `/uploads/${filename}`,
                url: process.env.BACKEND_URL + `/uploads/${filename}`
            };
        } catch (error) {
            console.error("Error generating PDF:", error);
            throw error;
        }





    }
    static async generateQualifizierungsplanPDF(data) {

        // Read logo file as base64

        let questionHtml = '';
        // console.log(Adata.responses)
        if (Array.isArray(data.responses)) {



            data.responses.forEach((q, questionIndex) => {
                questionHtml += `
                        <tr class=${questionIndex % 2 == 0 ? "stripe" : ""}>
                        <td class="cell">${q.first_name} ${q.last_name}</td>
                        <td class="cell">${q.topic}</td>
                        <td class="cell">
                            Geplant: ${q.quarter}<br>
                            Tatsächlich: ${q.actual_date}
                        </td>
                        <td class="cell">${q.participant}</td>
                        <td class="cell">${q.reason_non_participation}</td>
                        <td class="cell">${q.effectiveness}</td>
                        <td class="cell">${q.feedback_assessment}</td>
                    </tr>
                       `;
            });
        }
        // Load your HTML file (or pass HTML content directly)
        const htmlContent = `<!DOCTYPE html>
        <html lang="de">
        <head>
            <meta charset="utf-8">
            <title>Qualifizierungsplan</title>
            <style>
                body { 
                    font-family: Arial, sans-serif;
                    margin: 15px;
                }
                .header-box {
                    border: 1px solid #000;
                    padding: 6px 0;
                    margin-bottom: 15px;
                    text-align: center;
                }
                .table {
                    width: 100%;
                    border-collapse: collapse;
                    margin-bottom: 15px;
                }
                .cell {
                    border: 1px solid #000;
                    padding: 6px;
                    font-size: 7pt;
                    vertical-align: top;
                }
                .header {
                    // background-color: #f2f2f2;
                    font-weight: bold;
                    font-size: 7pt;
                }
                .stripe { background-color: #EDEDED; }
                .footer-box {
                    border: 1px solid #000;
                    padding: 10px;
                    margin-top: 15px;
                }
            </style>
        </head>
        <body>
            <div class="header-box">
                <h1 style="font-size: 10pt;">Qualifizierungsplan: ${data.start_date == data.end_date ? data.start_date : data.start_date + ' - ' + data.end_date}</h1>
            </div> 
        
            <table class="table">
                <thead>
                    <tr>
                        <td class="cell header">Mitarbeiter/in:</td>
                        <td class="cell header">Schulungsthema:</td>
                        <td class="cell header">Zeitraum:</td>
                        <td class="cell header">Teilnahme:</td>
                        <td class="cell header">Gründe für Nichtteilnahme:</td>
                        <td class="cell header">Feedback / Teilnahmeauswertung:</td>
                        <td class="cell header">Wirksamkeit:</td>
                    </tr>
                </thead>
                <tbody>
                    <!-- Repeat this pattern for each row -->
                    ${questionHtml}
                    <!-- Add more rows following the same structure -->
                </tbody>
            </table>
        
            <div class="footer-box">
                <p style="font-size: 7pt;">Zur Feststellung des Qualifizierungsbedarfs werden neben der Auswertung der Mitarbeiterbezogenen Beschwerden, sowie der Analyse der Statistiken der JC und anderen Institutionen jährlich Mitarbeitergespräche durchgeführt.</p>
            </div>
        
            <p style="font-size: 7pt;">Erstellt: am ${new Date().toLocaleDateString('de-DE')}</p>
        </body>
        </html>
        `;

        const timestamp = Math.floor(Date.now() / 1000);
        const filename = `qualifizierrungsplan_${timestamp}.pdf`;
        const outputPath = path.join(__dirname, '../../uploads', filename);

        const file = {
            html: htmlContent,
            data: data,
            path: outputPath

        };

        const options = {
            format: "A4",
            orientation: "landscape",
            border: "10mm",
            padding: "10mm",
            footer: {
                height: "10mm",
                contents: function (current) {
                    return `<div style="font-size: 7pt; text-align: center;">Seite ${current.page} von ${current.numberOfPages}</div>`;
                }
            },
            childProcessOptions: {
                env: {
                    OPENSSL_CONF: '/dev/null',
                },
            },
            renderDelay: 20,
            timeout: 180000,
            printBackground: true,
            height: "8.27in",  // ✅ width of A4 in landscape
            width: "11.69in"   // ✅ height of A4 in landscape  
        };



        // Ensure uploads directory exists
        const uploadsDir = path.dirname(outputPath);
        if (!fs.existsSync(uploadsDir)) {
            fs.mkdirSync(uploadsDir, { recursive: true });
        }
        try {
            const result = await pdf.create(file, options);
            console.log("PDF generated:", result.filename);
            return {
                filename,
                path: `/uploads/${filename}`,
                url: process.env.BACKEND_URL + `/uploads/${filename}`
            };
        } catch (error) {
            console.error("Error generating PDF:", error);
            throw error;
        }




        return {
            filename,
            path: outputPath,
            url: process.env.BACKEND_URL + `/uploads/${filename}`
        };
    }

    static async generateResultSheetPDF(data) {
        console.log("data", data);
        const templatePath = path.join(__dirname, '../../templates/ergebnisbogen-bewerberprofil_ba045842.pdf');
        const existingPdfBytes = fs.readFileSync(templatePath);

        const pdfDoc = await PDFDocument.load(existingPdfBytes);
        const form = pdfDoc.getForm();
        const fields = form.getFields();
        for (const field of fields) {
            try {
                field.acroField.flatten();
            } catch (err) {
                console.warn(`Skipping field "${field.getName()}": ${err.message}`);
            }
        }

        const formatDate = (dateStr) => {
            if (!dateStr) return '';
            const date = new Date(dateStr);
            const day = String(date.getDate()).padStart(2, '0');
            const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
            const year = date.getFullYear();
            return `${day}.${month}.${year}`;
        };

        // Example field names (these depend on your PDF)
        const field1 = form.getTextField('BA-I-FW213[0].Seite1[0].TrägerMaßnahme[0]');
        const field2 = form.getTextField('BA-I-FW213[0].Seite1[0].BezeichnungMaßnahme[0]');
        const field3 = form.getTextField('BA-I-FW213[0].Seite1[0].MaßnahmeNummer[0]');
        const field4 = form.getTextField('BA-I-FW213[0].Seite1[0].Ansprechpartner-ininklTelNr[0]');

        const field5 = form.getTextField('BA-I-FW213[0].Seite1[0].NameVorname[0]');
        const field6 = form.getTextField('BA-I-FW213[0].Seite1[0].WohnortAgenturfürArbeit[0]');
        const field7 = form.getTextField('BA-I-FW213[0].Seite1[0].OrgzeichenKundennummer[0]');
        const field8 = form.getTextField('BA-I-FW213[0].Seite1[0].ReferenznummerBewerberprofil[0]');



        field1.setText(data.carrierOfTheMeasure);
        field2.setText(data.nameOfTheMeasure);
        field3.setText(data.measureNumber);
        field4.setText(data.contactPersonInclTel);
        field5.setText(data.nameFirstName);
        field6.setText(data.placeOfResidence);
        field7.setText(data.orgNumber);
        field8.setText(data.referenceNumber);

        for (let i = 0; i < data.skills.length; i++) {
            const label = form.getTextField(`BA-I-FW213[0].Seite1[0].Tabelle1[0].Zeile${i + 2}[0].S1Z${i + 2}[0]`);
            if (data.skills[i]?.label) label.setText(data.skills[i]?.label); else label.setText('');
            const skillsa = form.getCheckBox(`BA-I-FW213[0].Seite1[0].Tabelle1[0].Zeile${i + 2}[0].OptionenTabelle1Zeile${i + 2}[0]`);

            const skillsb = form.getCheckBox(`BA-I-FW213[0].Seite1[0].Tabelle1[0].Zeile${i + 2}[0].OptionenTabelle1Zeile${i + 2}[1]`);
            const skillsc = form.getCheckBox(`BA-I-FW213[0].Seite1[0].Tabelle1[0].Zeile${i + 2}[0].OptionenTabelle1Zeile${i + 2}[2]`);

            if (data.skills[i]?.value === "Grund-Kenntnisse") {
                skillsa.check();
                form.updateFieldAppearances();
            }
            else skillsa.uncheck();
            if (data.skills[i]?.value === "Erweiterte-Kenntnisse") {
                skillsb.check();
                form.updateFieldAppearances();
            }
            else skillsb.uncheck();
            if (data.skills[i]?.value === "Experten-Kenntnisse") {
                skillsc.check();
                form.updateFieldAppearances();
            }
            else skillsc.uncheck();
        }

        for (let i = 0; i < data.it_skills.length; i++) {
            const label = form.getTextField(`BA-I-FW213[0].Seite2[0].Tabelle2[0].Zeile${i + 2}[0].S1Z${i + 2}[0]`);
            if (data.it_skills[i]?.label) label.setText(data.it_skills[i]?.label); else label.setText('');
            const it_skills_a = form.getCheckBox(`BA-I-FW213[0].Seite2[0].Tabelle2[0].Zeile${i + 2}[0].OptionenTabelle2Zeile${i + 2}[0]`);
            const it_skills_b = form.getCheckBox(`BA-I-FW213[0].Seite2[0].Tabelle2[0].Zeile${i + 2}[0].OptionenTabelle2Zeile${i + 2}[1]`);
            const it_skills_c = form.getCheckBox(`BA-I-FW213[0].Seite2[0].Tabelle2[0].Zeile${i + 2}[0].OptionenTabelle2Zeile${i + 2}[2]`);

            if (data.it_skills[i]?.value === "Grund-Kenntnisse") {
                it_skills_a.check();
                form.updateFieldAppearances();
            }
            else it_skills_a.uncheck();
            if (data.it_skills[i]?.value === "Erweiterte-Kenntnisse") {
                it_skills_b.check();
                form.updateFieldAppearances();
            }
            else it_skills_b.uncheck();
            if (data.it_skills[i]?.value === "Experten-Kenntnisse") {
                it_skills_c.check();
                form.updateFieldAppearances();
            }
            else it_skills_c.uncheck();
        }

        for (let i = 0; i < data.language_skills.length; i++) {
            const label = form.getTextField(`BA-I-FW213[0].Seite2[0].Tabelle3[0].Zeile${i + 2}[0].S1Z${i + 2}[0]`);
            if (data.language_skills[i]?.language) label.setText(data.language_skills[i]?.language); else label.setText('');
            const language_skills_a = form.getCheckBox(`BA-I-FW213[0].Seite2[0].Tabelle3[0].Zeile${i + 2}[0].OptionenTabelle3Zeile${i + 2}[0]`);
            const language_skills_b = form.getCheckBox(`BA-I-FW213[0].Seite2[0].Tabelle3[0].Zeile${i + 2}[0].OptionenTabelle3Zeile${i + 2}[1]`);
            const language_skills_c = form.getCheckBox(`BA-I-FW213[0].Seite2[0].Tabelle3[0].Zeile${i + 2}[0].OptionenTabelle3Zeile${i + 2}[2]`);

            if (data.language_skills[i]?.level === "Grund-Kenntnisse") {
                language_skills_a.check();
                form.updateFieldAppearances();
            }
            else language_skills_a.uncheck();
            if (data.language_skills[i]?.level === "Erweiterte-Kenntnisse") {
                language_skills_b.check();
                form.updateFieldAppearances();
            }
            else language_skills_b.uncheck();
            if (data.language_skills[i]?.level === "Experten-Kenntnisse") {
                language_skills_c.check();
                form.updateFieldAppearances();
            }
            else language_skills_c.uncheck();
        }
        const bundesweit = form.getCheckBox('BA-I-FW213[0].Seite2[0].Tabelle4[0].Zeile2[0].OptionenTabelle4Zeile2[0]');
        const international = form.getCheckBox('BA-I-FW213[0].Seite2[0].Tabelle4[0].Zeile2[0].OptionenTabelle4Zeile2[1]');

        if (data.mobility.willing_to_be_mobile == "Bundesweit") {
            bundesweit.check();
            form.updateFieldAppearances();
        }
        else bundesweit.uncheck();
        if (data.mobility.willing_to_be_mobile == "Internationale") {
            international.check();
            form.updateFieldAppearances();
        }
        else international.uncheck();

        const maximum_commuting_time = form.getTextField('BA-I-FW213[0].Seite2[0].Tabelle4[0].Zeile2[0].Pendelzeit[0]');
        const regional_wishes = form.getTextField('BA-I-FW213[0].Seite2[0].Tabelle4[0].Zeile3[0].S2Z3[0]');

        // willing_to_be_mobile.setText(data.willingToBeMobile);
        maximum_commuting_time.setText(data.mobility.maximum_commuting_time);
        regional_wishes.setText(data.mobility.regional_wishes);

        for (let i = 0; i < data.internships.length; i++) {
            const from = form.getTextField(`BA-I-FW213[0].Seite2[0].Tabelle5[0].Zeile${i + 2}[0].S1Z${i + 2}[0]`);
            const to = form.getTextField(`BA-I-FW213[0].Seite2[0].Tabelle5[0].Zeile${i + 2}[0].S2Z${i + 2}[0]`);
            const at = form.getTextField(`BA-I-FW213[0].Seite2[0].Tabelle5[0].Zeile${i + 2}[0].S3Z${i + 2}[0]`);
            const activity_as = form.getTextField(`BA-I-FW213[0].Seite2[0].Tabelle5[0].Zeile${i + 2}[0].S4Z${i + 2}[0]`);

            if (data.internships[i]?.from) from.setText(formatDate(data.internships[i]?.from)); else from.setText('');
            if (data.internships[i]?.to) to.setText(formatDate(data.internships[i]?.to)); else to.setText('');
            if (data.internships[i]?.at) at.setText(data.internships[i]?.at); else at.setText('');
            if (data.internships[i]?.activity_as) activity_as.setText(data.internships[i]?.activity_as); else activity_as.setText('');

        }
        for (let i = 0; i < data.applications.length; i++) {
            const application_to = form.getTextField(`BA-I-FW213[0].Seite2[0].Tabelle6[0].Zeile${i + 2}[0].S1Z${i + 2}[0]`);
            const to = form.getTextField(`BA-I-FW213[0].Seite2[0].Tabelle6[0].Zeile${i + 2}[0].S2Z${i + 2}[0]`);
            const ergebnis_offen = form.getCheckBox(`BA-I-FW213[0].Seite2[0].Tabelle6[0].Zeile${i + 2}[0].OptionenTabelle6Zeile${i + 2}[0]`);
            const absage = form.getCheckBox(`BA-I-FW213[0].Seite2[0].Tabelle6[0].Zeile${i + 2}[0].OptionenTabelle6Zeile${i + 2}[1]`);

            if (data.applications[i]?.application_to) application_to.setText(data.applications[i]?.application_to); else application_to.setText('');
            if (data.applications[i]?.to) to.setText(data.applications[i]?.to); else to.setText('');
            if (data.applications[i]?.status === "Ergebnis Offen") {
                ergebnis_offen.check();
                form.updateFieldAppearances();
            }
            else ergebnis_offen.uncheck();
            if (data.applications[i]?.status === "Absage") {
                absage.check();
                form.updateFieldAppearances();
            }
            else absage.uncheck();

        }
        const future_application = form.getTextField('BA-I-FW213[0].Seite3[0].TeilformularZukünftigeBewerbung[0].ZukBewerbungsaktiv1[0]');
        const alternatives = form.getTextField('BA-I-FW213[0].Seite3[0].TeilformularAlternativen[0].Alternativen1[0]');
        const other_comments = form.getTextField('BA-I-FW213[0].Seite3[0].TeilformularSonstigeAnmerk[0].SonstigeAnmerkungen1[0]');
        const date_of_participation = form.getTextField('BA-I-FW213[0].Seite3[0].OrtDatum1[0]');

        future_application.setText(data.future_application);
        alternatives.setText(data.alternatives);
        other_comments.setText(data.other_comments);
        date_of_participation.setText(formatDate(data.date_of_participation));
        // Extract actual base64 (in case it has data:image/png;base64,...)
        const base64 = data.signature.split(',').pop();
        const imageBuffer = Buffer.from(base64, 'base64');

        // Use PNG or JPG based on your image
        const image = await pdfDoc.embedPng(imageBuffer); // or embedJpg(imageBuffer)
        const page = pdfDoc.getPage(2);

        const { width, height } = image.scale(0.5); // Adjust scale if needed

        page.drawImage(image, {
            x: 100,
            y: 120,
            width,
            height,
        });

        // Save the modified PDF

        const pdfBytes = await pdfDoc.save();
        const timestamp = Math.floor(Date.now() / 1000);
        const filename = `ergebnisbogen-bewerberprofil_${timestamp}.pdf`;
        const outputPath = path.join(__dirname, '../../uploads', filename);

        fs.writeFileSync(outputPath, pdfBytes);





        return {
            filename,
            path: outputPath,
            url: `/uploads/${filename}`
        };
    }

    static async generateAssessmentPDF(data) {

        // Read logo file as base64
        const logoPath = path.join(__dirname, '../assets/logo.png');
        let logoBase64;
        try {
            logoBase64 = fs.readFileSync(logoPath, { encoding: 'base64' });
        } catch (error) {
            console.warn('Logo not found:', error.message);
            logoBase64 = null;
        }

        let questionHtml = '';
        // console.log(Adata.responses)
        if (Array.isArray(data.responses)) {



            data.responses.forEach((q, questionIndex) => {
                if (questionIndex === 0) {
                    questionHtml += `
                          <div style="page-break-before: always;"></div>
                          <h4 style="margin-top: 20px; font-size: 11px;">Aufgabe 1</h4>
                          <h5 style="margin-top: -5px; font-size: 11px;border-bottom: 1px solid black; width: max-content;">
                              <strong>Aufgaben:</strong>
                          </h5>
                      `;
                } else if (questionIndex === 4) {
                    questionHtml += `
                          <div style="page-break-before: always;"></div>
                          <h4 style="margin-top: 20px; font-size: 11px;">Aufgabe 2</h4>
                          <h5 style="margin-top: -5px; font-size: 11px;border-bottom: 1px solid black; width: max-content;">
                              <strong>Aufgaben:</strong>
                          </h5>
                      `;
                } else if (questionIndex === 9) {
                    questionHtml += `
                          <div style="page-break-before: always;"></div>
                          <h4 style="margin-top: 20px; font-size: 11px;">Aufgabe 3</h4>
                          <h5 style="margin-top: -5px; font-size: 11px;border-bottom: 1px solid black; width: max-content;">
                              <strong>Aufgaben:</strong>
                          </h5>
                          `;
                }
                questionHtml += `
                          <div style="margin-top: 8px; width: 100%;">
                              <h5 style="margin: 20px 0 8px 0; font-size: 9px; font-weight: 400;">${questionIndex + 1}. ${q.question}</h5>
                              <div style="font-weight: 400;">
                                  <div class="option-item" style="display: block; width: max-content; font-size: 9px; padding: 5px 10px;  ${(q.selected_option === 'a' && q.correct_option === 'a')
                        ? 'border: 1px solid #a7f0a7; background-color: #a7f0a7; color: rgb(31,73,37); font-size: 9px; margin-bottom: 4px; border-radius: 3px;'
                        : (q.selected_option === 'a' && q.correct_option !== 'a')
                            ? 'border: 1px solid #f0a7a7; background-color: #f0a7a7; color: rgb(111,37,37); font-size: 9px; margin-bottom: 4px; border-radius: 3px;'
                            : (q.correct_option === 'a' && q.selected_option !== 'a')
                                ? 'border: 1px solid green; color: black; font-size: 9px; margin-bottom: 4px; border-radius: 3px;'
                                : 'font-size: 9px; margin-bottom: 4px; border-radius: 3px;'}">a) ${q.option_a}</div>
                                  <div class="option-item" style="display: block; width: fit-content; font-size: 9px; padding: 5px 10px;  ${(q.selected_option === 'b' && q.correct_option === 'b')
                        ? 'border: 1px solid #a7f0a7; background-color: #a7f0a7; color: rgb(31,73,37); font-size: 9px; margin-bottom: 4px; border-radius: 3px;'
                        : (q.selected_option === 'b' && q.correct_option !== 'b')
                            ? 'border: 1px solid #f0a7a7; background-color: #f0a7a7; color: rgb(111,37,37); font-size: 9px; margin-bottom: 4px; border-radius: 3px;'
                            : (q.correct_option === 'b' && q.selected_option !== 'b')
                                ? 'border: 1px solid green; color: black; font-size: 9px; margin-bottom: 4px; border-radius: 3px;'
                                : 'font-size: 9px; margin-bottom: 4px; border-radius: 3px;'}">b) ${q.option_b}</div>
                                  <div class="option-item" style="display: block; width: fit-content; font-size: 9px; padding: 5px 10px;  ${(q.selected_option === 'c' && q.correct_option === 'c')
                        ? 'border: 1px solid #a7f0a7; background-color: #a7f0a7; color: rgb(31,73,37); font-size: 9px; margin-bottom: 4px; border-radius: 3px;'
                        : (q.selected_option === 'c' && q.correct_option !== 'c')
                            ? 'border: 1px solid #f0a7a7; background-color: #f0a7a7; color: rgb(111,37,37); font-size: 9px; margin-bottom: 4px; border-radius: 3px;'
                            : (q.correct_option === 'c' && q.selected_option !== 'c')
                                ? 'border: 1px solid green; color: black; font-size: 9px; margin-bottom: 4px; border-radius: 3px;'
                                : 'font-size: 9px; margin-bottom: 4px; border-radius: 3px;'}">c) ${q.option_c}</div>
                              </div>
                          </div>
                      `;
            });
            // });
        }
        // Load your HTML file (or pass HTML content directly)
        const htmlContent = `
          <html lang="de">
              <head>
                  <meta charset="UTF-8" />
                  <title>Eignungsfeststellung</title>
              </head>
              <body style="font-family: Arial, sans-serif; color: black; max-width: 800px; margin: 0 auto; padding: 20px;">
                          <div style="text-align: center; margin: 20px 0;">
                              <img src="data:image/png;base64,${logoBase64 || ''}"
                        style="height: 120px; width: auto; display: block; margin: 0 auto;" alt="Logo" />
                          </div>
          
                          <h5 style="margin-top: 10px; font-size: 11px;">Eignungsfeststellung für die Weiterbildung
                              <br>„IHK geprüfte Sicherheitsfachkraft gemäß §34a GewO Online“</h5>
                          <h5 style="margin: 1px 0; font-size: 11px">Hausordnung</h5>
                          <h5 style="margin: 10px 0; font-size: 9px;font-weight: 550;">(Sorgfältig lesen)</h5>
          
                          <h5 style="margin-top: 10px; font-size: 9px; font-weight: 400;"><strong>Ordnung:</strong> In sämtlichen Räumen und Anlagen unserer Schule ist auf Ordnung und Sauberkeit zu achten. Schulräume,
                              Einrichtungen und Anlagen sind sorgfältig zu benutzen. Außerhalb der Unterrichtszeiten dürfen sich Lernende nicht in den
                              Räumen aufhalten.
                              
                              Es ist untersagt, in den Klassenräumen etwas an die Wände zu kleben oder zu schreiben und
                              Schulmöbel in andere Räume zu bringen. Mitarbeitende und Lernende, die Schäden feststellen, melden diese dem
                              Sekretariat.</h5>
          
                          <h5 style="margin-top: 10px; font-weight: 400; font-size: 9px;"><strong>Alkohol- und Drogenkonsum:</strong> Der Konsum von Alkohol, illegalen Drogen sowie anderen psychoaktiven Substanzen ist auf
                              dem gesamten Schulareal und während schulischer Veranstaltungen (einschließlich aller Pausen) verboten. In
                              Ausnahmefällen kann die Schulleitung den Konsum von Alkohol erlauben.</h5>
          
                          <h5 style="margin-top: 10px;  font-weight: 400; font-size: 9px;"><strong>Diebstahl:</strong> Es empfiehlt sich, Wertsachen und Bargeld sorgfältig aufzubewahren. Die Schule stellt den Lernenden und
                              Mitarbeitenden kostenlos Schließfächer zur Verfügung. Für verlorene Schlüssel wird eine Gebühr von Euro 50,- erhoben.
                              Die Schule übernimmt für Diebstähle keine Haftung.</h5>
          
                          <h5 style="margin-top: 10px;  font-weight: 400; font-size: 9px;"><strong>Parkplätze:</strong> Auf dem Schulareal stehen keine Gratis-Autoparkplätze zur Verfügung. Fahrräder müssen in den dafür
                              vorgesehenen Fahrradkeller gebracht und abgeschlossen werden. Mopeds und Motorräder sind auf dem Schulareal nicht
                              erlaubt.</h5>
          
                          <h5 style="margin-top: 10px;  font-weight: 400; font-size: 9px;">Lesen Sie den Text und die Aufgaben 1 bis 4 dazu. Wählen Sie bei jeder Aufgabe die richtige Lösung: a, b oder c. Sie
                              informieren sich über die Hausordnung der BAD Bildungsakademie Deutschland GmbH. Sie nehmen in deren
                              Räumlichkeiten an einem Lehrgang teil.</h5>
          
                          <h5 style="margin-top: 10px; font-weight: 400; font-size: 9px;"><strong>Aufgaben:</strong> Die Lernenden der BAD Bildungsakademie Deutschland GmbH sind für die Sauberkeit der
                              Klassenräume verantwortlich. Sie sind verpflichtet, die Räume sauber zu halten und die Stühle nach
                              Unterrichtsende hochzustellen.</h5>
          
                          <h5 style="margin-top: 10px; font-weight: 600; font-size: 9px;">Jeweils eine Antwort ist richtig!</h5>
          
          
                          <table style="width: 100%; margin: 1px 0; border-collapse: separate; border-spacing: 2px 0; font-size: 10px;">
                              <tr>
                                  <td style="font-weight: 550; padding: 6px;">Legende:</td>
                                  <td style="width: 22%; padding: 6px; border: 1px solid #a7f0a7; background-color: #a7f0a7; color: rgb(31,73,37); text-align: center; border-radius: 4px;">richtig beantwortet</td>
                                  <td style="width: 22%; padding: 6px; border: 1px solid #f0a7a7; background-color: #f0a7a7; color: rgb(111,37,37); text-align: center; border-radius: 4px;">falsch beantwortet</td>
                                  <td style="width: 22%; padding: 6px; border: 1px solid green; color: black; text-align: center; border-radius: 4px;">richtige Antwort</td>
                              </tr>
                          </table>
                          ${questionHtml}
                          <div style="page-break-before: always;"></div>
                      </div>
          
                      <div style="width: 100%; display: flex; flex-direction: column; margin-top: 40px;">
                          <h5 style="width: 100%; font-size: 9px; font-weight: 500;">Mit der Übermittlung der Eignungsfeststellung, erkläre ich, dass ich diese ohne Hilfe dritter absolviert habe.</h5>
                          <div style="width: 100%; display: flex; flex-direction: column; margin-top: 10px;">
                              <img src="${data?.signature_image || ''}" style="width: 200px; height: 80px;" alt="Signature" />
                          </div>
                          <h5 style="text-align: start;margin-top: 0px; margin-bottom: 0px; font-size: 9px; font-weight: 400;">${data?.first_name} ${data?.last_name}</h5>
                          <h5 style="text-align: start;margin-top: 5px; margin-bottom: 0px; font-size: 9px; font-weight: 400;">06.08.2024</h5>
                      </div>
          
                      <h5 style="margin-top: 40px; margin-bottom: 5px; font-size: 9px; font-weight: 400;">Bemerkungen/ Notizen vom Bildungsträger</h5>
                      <div style="min-height: 150px; text-align: start;border: 2px solid black;padding: 10px;padding-top: 2px;">
                          ${data.comment ? `<p style="font-size: 9px; margin: 0;">${data.comment}</p>` : ''}
                      </div>
          
              </body>
          </html>`;

        const timestamp = Math.floor(Date.now() / 1000);
        const filename = `eignungsfeststellung_${timestamp}.pdf`;
        const outputPath = path.join(__dirname, '../../uploads', filename);

        const file = {
            html: htmlContent,
            data: data,
            path: outputPath

        };

        const options = {
            format: "A4",
            orientation: "portrait",
            border: "10mm",
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



        // Ensure uploads directory exists
        const uploadsDir = path.dirname(outputPath);
        if (!fs.existsSync(uploadsDir)) {
            fs.mkdirSync(uploadsDir, { recursive: true });
        }
        try {
            const result = await pdf.create(file, options);
            console.log("PDF generated:", result.filename);
            return {
                filename,
                path: `/uploads/${filename}`,
                url: `/uploads/${filename}`
            };
        } catch (error) {
            console.error("Error generating PDF:", error);
            throw error;
        }




        return {
            filename,
            path: outputPath,
            url: `/uploads/${filename}`
        };
    }

    static async generateDataCollectionPDF(data) {
        const logoPath = path.join(__dirname, '../assets/logo.png');
        let logoBase64;
        try {
            logoBase64 = fs.readFileSync(logoPath, { encoding: 'base64' });
        } catch (error) {
            console.warn('Logo not found:', error.message);
            logoBase64 = null;
        }

        const languageLabels = [
            "Deutsch", "Englisch", "Französisch", "Türkisch", "Arabisch", "Sonstige"
        ];
        const rows = Object.entries(data?.languages || {}).map(([key, value], index) => {
            const bgColor = index % 2 === 0 ? "#f2f2f2" : "white";
            return `
              <tr>
                <th style="font-size: 9px; font-weight: 400; padding: 5px; border-right: 5px solid white; text-align: left; background-color: ${bgColor};">${languageLabels[index]}:</th>
                <td style="font-size: 9px; font-weight: 400; padding: 5px; border-right: 5px solid white; background-color: ${bgColor};">
                ${value}
                </td>
              </tr>
            `;
        }).join('');
        const htmlContent = `<!DOCTYPE html>
    <html lang="de">
    <head>
        <meta charset="UTF-8">
        <title>Erfassungsbogen</title>
    </head>
    <body style="font-family: Arial, sans-serif; padding: 15px 10px 15px 15px; color: black;">
        <div style="text-align: center; margin: 20px 0;">
            <img src="data:image/png;base64,${logoBase64}"
                style="height: 120px; width: auto; display: block; margin: 0 auto;" />
        </div>
    
        <h2 style="font-size: 11px;">Erfassungsbogen</h2>
        <p style="font-size: 10px;"><strong>An welcher Maßnahme ist der Teilnehmer interessiert:</strong><br>
        ${data?.basic_info?.interested_measure}</p>
      
        <table style="width: 100%; margin-top: 5px; border-collapse: collapse;">
            <tr>
                <th style="font-size: 9px; font-weight: 400; padding: 5px; border-right: 5px solid white; text-align: left; background-color: #f2f2f2;">Datum Eintritt:</th>
                <td style="font-size: 9px; font-weight: 400; padding: 5px; border-right: 5px solid white; background-color: #f2f2f2;">${data?.basic_info?.entry_date || ''}</td>
                <th style="font-size: 9px; font-weight: 400; padding: 5px; border-right: 5px solid white; text-align: left; background-color: #f2f2f2;">Datum Austritt:</th>
                <td style="font-size: 9px; font-weight: 400; padding: 5px; border-right: 5px solid white; background-color: #f2f2f2;">${data?.basic_info?.departure_date || ''}</td>
            </tr>
            <tr>
                <th style="font-size: 9px; font-weight: 400; padding: 5px; border-right: 5px solid white; text-align: left; background-color: white;">Vorname:</th>
                <th style="font-size: 9px; font-weight: 400; padding: 5px; border-right: 5px solid white; background-color: white;">${data?.basic_info?.first_name}</td>
                <th style="font-size: 9px; font-weight: 400; padding: 5px; border-right: 5px solid white; text-align: left; background-color: white;">Nachname:</th>
                <th style="font-size: 9px; font-weight: 400; padding: 5px; border-right: 5px solid white; background-color: white;">${data?.basic_info?.last_name}</td>
            </tr>
            <tr>
                <th style="font-size: 9px; font-weight: 400; padding: 5px; border-right: 5px solid white; text-align: left; background-color: #f2f2f2;">Straße:</th>
                <th style="font-size: 9px; font-weight: 400; padding: 5px; border-right: 5px solid white; background-color: #f2f2f2;">${data?.basic_info?.street}</th>
                <th style="font-size: 9px; font-weight: 400; padding: 5px; border-right: 5px solid white; text-align: left; background-color: #f2f2f2;">Hausnummer:</th>
                <th style="font-size: 9px; font-weight: 400; padding: 5px; border-right: 5px solid white; background-color: #f2f2f2;">${data?.basic_info?.house_number}</th>
            </tr>
            <tr>
                <th style="font-size: 9px; font-weight: 400; padding: 5px; border-right: 5px solid white; text-align: left; background-color: white;">PLZ:</th>
                <th style="font-size: 9px; font-weight: 400; padding: 5px; border-right: 5px solid white; background-color: white;">${data?.basic_info?.plz}</th>
                <th style="font-size: 9px; font-weight: 400; padding: 5px; border-right: 5px solid white; text-align: left; background-color: white;">Stadt:</th>
                <th style="font-size: 9px; font-weight: 400; padding: 5px; border-right: 5px solid white; background-color: white;">${data?.basic_info?.city}</th>
            </tr>
            <tr>
                <th style="font-size: 9px; font-weight: 400; padding: 5px; border-right: 5px solid white; text-align: left; background-color: #f2f2f2;">Geburtsdatum:</th>
                <th style="font-size: 9px; font-weight: 400; padding: 5px; border-right: 5px solid white; background-color: #f2f2f2;">${data?.basic_info?.birth_date}</th>
                <th style="font-size: 9px; font-weight: 400; padding: 5px; border-right: 5px solid white; text-align: left; background-color: #f2f2f2;">Geburtsort:</th>
                <th style="font-size: 9px; font-weight: 400; padding: 5px; border-right: 5px solid white; background-color: #f2f2f2;">${data?.basic_info?.place_of_birth}</th>
            </tr>
            <tr>
                <th style="font-size: 9px; font-weight: 400; padding: 5px; border-right: 5px solid white; text-align: left; background-color: white;">Geburtsland:</th>
                <th colspan="3" style="font-size: 9px; font-weight: 400; padding: 5px; background-color: white;  ">${data?.basic_info?.country_of_birth}</th>
            </tr>
            <tr>
                <th style="font-size: 9px; font-weight: 400; padding: 5px; border-right: 5px solid white; text-align: left; background-color: #f2f2f2;">Telefon:</th>
                <th style="font-size: 9px; font-weight: 400; padding: 5px; border-right: 5px solid white; background-color: #f2f2f2;">${data?.basic_info?.phone}</th>
                <th style="font-size: 9px; font-weight: 400; padding: 5px; border-right: 5px solid white; text-align: left; background-color: #f2f2f2;">E-Mail:</th>
                <th style="font-size: 9px; font-weight: 400; padding: 5px; border-right: 5px solid white; background-color: #f2f2f2;">${data?.basic_info?.email}</th>
            </tr>
        </table> 
        <table style="background-color: #f2f2f2; width: 100%; margin: 5px 0;">
        <tr>
            <th style="font-size: 9px; font-weight: 400; padding: 5px; width: 40%; text-align: left;">Besondere Kenntnisse:</th>
            <td style="font-size: 9px; font-weight: 400; padding: 5px; width: 60%;"> ${Object.values(data?.special_knowledge || {}).filter(Boolean).join(' ')}</td>
        </tr>
        </table>
    
        <div style="margin-top: 5px;">
            <h1 style="font-weight: 550; font-size: 11px; width: 50%;"><strong>Sprachen</strong></h1>
            <h1 style="margin-top: -5px; font-size: 9px; font-weight: 400;">(Wort und Schrift)</h1>
            <table style="width: 100%; margin-top: 10px; border-collapse: collapse;">
                ${rows}
            </table>
        </div>
    
        <div style="margin-top: 5px;">
            <h1 style="font-weight: 550; font-size: 11px; width: 50%;"><strong>Persönliche Eignung</strong></h1>
            <table style="width: 100%; margin-top: 5px; border-collapse: collapse;">
                <tr><th style="width: 50%; font-size: 9px; font-weight: 400; padding: 5px; border-right: 5px solid white; text-align: left; background-color: #f2f2f2;">Schichtsystem (Tag/Nacht/Wochenende)</th><td style="font-size: 9px; font-weight: 400; padding: 5px; border-right: 5px solid white; background-color: #f2f2f2;">${data?.personal_suitability?.shift_system ? 'Ja' : 'Nein'}</td></tr>
                <tr><th style="width: 50%; font-size: 9px; font-weight: 400; padding: 5px; border-right: 5px solid white; text-align: left; background-color: white;">Dienstzeiten (8h/12h)</th><td style="font-size: 9px; font-weight: 400; padding: 5px; border-right: 5px solid white; background-color: white;">${data?.personal_suitability?.working_hours ? 'Ja' : 'Nein'}</td></tr>
                <tr><th style="width: 50%; font-size: 9px; font-weight: 400; padding: 5px; border-right: 5px solid white; text-align: left; background-color: #f2f2f2;">gesundheitliche Einschränkungen</th><td style="font-size: 9px; font-weight: 400; padding: 5px; border-right: 5px solid white; background-color: #f2f2f2;">${data?.personal_suitability?.health_restrictions ? 'Ja' : 'Nein'}</td></tr>
                <tr><th style="width: 50%; font-size: 9px; font-weight: 400; padding: 5px; border-right: 5px solid white; text-align: left; background-color: white;">Mobilität (Öffentliche/Auto)</th><td style="font-size: 9px; font-weight: 400; padding: 5px; border-right: 5px solid white; background-color: white;">${data?.personal_suitability?.furniture_transport ? 'Ja' : 'Nein'}</td></tr>
            </table>
            <h1 style="font-weight: 400; font-size: 9px; width: 50%;">Sonstiges :</h1>
            <div style="min-height: 50px; text-align: start;border: 2px solid #f2f2f2;padding: 10px;padding-top: 2px;">
                <h1 style="font-weight: 400; font-size: 9px; width: 50%;">${data?.personal_suitability?.miscellaneous || ''}</h1>
            </div>
        </div>
    
        <div style="margin-top: 20px;">
            <h1 style="font-weight: 550; font-size: 11px; width: 50%;"><strong>Fachliche Eignung</strong></h1>
            <table style="width: 100%; margin-top: 10px; border-collapse: collapse;">
                <tr>
                    <th style="width: 50%; font-size: 9px; font-weight: 400; padding: 5px; border-right: 5px solid white; text-align: left; background-color: #f2f2f2;">Internetfähiges (mit einer Bandbreite von mindestens 1,5 Mbit/s ist empfohlen) Handy, Tablet, Laptop, PC o.ä. (Hardware) vorhanden?</th>
                    <td style="font-size: 9px; font-weight: 400; padding: 5px; border-right: 5px solid white; background-color: #f2f2f2;">${data?.professional_suitability?.has_internet_device ? 'Ja' : 'Nein'}</td>
                </tr>
                <tr><th style="width: 50%; font-size: 9px; font-weight: 400; padding: 5px; border-right: 5px solid white; text-align: left; background-color: white;">B1 Niveau ist vorhanden</th><td style="font-size: 9px; font-weight: 400; padding: 5px; border-right: 5px solid white; background-color: white;">${data?.professional_suitability?.b1_level_available ? 'Ja' : 'Nein'}</td></tr>
                <tr><th style="width: 50%; font-size: 9px; font-weight: 400; padding: 5px; border-right: 5px solid white; text-align: left; background-color: #f2f2f2;">Zugangsdaten Jobbörse vorhanden</th><td style="font-size: 9px; font-weight: 400; padding: 5px; border-right: 5px solid white; background-color: #f2f2f2;">${data?.professional_suitability?.job_board_access ? 'Ja' : 'Nein'}</td></tr>
                <tr><th style="width: 50%; font-size: 9px; font-weight: 400; padding: 5px; border-right: 5px solid white; text-align: left; background-color: white;">Führungszeugnis lag vor</th><td style="font-size: 9px; font-weight: 400; padding: 5px; border-right: 5px solid white; background-color: white;">${data?.professional_suitability?.good_conduct_was_available ? 'Ja' : 'Nein'}</td></tr>
            </table>
            <table class="equal-columns" style="background-color:white; margin-top: 20px; display: flex; align-items: baseline;">
                <tr>
                    <td style="width: 60%; font-size: 9px; font-weight: 400; padding: 5px;">Wenn Nein -> wird vor Maßnahme Beginn beantragt und der BAD Bildungsakademie Deutschland GmbH vorgelegt. Danach Kann die Maßnahme erst begonnen werden, wenn keine relevanten Einträge vorhanden sind. Dies habe ich zur Kenntnis genommen und bestätige ich.</td>
                </tr>
                <tr>
                    <td style="padding-left: 20px;">
                        <span style="font-size: 9px; font-weight: 400;">nein -> Maßnahme kann nicht absolviert werden</span>
                    </td>
                </tr>
                <tr>
                    <td style="padding-left: 20px;">
                        <div style="display: inline-block; flex-direction: column;">
                            <img src="${data?.personal_suitability_applicant_signature || ''}" style="width: 100px; height: 50px;" alt="Signature" />
                            <div style="width: 100px; border-top: 1px solid black; text-align: center; padding-top: 5px; font-size: 9px; font-weight: 400;">Unterschrift Bewerber</div>
                        </div>
                    </td>
                </tr>
            </table>
            <table class="equal-columns" style="margin-bottom: 10px; width: 100%;">
                <tr><th style="width: 50%; font-size: 9px; font-weight: 400; padding: 5px; border-right: 5px solid white; text-align: left; background-color: #f2f2f2;">Berufliche Informationen</th><td style="font-size: 9px; font-weight: 400; padding: 5px; border-right: 5px solid white; background-color: #f2f2f2;">ja</td></tr>
                <tr><th style="width: 50%; font-size: 9px; font-weight: 400; padding: 5px; border-right: 5px solid white; text-align: left; background-color: white;">Erfahrungen im Sicherheitsbereich </th><td style="font-size: 9px; font-weight: 400; padding: 5px; border-right: 5px solid white; background-color: white;">${data?.personal_information?.security_sector_experience ? 'Ja' : 'Nein'}</td></tr>
                <tr><th style="width: 50%; font-size: 9px; font-weight: 400; padding: 5px; border-right: 5px solid white; text-align: left; background-color: #f2f2f2;">Letztes Arbeitsverhältnis </th><td style="font-size: 9px; font-weight: 400; padding: 5px; border-right: 5px solid white; background-color: #f2f2f2;">${data?.personal_information?.last_employment}</td></tr>
                <tr><th style="width: 50%; font-size: 9px; font-weight: 400; padding: 5px; border-right: 5px solid white; text-align: left; background-color: white;">Aktuelles Arbeitsverhältnis </th><td style="font-size: 9px; font-weight: 400; padding: 5px; border-right: 5px solid white; background-color: white;">${data?.personal_information?.current_employment ? 'Ja' : 'Nein'}</td></tr>
            </table>
            <table class="equal-columns" style="background-color:white; margin-top: 20px; width: 100%;">
                <tr>
                    <td style="width: 60%; font-size: 9px; font-weight: 400; padding: 5px;">ja -> hiermit wird bestätigt, dass mir durchaus bewusst ist, dass die Maßnahme in Vollzeit stattfindet. Ich traue mir zu, dies parallel zu absolvieren.</td>
                </tr>
                <tr>
                    <div style="display: inline-block; flex-direction: column; padding-left: 20px;">
                        <img src="${data?.professional_information_applicant_signature1 || ''}" style="width: 100px; height: 50px;"/>
                        <h1 style="width: 100px;border-top: 2px solid black;text-align: center;padding-top: 5px; font-size: 9px; font-weight: 400;">Unterschrift Bewerber</h1>
                    </div>
                </tr>
            </table>
            <div style="width: 100%; display: flex; flex-direction: column; margin-bottom: 40px;">
                <h1 style="width: 100%; font-size: 9px; font-weight: 400;">Hiermit bestätige ich die Vollständigkeit und Richtigkeit der oben genannten Angaben und erkläre mich damit einverstanden, dass die BAD Bildungsakademie Deutschland GmbH, meine persönlichen Daten bis auf Wiederruf in Ihrem System speichern darf.</h1>
                <div style="width: 100%; display: flex; flex-direction: column; margin-top: 10px;">
                    <img src="${data?.professional_information_applicant_signature2 || ''}" style="width: 100px; height: 50px;"/>
                    <h1 style="width: 100px;border-top: 2px solid black;text-align: center;padding-top: 5px; font-size: 9px; font-weight: 400;">Unterschrift Bewerber</h1>
                </div>
            </div>
        </div>
        <div style="page-break-before: always;"></div>
        <table style="width: 100%; margin-top: 10px; border-collapse: collapse; width: 100%;">
        <tr>
            <th style="width: 50%; font-size: 11px; font-weight: 550; padding: 5px;  text-align: left; background-color: #f2f2f2;">Einschätzung Beratungsgespräch<br>(Maßnahmenziel erreichbar):</th>
            <td style="width: 50%; font-size: 9px; font-weight: 400; padding: 5px;  text-align: left; background-color: #f2f2f2;">${data?.assessment?.measure_target_achievable ? 'Ja' : 'Nein'}</td>
        </tr>
        <tr >
            <th style="width: 50%; font-size: 9px; font-weight: 400; padding: 5px;  text-align: left; background-color: white;">Name des Sachbearbeiters / Datum</th>
            <td style="width: 50%; font-size: 9px; font-weight: 400; padding: 5px;  text-align: left; background-color: white;">${data?.assessment?.clerk_name || ''} / ${data?.assessment?.clerk_date || ''}</td>
        </tr>
          
        </table>
    
        <div style="margin-top: 20px;">
            <h1 style="font-weight: 400; font-size: 9px; width: 50%;">Notizen/ Empfehlungen BAD Bildungsakademie Deutschland GmbH:</h1>
            <div style="min-height: 50px; text-align: start;border: 2px solid #f2f2f2;padding: 10px;padding-top: 2px;">
                <h1 style="font-weight: 400; font-size: 9px; width: 50%;">Führungszeugnis lag vor:</h1>
            </div>
            <div style="text-align: start;border: 2px solid #f2f2f2;padding: 10px;padding-top: 2px; margin-top: 10px;">
                <h1 style="font-weight: 400; font-size: 9px; width: 50%;">Führungszeugnis lag nicht vor:${data?.notes?.good_conduct_was_available || ''}</h1>
            </div>
            <h1 style="font-weight: 400; font-size: 9px; width: 50%;">Bemerkungen/ Notizen Sachbearbeiter vom Vorstellungsgespräch:</h1>
            <div style="font-weight: 400; font-size: 9px; min-height: 150px; text-align: start;border: 2px solid #f2f2f2;padding: 10px;padding-top: 2px;">
                ${data?.notes?.clerk_remarks || ''}
            </div>
        </div>
    
    </body>
    </html>`;

        const timestamp = Math.floor(Date.now() / 1000);
        const filename = `erfassungsbogen_${timestamp}.pdf`;
        const outputPath = path.join(__dirname, '../../uploads', filename);

        const file = {
            html: htmlContent,
            data: data,
            path: outputPath

        };

        const options = {
            format: "A4",
            orientation: "portrait",
            border: "10mm",
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



        // Ensure uploads directory exists
        const uploadsDir = path.dirname(outputPath);
        if (!fs.existsSync(uploadsDir)) {
            fs.mkdirSync(uploadsDir, { recursive: true });
        }
        pdf.create(file, options)
            .then(res => {
                console.log("PDF generated:", res.filename);
            })
            .catch(error => {
                console.error("Error generating PDF:", error);
            });




        return {
            filename,
            path: outputPath,
            url: `/uploads/${filename}`
        };

    }


    static addHeader(doc) {
        // Add logo
        doc.image('src/assets/logo.png', (doc.page.width - 100) / 2, 30, { width: 100 })
            .moveDown(4);

        // Add title
        doc.fillColor('black')
            .fontSize(16)
            .text('Eignungsfeststellung für die Weiterbildung', { align: 'center' })
            .moveDown(0.5)
            .fontSize(14)
            .text('IHK geprüfte Sicherheitsfachkraft gemäß §34a GewO Online', { align: 'center' })
            .moveDown(2);

        // Add subtitle
        doc.fontSize(14)
            .text('Hausordnung', { align: 'left' })
            .moveDown(0.5)
            .fontSize(12)
            .text('(Sorgfältig lesen)', { align: 'left' })
            .moveDown();

        // Add rules
        doc.fontSize(12);
        const rules = [
            {
                title: 'Ordnung:',
                text: 'In sämtlichen Räumen und Anlagen unserer Schule ist auf Ordnung und Sauberkeit zu achten. Schulräume, Einrichtungen und Anlagen sind sorgfältig zu benutzen. Außerhalb der Unterrichtszeiten dürfen sich Lernende nicht in den Klassenräumen aufhalten. Es ist untersagt, in den Klassenräumen etwas an die Wände zu kleben oder zu schreiben und Schulmöbel in andere Räume zu bringen. Mitarbeitende und Lernende, die Schäden feststellen, melden diese dem Sekretariat.'
            },
            {
                title: 'Alkohol- und Drogenkonsum:',
                text: 'Der Konsum von Alkohol, illegalen Drogen sowie anderen psychoaktiven Substanzen ist auf dem gesamten Schulareal und während schulischer Veranstaltungen (einschließlich aller Pausen) verboten. In Ausnahmefällen kann die Schulleitung den Konsum von Alkohol erlauben.'
            },
            {
                title: 'Diebstahl:',
                text: 'Es empfiehlt sich, Wertsachen und Bargeld sorgfältig aufzubewahren. Die Schule stellt den Lernenden und Mitarbeitenden kostenlos Schließfächer zur Verfügung. Für verlorene Schlüssel wird eine Gebühr von Euro 50,- erhoben. Die Schule übernimmt für Diebstähle keine Haftung.'
            },
            {
                title: 'Parkplätze:',
                text: 'Auf dem Schulareal stehen keine Gratis-Autoparkplätze zur Verfügung. Fahrräder müssen in den dafür vorgesehenen Fahrradkeller gebracht und abgeschlossen werden. Mopeds und Motorräder sind auf dem Schulareal nicht erlaubt.'
            }
        ];

        rules.forEach(rule => {
            doc.text(rule.title, { continued: true })
                .text(' ' + rule.text)
                .moveDown();
        });

        doc.moveDown()
            .text('Lesen Sie den Text und die Aufgaben 1 bis 4 dazu. Wählen Sie bei jeder Aufgabe die richtige Lösung: a, b oder c. Sie informieren sich über die Hausordnung der BAD Bildungsakademie Deutschland GmbH. Sie nehmen in deren Räumlichkeiten an einem Lehrgang teil.')
            .moveDown()
            .text('Jeweils eine Antwort ist richtig!', { align: 'left' })
            .moveDown();

        // Add legend
        doc.text('Legende:', { align: 'left' })
            .moveDown();

        // Draw legend boxes
        const boxWidth = 120;
        const boxHeight = 20;
        const startX = 50;
        const startY = doc.y;

        // Green box for 'richtig beantwortet'
        doc.rect(startX, startY, boxWidth, boxHeight)
            .fillAndStroke('#e8f5e9', '#000000');
        doc.fillColor('black')
            .text('richtig beantwortet', startX + 10, startY + 5);

        // Pink box for 'falsch beantwortet'
        doc.rect(startX + boxWidth + 10, startY, boxWidth, boxHeight)
            .fillAndStroke('#ffebee', '#000000');
        doc.fillColor('black')
            .text('falsch beantwortet', startX + boxWidth + 20, startY + 5);

        // White box with border for 'richtige Antwort'
        doc.rect(startX + (boxWidth + 10) * 2, startY, boxWidth, boxHeight)
            .stroke();
        doc.fillColor('black')
            .text('richtige Antwort', startX + (boxWidth + 10) * 2 + 10, startY + 5);

        doc.moveDown(2);
    }

    static addPersonalInfo(doc, data) {
        // Personal info is not needed in this design
        doc.moveDown(0.5);
    }

    static addAssessmentResults(doc, data) {
        const { first_name, last_name, responses } = data;

        // Add questions and answers
        if (responses && responses.length > 0) {
            // Add task number
            doc.fillColor('black').fontSize(16)
                .text(`Aufgabe ${responses[0].task_number || 1}`, { align: 'left' })
                .moveDown();

            // Add 'Aufgaben:' subtitle
            doc.fillColor('black').fontSize(14)
                .text('Aufgaben:', { underline: true, align: 'left' })
                .moveDown();

            responses.forEach((response, index) => {
                // Add question
                doc.fillColor('black')
                    .text(`${index + 1}. ${response.question}`, 50, doc.y)
                    .moveDown();

                // Add options
                const options = ['a', 'b', 'c'];
                options.forEach(option => {
                    const isSelected = response.selected_option === option;
                    const isCorrect = response.correct_option === option;

                    // Determine box color
                    let fillColor = null;
                    if (isSelected || isCorrect) {
                        fillColor = isCorrect ? '#e8f5e9' : '#ffebee';
                    }

                    // Add option text with proper indentation
                    doc.fontSize(12);
                    const startX = 50;
                    const startY = doc.y;
                    const boxWidth = doc.page.width - 100;
                    const boxHeight = 25;

                    if (fillColor) {
                        // Draw colored background
                        doc.rect(startX, startY, boxWidth, boxHeight)
                            .fillAndStroke(fillColor, fillColor);
                    }

                    // Add option text with black color
                    doc.fillColor('black')
                        .text(`${option}) ${response[`option_${option}`]}`, startX + 10, startY + 5)
                        .moveDown();

                    // Add border for correct answer if not selected
                    if (isCorrect && !isSelected) {
                        doc.rect(startX, startY, boxWidth, boxHeight)
                            .stroke('#000000');
                    }
                });

                doc.moveDown();
            });
        }

        // Add page number at the bottom
        // const pageNumber = doc.bufferedPageRange().start + 1;
        // doc.text(`Seite ${pageNumber} von ${doc.bufferedPageRange().count}`, 50, doc.page.height - 50, { align: 'center' });
    }

    static addFooter(doc, data) {
        const { signature_image } = data;
        doc.fontSize(10);

        // Add signature image if available
        if (signature_image) {
            const signatureY = doc.page.height - 100; // Position above page number
            const signatureWidth = 150; // Width of signature image
            const signatureX = doc.page.width - signatureWidth - 50; // Right-aligned with margin

            doc.image(signature_image, signatureX, signatureY, {
                width: signatureWidth,
                align: 'right'
            });
            doc.text('Unterschrift', signatureX, signatureY + 40, {
                width: signatureWidth,
                align: 'center'
            });
        }

        // Add page number
        // const pageNumber = doc.bufferedPageRange().start + 1;
        // doc.text(`Seite ${pageNumber} von ${doc.bufferedPageRange().count}`, 50, doc.page.height - 50, { align: 'center' });
    }
}

module.exports = PDFGenerator;
