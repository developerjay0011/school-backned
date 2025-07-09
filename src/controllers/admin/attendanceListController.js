const AttendanceList = require('../../models/attendanceListModel');
const PDFGenerator = require('../../utils/pdfGenerator');
const AttendanceModel = require('../../models/attendanceModel');
const EmailService = require('../../utils/emailService');
const DateTimeUtils = require('../../utils/dateTimeUtils');

class AttendanceListController {
    static async generateList(req, res) {
        const { start_date, end_date, student_id } = req.body;

        try {
            // Validate dates
            const startDate = DateTimeUtils.parseToDateTime(start_date);
            const endDate = DateTimeUtils.parseToDateTime(end_date);

            if (!startDate.isValid || !endDate.isValid) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid date format. Please use YYYY-MM-DD format'
                });
            }

            if (endDate < startDate) {
                return res.status(400).json({
                    success: false,
                    message: 'End date cannot be before start date'
                });
            }
            const attendanceList = await AttendanceModel.getAttendanceList(
                start_date,
                end_date,
                student_id
            );
            console.log("Attendance List", {
                start_date: startDate,
                end_date: endDate,
                ...attendanceList
            })
            // Generate PDF
            const pdfResult = await PDFGenerator.generateAttendancePDF(
               {data: attendanceList, start_date, end_date}
            );

            // Store in database
            const attendanceData = {
                datetime: DateTimeUtils.formatToSQLDateTime(DateTimeUtils.getBerlinDateTime()),
                start_date: DateTimeUtils.formatToSQLDate(startDate),
                end_date: DateTimeUtils.formatToSQLDate(endDate),
                student_id,
                pdf_url: pdfResult.url
            };
            console.log("Attendance Data", attendanceData)
            await AttendanceList.create(attendanceData);

            // Send email to authority
            // Get the first attendance record for student details
            const studentRecord = attendanceList.length > 0 ? attendanceList[0] : null;
            console.log("Student Record", studentRecord);
            
            if (studentRecord && studentRecord.authority_email) {
                console.log("Authority Email", studentRecord.authority_email);
                await EmailService.sendAttendanceListEmail({
                    email: studentRecord.authority_email,
                    bgNumber: studentRecord.bg_number,
                    studentName: `${studentRecord.first_name} ${studentRecord.last_name}`,
                    startDate: start_date,
                    endDate: end_date,
                    measureNumber: studentRecord.measures_number,
                    measureTitle: studentRecord.measures_title,
                    pdfPath: pdfResult.path
                });
            }

            res.status(200).json({
                success: true,
                message: 'Attendance list generated successfully',
                data: attendanceData
            });
        } catch (error) {
            console.error('Error generating attendance list:', error);
            res.status(500).json({
                success: false,
                message: 'Error generating attendance list',
                error: error.message
            });
        }
    }

    static async getAll(req, res) {
        const { student_id } = req.query;

        try {
            let lists;
            if (student_id) {
                lists = await AttendanceList.getByStudentId(student_id);
            } else {
                lists = await AttendanceList.getAll();
            }
            
            res.status(200).json({
                success: true,
                message: lists.length > 0 ? 'Attendance lists retrieved successfully' : 'No attendance lists found',
                data: lists
            });
        } catch (error) {
            console.error('Error retrieving attendance lists:', error);
            res.status(500).json({
                success: false,
                message: 'Error retrieving attendance lists',
                error: error.message
            });
        }
    }
}

module.exports = AttendanceListController;
