const db = require('../config/database');

class SickLeave {
    static async getLeavesByMonth(studentId, month, year) {
        const connection = await db.getConnection();
        try {
            // Get current month's leaves
            const [results] = await connection.execute(
                `SELECT 
                    sl.*,
                    s.first_name, s.last_name, s.date_of_entry, s.date_of_exit,
                    s.measures,
                    a.name as authority_name, a.street as authority_address,
                    a.contact_person, a.bg_number,a.city,a.postal_code,
                    a.email as authority_email,
                    c.street_name as student_address,
                    c.street_number as student_street_number,
                    c.city as student_city,
                    c.postal_code as student_postal_code,
                    m.measures_number,
                    m.measures_title
                FROM student_sick_leave sl
                INNER JOIN student s ON sl.student_id = s.student_id
                LEFT JOIN authorities a ON s.student_id = a.student_id
                LEFT JOIN measurements m ON s.measures_id = m.id
                LEFT JOIN student_contact_details c ON s.student_id = c.student_id
                WHERE sl.student_id = ?
                AND MONTH(sl.date_from) = ?
                AND YEAR(sl.date_from) = ?
                ORDER BY sl.date_from DESC`,
                [studentId, month, year]
            );

            // Get total leaves from start of measurement
            const [totalLeaves] = await connection.execute(
                `SELECT 
                    COUNT(*) as total_count,
                    SUM(DATEDIFF(date_until, date_from) + 1) as total_days
                FROM student_sick_leave sl
                INNER JOIN student s ON sl.student_id = s.student_id
                WHERE sl.student_id = ?
                AND sl.date_from >= s.date_of_entry
                AND sl.date_from <= LAST_DAY(?)`,
                [studentId, `${year}-${month.toString().padStart(2, '0')}-01`]
            );

            if (results.length === 0) {
                return null;
            }

            // Get the first result to build student and authority info
            const firstResult = results[0];
            const daysInMonth = new Date(year, month, 0).getDate();
            const dailyLeaves = Array(daysInMonth).fill(null);

            // Process each leave record
            for (const leave of results) {
                const startDate = new Date(leave.date_from);
                const endDate = new Date(leave.date_until);

                // Fill in the status for each day between date_from and date_until
                for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
                    if (d.getMonth() + 1 === parseInt(month)) { // Only process days in the requested month
                        const dayIndex = d.getDate() - 1;
                        dailyLeaves[dayIndex] = {
                            status: leave.status,
                            description: leave.description
                        };
                    }
                }
            }
            // Format current month's leaves as a string
            const currentMonthLeaves = results.map(leave => {
                const dateFrom = new Date(leave.date_from).toISOString().split('T')[0];
                const dateUntil = new Date(leave.date_until).toISOString().split('T')[0];
                const dateRange = dateFrom === dateUntil ? dateFrom : `${dateFrom} - ${dateUntil}`;
                return `${dateRange} ${leave.status} ${leave.status == "E" ? "Excused" : leave.status == "UE" ? "Unexcused" : leave.status == "K" ? "Illness" : leave.status == "S" ? "Other" : ""}`;
            }).join(', ');

            return {
                month: new Date(year, month - 1).toLocaleString('de-DE', { month: 'long', year: 'numeric' }),
                days: dailyLeaves,
                currentMonthLeaves,
                totalLeaves: {
                    count: totalLeaves[0].total_count,
                    days: totalLeaves[0].total_days
                },
                student: {
                    id: firstResult.student_id,
                    first_name: firstResult.first_name,
                    last_name: firstResult.last_name,
                    date_of_entry: firstResult.date_of_entry,
                    date_of_exit: firstResult.date_of_exit,
                    measures: firstResult.measures,
                    measures_number: firstResult.measures_number,
                    measures_title: firstResult.measures_title,
                    address: {
                        street: firstResult.student_address,
                        street_number: firstResult.student_street_number,
                        city: firstResult.student_city,
                        postal_code: firstResult.student_postal_code
                    }
                },
                authority: {
                    bg_number: firstResult.bg_number,
                    name: firstResult.authority_name,
                    address: firstResult.authority_address,
                    contact_person: firstResult.contact_person,
                    city: firstResult.city,
                    zip: firstResult.postal_code,
                    email: firstResult.authority_email
                }
            };
        } catch (error) {
            throw error;
        } finally {
            connection.release();
        }
    }

    static async create(studentId, sickLeaveData) {
        const connection = await db.getConnection();
        try {
            await connection.beginTransaction();

            const [result] = await connection.execute(
                `INSERT INTO student_sick_leave (
                    student_id, date_from, date_until, status, description
                ) VALUES (?, ?, ?, ?, ?)`,
                [
                    studentId,
                    sickLeaveData.date_from,
                    sickLeaveData.date_until,
                    sickLeaveData.status,
                    sickLeaveData.description || null
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

    static async update(id, sickLeaveData) {
        const connection = await db.getConnection();
        try {
            await connection.beginTransaction();

            const updateFields = [];
            const updateValues = [];

            Object.entries(sickLeaveData).forEach(([key, value]) => {
                if (value !== undefined) {
                    updateFields.push(`${key} = ?`);
                    updateValues.push(value);
                }
            });

            if (updateFields.length > 0) {
                await connection.execute(
                    `UPDATE student_sick_leave SET ${updateFields.join(', ')} WHERE id = ?`,
                    [...updateValues, id]
                );
            }

            await connection.commit();
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }

    static async delete(id) {
        const connection = await db.getConnection();
        try {
            await connection.beginTransaction();
            await connection.execute('DELETE FROM student_sick_leave WHERE id = ?', [id]);
            await connection.commit();
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }

    static async getByStudentId(studentId) {
        const connection = await db.getConnection();
        try {
            const [sickLeaves] = await connection.execute(
                'SELECT * FROM student_sick_leave WHERE student_id = ? ORDER BY date_from DESC',
                [studentId]
            );
            return sickLeaves;
        } finally {
            connection.release();
        }
    }

    static async getById(id) {
        const connection = await db.getConnection();
        try {
            const [sickLeaves] = await connection.execute(
                'SELECT * FROM student_sick_leave WHERE id = ?',
                [id]
            );
            return sickLeaves[0];
        } finally {
            connection.release();
        }
    }
}

module.exports = SickLeave;
