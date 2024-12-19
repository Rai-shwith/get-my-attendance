const pool = require('../data/db');

const studentQueries = {
    // Get student profile by ID
    getStudentById: async (id) => {
        const query = 'SELECT * FROM students WHERE id = $1';
        const values = [id];
        const result = await pool.query(query, values);
        return result.rows[0];
    },

    // Update a student's password
    updatePassword: async (id, newPassword) => {
        const query = `
            UPDATE students
            SET password = $1
            WHERE id = $2
            RETURNING *;
        `;
        const values = [newPassword, id];
        const result = await pool.query(query, values);
        return result.rows[0];
    },
};

module.exports = studentQueries;
