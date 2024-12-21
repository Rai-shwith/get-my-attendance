const pool = require('../data/db');
const { logger } = require('../utils/logger');

const { pool } = require('../db'); // Assuming you're using a pooled DB connection
const { logger } = require('../utils/logger');

/**
 * Add a new section to the database.
 * 
 * @param {string} branchName - The name of the branch (e.g., "Electronics and Communication").
 * @param {number} semester - The semester of the section (e.g., 3).
 * @param {string} section - The section identifier (e.g., "A").
 * @param {number} academicYear - The academic year for the section (e.g., 2023)[NOTE: If academic year is 2023-24 , then it will be 2023 in the database].
 * @returns {Promise<object>} - Returns the newly created section or an error message.
 */
exports.addSection = async (branchName, semester, section, academicYear) => {
    const query = `
        INSERT INTO sections (branch_name, semester, section, academic_year)
        VALUES ($1, $2, $3, $4)
        RETURNING *;
    `;
    const values = [branchName, semester, section, academicYear];

    try {
        logger.debug('Attempting to add a new section to the database.');
        const result = await pool.query(query, values);
        logger.info(`Section added successfully: ${JSON.stringify(result.rows[0])}`);
        return result.rows[0];
    } catch (error) {
        if (error.code === '23505') { // Unique constraint violation
            logger.error('Section already exists for the given branch, semester, and year.');
            throw new Error('Section already exists for the given branch, semester, and year.');
        }
        logger.error(`Error adding section: ${error.message}`);
        throw new Error('Failed to add section. Please try again later.');
    }
};

const { pool } = require('../db'); // Assuming you're using a pooled DB connection
const { logger } = require('../utils/logger');

/**
 * Add a new course to the database.
 * 
 * @param {string} name - The name of the course (e.g., "MAE11").
 * @param {string} description - The description of the course (e.g., "Mechanical Engineering Basics").
 * @returns {Promise<object>} - Returns the newly created course or an error message.
 */
exports.addCourse = async (name, description = null) => {
    const query = `
        INSERT INTO courses (name, description)
        VALUES ($1, $2)
        RETURNING *;
    `;
    const values = [name, description];

    try {
        logger.debug('Attempting to add a new course to the database.');
        const result = await pool.query(query, values);
        logger.info(`Course added successfully: ${JSON.stringify(result.rows[0])}`);
        return result.rows[0];
    } catch (error) {
        if (error.code === '23505') { // Unique constraint violation (if added for course name)
            logger.error('Course already exists with the given name.');
            throw new Error('Course already exists with the given name.');
        }
        logger.error(`Error adding course: ${error.message}`);
        throw new Error('Failed to add course. Please try again later.');
    }
};



/**
 * Add a course to a section.
 *
 * @param {number} sectionId - The ID of the section.
 * @param {number} courseId - The ID of the course.
 * @returns {Object} - Returns an object containing success or error details.
 */
exports.addSectionCourse = async (sectionId, courseId) => {
    try {
        // Validate inputs
        if (!sectionId || !courseId) {
            logger.error("Invalid input: Section ID and Course ID are required.");
            throw new Error("Section ID and Course ID are required.");
        }

        // SQL query to insert a section-course mapping
        const query = `
            INSERT INTO section_courses (section_id, course_id)
            VALUES ($1, $2)
            ON CONFLICT DO NOTHING;
        `;

        // Execute the query using the pool
        await pool.query(query, [sectionId, courseId]);

        logger.info(`Successfully added course ${courseId} to section ${sectionId}.`);
        return { success: true, message: "Course successfully added to the section." };
    } catch (error) {
        logger.error(`Error adding course to section: ${error.message}`);
        return { success: false, error: error.message };
    }
};

/**
 * Assign courses to sections.
 *
 * @param {Array<{sectionId: number, courseId: number}>} sectionCourses - Array of section-course pairs.
 * @returns {Promise<string>} Success message.
 */
exports.assignCoursesToSections = async (sectionCourses) => {
    const query = `
        INSERT INTO section_courses (section_id, course_id)
        VALUES ($1, $2)
        ON CONFLICT DO NOTHING;
    `;

    try {
        const client = await pool.connect();
        await client.query('BEGIN');

        for (const { sectionId, courseId } of sectionCourses) {
            await client.query(query, [sectionId, courseId]);
        }

        await client.query('COMMIT');
        client.release();

        return 'Courses assigned to sections successfully.';
    } catch (error) {
        logger.error(`Error assigning courses to sections: ${error.message}`);
        throw new Error('Failed to assign courses to sections.');
    }
};
