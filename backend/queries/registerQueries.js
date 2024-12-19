const pool = require('../data/db');

const registerQueries = {
    // Register a new student
    registerStudent: async ({ usn, name, password, branch, section, semester }) => {
        const query = `
            INSERT INTO students (usn, name, password, branch, section, semester)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *;
        `;
        const values = [usn, name, password, branch, section, semester];
        const result = await pool.query(query, values);
        return result.rows[0];
    },

    // Check if a USN is already registered
    isUSNRegistered: async (usn) => {
        const query = 'SELECT COUNT(*) FROM students WHERE usn = $1';
        const values = [usn];
        const result = await pool.query(query, values);
        return parseInt(result.rows[0].count, 10) > 0;
    },
};

module.exports = registerQueries;
