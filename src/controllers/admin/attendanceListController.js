const AttendanceList = require('../../models/attendanceListModel');
const PDFGenerator = require('../../utils/pdfGenerator');
const AttendanceModel = require('../../models/attendanceModel');

class AttendanceListController {
    static async generateList(req, res) {
        const { start_date, end_date, student_id } = req.body;

        try {
            // Validate dates
            const startDate = new Date(start_date);
            const endDate = new Date(end_date);

            if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
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
                datetime: new Date(),
                start_date: startDate,
                end_date: endDate,
                student_id,
                pdf_url: pdfResult.url
            };

            await AttendanceList.create(attendanceData);

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
