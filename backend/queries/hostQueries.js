const pool = require('../data/db');

const hostQueries = {
    // Fetch all sections assigned to a teacher
    getSectionsByTeacherId: async (teacherId) => {
        const query = `
            SELECT s.*
            FROM sections s
            JOIN teacher_sections ts ON s.id = ts.section_id
            WHERE ts.teacher_id = $1;
        `;
        const values = [teacherId];
        const result = await pool.query(query, values);
        return result.rows;
    },

    // Add a section to a teacher
    addSectionToTeacher: async (teacherId, sectionId) => {
        const query = `
            INSERT INTO teacher_sections (teacher_id, section_id)
            VALUES ($1, $2)
            RETURNING *;
        `;
        const values = [teacherId, sectionId];
        const result = await pool.query(query, values);
        return result.rows[0];
    },
};

module.exports = hostQueries;
