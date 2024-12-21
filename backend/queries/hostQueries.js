const pool = require('../data/db');

/**
 * Register host or teacher
 * 
 * @param {string} name - The name of the teacher.
 * @param {string} email - The email address of the teacher.
 * @param {string} password - The plain text password of the teacher.
 * @returns {Promise<object>} The newly created teacher's details.
 * @throws {Error} If the teacher could not be registered.
 */
exports.registerTeacher = async (name, email, password) => {
    const query = `
        INSERT INTO teachers (name, email, password, created_at, updated_at)
        VALUES ($1, $2, $3, NOW(), NOW())
        RETURNING id, name, email, created_at, updated_at;
    `;

    try {
        // Hash the password before storing it
        const hashedPassword = await bcrypt.hash(password, 10);

        const values = [name, email, hashedPassword];
        const result = await pool.query(query, values);

        const newTeacher = result.rows[0];

        // Log success
        logger.info(
            `New teacher registered: ${newTeacher.name} (ID: ${newTeacher.id}, Email: ${newTeacher.email})`
        );

        return newTeacher;
    } catch (error) {
        // Log error
        logger.error(
            `Error registering teacher with email: ${email}. Error: ${error.message}`
        );
        throw new Error('Error registering the teacher. Please try again.');
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
            ts.section_id
        FROM teacher_sections ts
        JOIN section_courses sc ON ts.section_id = sc.section_id
        JOIN courses c ON sc.course_id = c.id
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
