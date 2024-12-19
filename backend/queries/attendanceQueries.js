const pool = require('../data/db');

const attendanceQueries = {
    // Fetch attendance for a student
    getAttendanceByStudentId: async (studentId) => {
        const query = 'SELECT * FROM attendance WHERE student_id = $1';
        const values = [studentId];
        const result = await pool.query(query, values);
        return result.rows;
    },

    // Add attendance record
    addAttendance: async ({ studentId, teacherId, date, status, isManual }) => {
        const query = `
            INSERT INTO attendance (student_id, teacher_id, date, status, isManual)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *;
        `;
        const values = [studentId, teacherId, date, status, isManual];
        const result = await pool.query(query, values);
        return result.rows[0];
    },
};

module.exports = attendanceQueries;
