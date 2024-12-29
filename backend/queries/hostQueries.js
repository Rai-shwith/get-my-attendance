
const { pool } = require('../config/db');
const AppError = require('../utils/AppError');
const { hashPassword } = require('../utils/helpers');
const { logger } = require('../utils/logger');
const { getDepartmentIdByName } = require('./branchQueries');

/**
 * Register host or teacher
 * 
 * @param {string} name - The name of the teacher.
 * @param {string} email - The email address of the teacher.
 * @param {string} password - The plain text password of the teacher.
 * @param {number} department - The department name.
 * @returns {Promise<object>} The newly created teacher's details.
 * @throws {Error} If the teacher could not be registered.
 */
exports.registerTeacher = async (name, email, password,department) => {

    const departmentId = await getDepartmentIdByName(department);

    const query = `
        INSERT INTO teachers (name, email, password, department_id, created_at, updated_at)
        VALUES ($1, $2, $3, $4, NOW(), NOW())
        RETURNING id, name, email, created_at, updated_at;
    `;

    try {
        // Hash the password before storing it
        const hashedPassword = await hashPassword(password);

        const values = [name, email, hashedPassword, departmentId];
        const result = await pool.query(query, values);

        const newTeacher = result.rows[0];

        // Log success
        logger.info(
            `New teacher registered: ${newTeacher.name} (ID: ${newTeacher.id}, Email: ${newTeacher.email})`
        );

        return newTeacher;
    } catch (error) {
        
        if (error.code === '23505') {
            // Handle unique constraint violation
            logger.error(`Unique constraint violation: ${error.message}`);
            throw new AppError(40901);
        } else {
            // Handle other errors
            logger.error(`Error registering teacher: ${error.message}`);
            throw new AppError(50002);
        }  
      }
};

/**
 * Assign sections to a teacher.
 *
 * @param {number} teacherId - The ID of the teacher.
 * @param {Array<{sectionId: number, academicYear: number}>} sections - Array of section objects with IDs and academic years.
 * @returns {Promise<string>} Success message.
 */
exports.assignTeacherToSections = async (teacherId, sections) => {
    const query = `
        INSERT INTO teacher_sections (teacher_id, section_id, academic_year)
        VALUES ($1, $2, $3)
        ON CONFLICT (teacher_id, section_id) DO NOTHING;
    `;

    try {
        const client = await pool.connect();
        await client.query('BEGIN');

        for (const { sectionId, academicYear } of sections) {
            await client.query(query, [teacherId, sectionId, academicYear]);
        }

        await client.query('COMMIT');
        client.release();

        logger.info(`Assigned sections to teacher ${teacherId}.`);
        return 'Sections assigned successfully.';
    } catch (error) {
        logger.error(`Error assigning sections to teacher ${teacherId}: ${error.message}`);
        throw new Error('Failed to assign sections to the teacher.');
    }
};

// avoids manually link courses to sections
/**
 * Assign courses to a teacher via sections.
 *
 * @param {number} teacherId - The ID of the teacher.
 * @param {Array<number>} courseIds - Array of course IDs to assign.
 * @returns {Promise<string>} Success message.
 */
exports.assignTeacherToCourses = async (teacherId, courseIds) => {
    const query = `
        INSERT INTO section_courses (section_id, course_id)
        SELECT ts.section_id, c.id
        FROM teacher_sections ts
        JOIN courses c ON c.id = ANY($2::int[])
        WHERE ts.teacher_id = $1
        ON CONFLICT DO NOTHING;
    `;

    try {
        await pool.query(query, [teacherId, courseIds]);
        logger.info(`Assigned courses ${courseIds.join(', ')} to teacher ${teacherId}.`);
        return 'Courses assigned successfully.';
    } catch (error) {
        logger.error(`Error assigning courses to teacher ${teacherId}: ${error.message}`);
        throw new Error('Failed to assign courses to the teacher.');
    }
};




/**
 * Get all courses assigned to a teacher.
 *
 * @param {number} teacherId - The ID of the teacher.
 * @returns {Promise<Array<{courseId: number, courseName: string, sectionId: number}>>} List of courses.
 */
exports.getCoursesForTeacher = async (teacherId) => {
    const query = `
        SELECT 
            c.id AS course_id,
            c.name AS course_name,
            c.title AS  course_title,
            d.name AS department
            ts.section_id
        FROM teacher_sections ts
        JOIN section_courses sc ON ts.section_id = sc.section_id
        JOIN courses c ON sc.course_id = c.id
        JOIN departments d ON c.department_id = d.id
        WHERE ts.teacher_id = $1;
    `;

    try {
        const result = await pool.query(query, [teacherId]);
        return result.rows;
    } catch (error) {
        logger.error(`Error fetching courses for teacher ${teacherId}: ${error.message}`);
        throw new Error('Failed to fetch courses for the teacher.');
    }
};
