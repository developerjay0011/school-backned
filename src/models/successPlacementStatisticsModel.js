const db = require('../config/database');
const DateTimeUtils = require('../utils/dateTimeUtils');

class SuccessPlacementStatisticsModel {
    static async getAll() {
        try {
            const [rows] = await db.query(
                `SELECT s.*, m.measures_number, m.measures_title 
                FROM success_placement_statistics s
                JOIN measurements m ON s.measures_id = m.id 
                ORDER BY s.created_at DESC`
            );
            return rows;
        } catch (error) {
            throw error;
        }
    }


    static async create(data) {
        try {
            const [result] = await db.query(
                `INSERT INTO success_placement_statistics 
                (year, measures_id, pdf_url, description, created_at) 
                VALUES (?, ?, ?, ?, ?)`,
                [data.year, data.measures_id, data.pdf_url, data.description || null,DateTimeUtils.formatToSQLDateTime(DateTimeUtils.getBerlinDateTime())]
            );
            return result.insertId;
        } catch (error) {
            throw error;
        }
    }

    static async getAll() {
        try {
            const [rows] = await db.query(
                `SELECT sps.*, m.measures_number, m.measures_title 
                FROM success_placement_statistics sps 
                JOIN measurements m ON sps.measures_id = m.id 
                ORDER BY sps.created_at DESC`
            );
            return rows;
        } catch (error) {
            throw error;
        }
    }

    static async getById(id) {
        try {
            const [rows] = await db.query(
                `SELECT sps.*, m.measures_number, m.measures_title 
                FROM success_placement_statistics sps 
                JOIN measurements m ON sps.measures_id = m.id 
                WHERE sps.id = ?`,
                [id]
            );
            return rows[0];
        } catch (error) {
            throw error;
        }
    }

    static async deleteById(id) {
        try {
            const [result] = await db.query(
                'DELETE FROM success_placement_statistics WHERE id = ?',
                [id]
            );
            return result.affectedRows > 0;
        } catch (error) {
            throw error;
        }
    }

    static async getStatisticsData(measureId, year) {
        try {
            console.log('Getting stats for:', { measureId, year });

            // Debug query to check student data
            const [studentCheck] = await db.query(
                `SELECT s.student_id, s.date_of_entry, s.date_of_exit, s.measures_id 
                FROM student s 
                WHERE s.measures_id = ?`,
                [measureId]
            );
            console.log('Students found:', studentCheck);

            // Debug query to check measures
            const [measuresCheck] = await db.query(
                `SELECT DISTINCT measures_id FROM student`
            );
            console.log('Available measure IDs:', measuresCheck);
            // Get quarterly data
            const quarterlyQuery = `SELECT 
                    DATE_FORMAT(s.date_of_entry, '%d.%m') as start_date,
                    DATE_FORMAT(s.date_of_exit, '%d.%m') as end_date,
                    COUNT(DISTINCT s.student_id) as total_students,
                    COALESCE(SUM(CASE WHEN EXISTS (SELECT 1 FROM student_reports sr WHERE sr.student_id = s.student_id AND sr.report_type IN ('termination', 'discharge')) THEN 1 ELSE 0 END), 0) as dropouts,
                    COALESCE(SUM(CASE WHEN EXISTS (SELECT 1 FROM student_exam_dates sed WHERE sed.student_id = s.student_id AND sed.exam_type LIKE '%34a%') THEN 1 ELSE 0 END), 0) as exam_taken,
                    COALESCE(SUM(CASE WHEN EXISTS (SELECT 1 FROM student_exam_dates sed WHERE sed.student_id = s.student_id AND sed.exam_type LIKE '%34a%' AND sed.exam_result = 'pass') THEN 1 ELSE 0 END), 0) as exam_passed,
                    IF(COALESCE(SUM(CASE WHEN EXISTS (SELECT 1 FROM student_exam_dates sed WHERE sed.student_id = s.student_id AND sed.exam_type LIKE '%34a%') THEN 1 ELSE 0 END), 0) > 0,
                        (COALESCE(SUM(CASE WHEN EXISTS (SELECT 1 FROM student_exam_dates sed WHERE sed.student_id = s.student_id AND sed.exam_type LIKE '%34a%' AND sed.exam_result = 'pass') THEN 1 ELSE 0 END), 0) /
                        COALESCE(SUM(CASE WHEN EXISTS (SELECT 1 FROM student_exam_dates sed WHERE sed.student_id = s.student_id AND sed.exam_type LIKE '%34a%') THEN 1 ELSE 0 END), 0)) * 100,
                        0
                    ) as success_rate,
                    COALESCE(SUM(CASE WHEN ss.surveyed_after_6_months = 1 THEN 1 ELSE 0 END), 0) as surveyed_count,
                    COALESCE(SUM(CASE WHEN ss.surveyed_after_6_months = 1 AND ss.mediated = 1 THEN 1 ELSE 0 END), 0) as employed_count
                FROM student s
                LEFT JOIN student_settings ss ON s.student_id = ss.student_id
                WHERE s.measures_id = ? 
                AND YEAR(s.date_of_entry) = ?
                GROUP BY s.date_of_entry, s.date_of_exit
                ORDER BY s.date_of_entry`;
            console.log('Quarterly Query:', quarterlyQuery);
            const [rows] = await db.query(quarterlyQuery, [measureId, year]);
            console.log('Quarterly Results:', rows);

            // Calculate totals
            const [totals] = await db.query(
                `SELECT 
                    COUNT(DISTINCT s.student_id) as total_students,
                    COALESCE(SUM(CASE WHEN EXISTS (SELECT 1 FROM student_reports sr WHERE sr.student_id = s.student_id AND sr.report_type IN ('termination', 'discharge')) THEN 1 ELSE 0 END), 0) as dropouts,
                    COALESCE(SUM(CASE WHEN EXISTS (SELECT 1 FROM student_exam_dates sed WHERE sed.student_id = s.student_id AND sed.exam_type LIKE '%34a%') THEN 1 ELSE 0 END), 0) as exam_taken,
                    COALESCE(SUM(CASE WHEN EXISTS (SELECT 1 FROM student_exam_dates sed WHERE sed.student_id = s.student_id AND sed.exam_type LIKE '%34a%' AND sed.exam_result = 'pass') THEN 1 ELSE 0 END), 0) as exam_passed,
                    COALESCE(SUM(CASE WHEN ss.surveyed_after_6_months = 1 THEN 1 ELSE 0 END), 0) as surveyed_count,
                    COALESCE(SUM(CASE WHEN ss.surveyed_after_6_months = 1 AND ss.mediated = 1 THEN 1 ELSE 0 END), 0) as employed_count,
                    IF(COUNT(DISTINCT s.student_id) > 0, (COALESCE(SUM(CASE WHEN EXISTS (SELECT 1 FROM student_reports sr WHERE sr.student_id = s.student_id AND sr.report_type IN ('termination', 'discharge')) THEN 1 ELSE 0 END), 0) / COUNT(DISTINCT s.student_id)) * 100, 0) as dropout_percentage,
                    IF(COALESCE(SUM(CASE WHEN ss.surveyed_after_6_months = 1 THEN 1 ELSE 0 END), 0) > 0, (COALESCE(SUM(CASE WHEN ss.surveyed_after_6_months = 1 AND ss.mediated = 1 THEN 1 ELSE 0 END), 0) / COALESCE(SUM(CASE WHEN ss.surveyed_after_6_months = 1 THEN 1 ELSE 0 END), 0)) * 100, 0) as placement_rate
                FROM student s
                LEFT JOIN student_settings ss ON s.student_id = ss.student_id
                WHERE s.measures_id = ? 
                AND YEAR(s.date_of_entry) = ?`,
                [measureId, year]
            );

            return {
                quarterlyData: rows.map(row => ({
                    ...row,
                    dropout_percentage: row.total_students > 0 ? ((row.dropouts / row.total_students) * 100).toFixed(2) : '0.00',
                    success_rate: row.exam_taken > 0 ? ((row.exam_passed / row.exam_taken) * 100).toFixed(2) : '0.00',
                    placement_rate: row.surveyed_count > 0 ? ((row.employed_count / row.surveyed_count) * 100).toFixed(2) : '0.00'
                })),
                totals: {
                    ...totals[0],
                    dropout_percentage: totals[0].total_students > 0 ? ((totals[0].dropouts / totals[0].total_students) * 100).toFixed(2) : '0.00',
                    success_rate: totals[0].exam_taken > 0 ? ((totals[0].exam_passed / totals[0].exam_taken) * 100).toFixed(2) : '0.00',
                    placement_rate: totals[0].surveyed_count > 0 ? ((totals[0].employed_count / totals[0].surveyed_count) * 100).toFixed(2) : '0.00'
                }
            };
        } catch (error) {
            throw error;
        }
    }
}

module.exports = SuccessPlacementStatisticsModel;
