const pool = require('../data/db');
const { logger } = require('../utils/logger');

/**
 * Adds a new attendance record for a student.
 * 
 * @param {number} studentId - The ID of the student.
 * @param {number} teacherId - The ID of the teacher.
 * @param {number} courseId - The ID of the section.
 * @param {number} sectionId - The ID of the course.
 * @param {string | Date} date - The date of the attendance session, either as a Date object or an ISO string.
 * @param {string} [status='absent'] - The attendance status, either 'present' or 'absent'. Defaults to 'absent'.
 * @param {boolean} [isManual=false] - Whether the attendance was manually marked. Defaults to false.
 * 
 * @returns {Promise<{
*   id: number,
*   student_id: number,
*   teacher_id: number,
*   section_id: number,
*   course_id: number,
*   date: string, 
*   status: string, 
*   is_manual: boolean, 
*   created_at: string,
*   updated_at: string
* }>} The newly inserted attendance record.
* 
* @throws {Error} If there is an error inserting the attendance record.
*/
exports.addAttendance = async (studentId, teacherId, sectionId, courseId, date, status = 'absent', isManual = false) => {
    const query = `
        INSERT INTO attendance (student_id, teacher_id, section_id, date, status, is_manual, course_id)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *;
    `;
    const values = [studentId, teacherId, sectionId, date, status, isManual, courseId];
    try {
        logger.debug('Adding attendance record:', values);
        const result = await pool.query(query, values);
        return result.rows[0];  // Return the first row (the inserted record)
    } catch (error) {
        logger.error('Error inserting attendance record:', error);
        throw error;
    }
};


/**
 * Retrieves an attendance summary for a specific teacher , for a specific section and for a specific course.
 * 
 * @param {number} teacherId - The ID of the teacher.
 * @param {number} sectionId - The ID of the section.
 * @param {number} courseId - The ID of the course.
 * 
 * @returns {Promise<{
*   attendance_date: string, 
*   present_count: number, 
*   absent_count: number, 
*   attendance_session_id: number,
*   teacher_name: string,
*   branch_name: string,
*   semester: number,
*   section: string 
*   course: sting
* }[]>} The attendance summary for the specified teacher and section, grouped by attendance session date.
* 
* @throws {Error} If there is an error fetching the attendance summary.
*/
exports.getAttendanceSummary = async (teacherId, sectionId, courseId) => {
    const query = `
        SELECT
            a.date AS attendance_date,
            COUNT(CASE WHEN a.status = 'present' THEN 1 END) AS present_count,
            COUNT(CASE WHEN a.status = 'absent' THEN 1 END) AS absent_count,
            a.section_id,
            t.name AS teacher_name,
            s.branch_name,
            s.semester,
            s.section,
            c.course_name
            a.id AS attendance_session_id
        FROM
            attendance a
        JOIN
            teachers t ON a.teacher_id = t.id
        JOIN
            sections s ON a.section_id = s.id
        JOIN
            courses c ON a.course_id = c.id
        WHERE
            a.teacher_id = $1
            AND a.section_id = $2
            AND a.course_id = $3
        GROUP BY
            a.date, a.section_id, t.name, s.branch_name, s.semester, s.section
        ORDER BY
            a.date;
    `;
    const values = [teacherId, sectionId, courseId];
    try {
        const result = await pool.query(query, values);
        logger.debug('Attendance summary fetched:', result.rows);
        return result.rows;  // Return all rows, not just the first one
    } catch (error) {
        logger.error('Error while fetching attendance summary:', error);
        throw error;
    }
};


/**
 * Retrieves an attendance report for a specific teacher, section, course, and date.
 * 
 * @param {number} teacherId - The ID of the teacher.
 * @param {number} sectionId - The ID of the section.
 * @param {number} courseId - The ID of the course.
 * @param {string} date - The date of the attendance session in ISO string format ('YYYY-MM-DDTHH:mm:ss.sssZ').
 * @returns {Promise<{ 
*   attendance_date: string, 
*   present_count: number, 
*   absent_count: number, 
*   attendance_date: string, 
*   teacher_name: string, 
*   section: string,
*   course: string,
*   branch_name: string, 
*   semester: number, 
*   attendance_details: Array<{ 
*     student_name: string, 
*     attendance_status: string, 
*     attendance_id: number 
*   }> 
* }>} The attendance report for the specified teacher, section, and date.
* 
* @throws {Error} If there is an error fetching the attendance report.
*/
exports.getAttendanceReportByHostForSection = async (teacherId, sectionId, courseId, date) => {
    const query = `
        SELECT
            s.name AS student_name,
            a.status AS attendance_status,
            a.date AS attendance_date,
            t.name AS teacher_name,
            sec.branch_name,
            sec.semester,
            sec.section,
            c.name AS course
            a.id AS attendance_id,
            COUNT(CASE WHEN a.status = 'present' THEN 1 END) AS present_count,
            COUNT(CASE WHEN a.status = 'absent' THEN 1 END) AS absent_count
        FROM
            attendance a
        JOIN
            students s ON a.student_id = s.id
        JOIN
            teachers t ON a.teacher_id = t.id
        JOIN
            sections sec ON a.section_id = sec.id
        JOIN
            courses c ON a.course_id = c.id
        WHERE
            a.teacher_id = $1
            AND a.section_id = $2
            AND a.course_id = $3
            AND a.date = $4
        GROUP BY
            s.name, a.status, a.date, t.name, sec.branch_name, sec.semester, sec.section, a.id
        ORDER BY
            s.usn;
    `;
    const values = [teacherId, sectionId,courseId ,date];
    try {
        const result = await pool.query(query, values);
        const attendanceDetails = result.rows;

        logger.debug('Attendance report fetched:', attendanceDetails);
        return {
            attendance_date: date,
            present_count: attendanceDetails[0]?.present_count || 0, // Get count from query result
            absent_count: attendanceDetails[0]?.absent_count || 0,   // Get count from query result
            teacher_name: attendanceDetails[0]?.teacher_name || '', // Get name from query result
            section: attendanceDetails[0]?.section || '', // Get section from query result
            course: attendanceDetails[0]?.course || '', // Get course from query result
            branch_name: attendanceDetails[0]?.branch_name || '', // Get branch from query result
            semester: attendanceDetails[0]?.semester || 0, // Get semester from query
            attendance_details: attendanceDetails.map((detail) => ({
                student_name: detail.student_name,
                attendance_status: detail.attendance_status,
                attendance_id: detail.attendance_id
            }))
        };
    } catch (error) {
        logger.error('Error while fetching attendance report:', error);
        throw error;
    }
};





/**
 * Retrieves recent attendance report by teacher for a specific section and course.
 * 
 * @param {number} teacherId - The ID of the teacher.
 * @param {number} sectionId - The ID of the section.
 * @param {number} courseId - The ID of the course.
 * @returns {Promise<{
*   attendance_date: string, 
*   present_count: number, 
*   absent_count: number, 
*   attendance_date: string, 
*   teacher_name: string, 
*   section: string,
*   course: string,
*   branch_name: string, 
*   semester: number, 
*   attendance_details: Array<{ 
*     student_name: string, 
*     attendance_status: string, 
*     attendance_id: number 
*   }>
* }>} The recent attendance report for the specified teacher and section.
* 
* @throws {Error} If there is an error fetching the attendance report.
*/
exports.getRecentAttendanceReport = async (teacherId, sectionId, courseId) => {
    const query = `
        SELECT
            a.date AS attendance_date,
            COUNT(CASE WHEN a.status = 'present' THEN 1 END) AS present_count,
            COUNT(CASE WHEN a.status = 'absent' THEN 1 END) AS absent_count,
            a.section_id,
            t.name AS teacher_name,
            s.branch_name,
            s.semester,
            s.section,
            a.id AS attendance_id,
            st.name AS student_name,
            a.status AS attendance_status
            c.name AS course
        FROM
            attendance a
        JOIN
            teachers t ON a.teacher_id = t.id
        JOIN
            sections s ON a.section_id = s.id
        JOIN
            students st ON a.student_id = st.id
        JOIN
            courses c ON a.course_id = c.id
        WHERE
            a.teacher_id = $1
            AND a.section_id = $2
            AND a.course_id = $3
        GROUP BY
            a.date, a.section_id, t.name, s.branch_name, s.semester, s.section, a.id, st.name, a.status
        ORDER BY
            a.date DESC
        LIMIT 1;
    `;
    const values = [teacherId, sectionId,courseId];

    try {
        const result = await pool.query(query, values);
        if (result.rows.length === 0) {
            logger.error("No attendance records found for the specified teacher and section.");
            throw new Error('No attendance records found for the specified teacher and section.');
        }

        const attendanceReport = result.rows[0]; // We are fetching only one record (most recent)
        const attendanceDetails = result.rows.map(row => ({
            student_name: row.student_name,
            attendance_status: row.attendance_status,
            attendance_date: row.attendance_date,
            teacher_name: row.teacher_name,
            branch_name: row.branch_name,
            semester: row.semester,
            section: row.section,
            attendance_id: row.attendance_id
        }));
        logger.debug('Recent attendance report fetched:', attendance)
        return {
            attendance_date: attendanceReport.attendance_date,
            present_count: attendanceReport.present_count,  // Directly from SQL result
            absent_count: attendanceReport.absent_count,    // Directly from SQL result
            attendance_details: attendanceDetails
        };
    } catch (error) {
        logger.error('Error while fetching recent attendance report:', error);
        throw error;
    }
};
