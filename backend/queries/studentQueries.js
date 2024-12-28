const pool = require('../data/db');
const { logger } = require('../utils/logger');
const crypto = require('crypto');

/**
 * Register a new student.
 * 
 * @param {string} sessionKey - Unique key to store in JWT tokens
 *@param {string} name - The name of the student.
 *@param {string} usn - The USN of the student.
 *@param {string} section - The section of the student.
 *@param {number} departmentId - The department ID of the student.
* @param {number} semester - The semester of the student.
* @param {number} year - The academic year of the student.
* @param {string} email - The email of the student.
* @param {string} password - The password of the student.
* @param {number} registered_under - The ID of the teacher who registered the student.
* @param {string} mac_address - The mac_address of the student.[OPTIONAL]
*/
exports.registerStudent = async (name, usn, section, departmentId, semester, year, email, password,registered_under, mac_address = null,sessionKey) => {
    logger.debug(`Attempting to register student: ${name}, USN: ${usn}`);

    // Find the section ID based on the provided section, departmentId, semester, and year
    const sectionQuery = `
        SELECT id FROM sections
        WHERE department_id = $1
        AND semester = $2
        AND section = $3
        AND academic_year = $4;
    `;
    
    const sectionValues = [departmentId, semester, section, year];
    
    try {
        // Logging the section search process
        logger.debug(`Searching for section with values: ${sectionValues}`);

        const sectionResult = await pool.query(sectionQuery, sectionValues);
        
        if (sectionResult.rows.length === 0) {
            logger.warn(`No section found with branch: ${branch}, semester: ${semester}, section: ${section}, year: ${year}`);
            throw new Error('Section not found.');
        }

        const sectionId = sectionResult.rows[0].id;
        logger.info(`Section found with ID: ${sectionId}`);

        // Generate a new session key
        const sessionKey = crypto.randomBytes(16).toString('hex');

        // Insert the new student into the "students" table
        const query = `
            INSERT INTO students (name, usn, password, mac_address, email, section_id, academic_year, registered_under, session_key)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
            RETURNING session_key, name, usn, email, section_id, academic_year, created_at;
        `;
        
        const values = [name, usn, password, mac_address, email, sectionId, year, registered_under,sessionKey];
        
        logger.debug(`Inserting new student with data: ${values}`);
        
        const result = await pool.query(query, values);
        const newStudent = result.rows[0];

        logger.info(`Student registered successfully: ${newStudent.usn} - ${newStudent.name}`);
        
        return newStudent;
    } catch (error) {
        // Log the error with stack trace and detail
        logger.error(`Error registering student: ${error.message}`, { stack: error.stack });
        throw error;
    }
};

/**
 * Get a student by their sessionKey.
 * 
 * @param {number} studentId - The primary key sessionKey of the student in the database.
 * @returns {Promise<{
*   id: number,
*   name: string,
*   usn: string,
*   password: string,
*   mac_address: string | null,
*   email: string,
*   section_id: number | null,
*   department_id: number | null,
*   academic_year: number | null,
*   registered_under: string | null,
*   created_at: string,
*   updated_at: string
* }>} The student details if found.
* 
* @throws {Error} Throws an error if the student is not found or if there's a database issue.
*/
exports.getStudentBySessionKey = async (studentId) => {
   const query = 'SELECT * FROM students WHERE id = $1';

   try {
       // Log the query execution
       logger.debug(`Executing query to fetch student by sessionKey: ${studentId}`);

       const result = await pool.query(query, [studentId]);

       if (result.rows.length === 0) {
           // Log the absence of the student
           logger.info(`No student found with sessionKey: ${studentId}`);
           throw new Error(`Student with sessionKey ${studentId} not found.`);
       }

       const student = result.rows[0];

       // Log successful retrieval of the student
       logger.info(`Student with sessionKey ${studentId} retrieved successfully.`);

       return student;
   } catch (error) {
       // Log the error
       logger.error('Error while fetching student by sessionKey', {
           studentId,
           stack: error.stack,
       });
       throw error;
   }
};


/**
 * Get a student by their USN
 * 
 * @param {number} studentUSN - The USN of the student in the database.
 * @returns {Promise<{
*   id: number,
*   name: string,
*   usn: string,
*   password: string,
*   mac_address: string | null,
*   email: string,
*   section_id: number | null,
*   department_id: number | null,
*   academic_year: number | null,
*   registered_under: string | null,
*   created_at: string,
*   updated_at: string
* }>} The student details if found.
* 
* @throws {Error} Throws an error if the student is not found or if there's a database issue.
*/
exports.getStudentByUSN = async (studentUSN) => {
   const query = 'SELECT * FROM students WHERE usn = $1';

   try {
       // Log the query execution
       logger.debug(`Executing query to fetch student by USN: ${studentUSN}`);

       const result = await pool.query(query, [studentUSN]);

       if (result.rows.length === 0) {
           // Log the absence of the student
           logger.info(`No student found with USN: ${studentUSN}`);
           throw new Error(`Student with USN ${studentUSN} not found.`);
       }

       const student = result.rows[0];

       // Log successful retrieval of the student
       logger.info(`Student with USN ${studentUSN} retrieved successfully.`);

       return student;
   } catch (error) {
       // Log the error
       logger.error('Error while fetching student by USN', {
           studentUSN,
           stack: error.stack,
       });
       throw error;
   }
};

/**
 * Retrieve all students registered by a specific host (teacher) on a particular date.
 * 
 * @param {number} hostId - The ID of the host (teacher) who registered the students.
 * @param {string} registrationDate - The registration date in 'YYYY-MM-DD' format.
 * @returns {Promise<Array<{ 
*   id: number, 
*   name: string, 
*   usn: string, 
*   email: string, 
*   mac_address: string | null, 
*   section_id: number, 
*   department_id: number | null,
*   academic_year: number, 
*   created_at: string, 
*   updated_at: string 
* }>>} - A promise that resolves to an array of student objects.
*/
exports.getStudentsByRegistrationDate = async (hostId, registrationDate) => {
   const query = `
       SELECT 
           s.id,
           s.name,
           s.usn,
           s.email,
           s.mac_address,
           s.section_id,
           s.academic_year,
           s.created_at,
           s.updated_at
       FROM students s
       WHERE s.registered_by = $1
       AND DATE(s.created_at) = $2
       ORDER BY s.created_at DESC;
   `;
   const values = [hostId, registrationDate];

   try {
       const result = await pool.query(query, values);
       return result.rows; // Return the array of student details
   } catch (error) {
       console.error("Error while fetching students by registration date:", error);
       throw error;
   }
};

/**
 * Update the student's MAC address.
 * 
 * @param {string} sessionKey - The session key associated with the student.
 * @param {string} macAddress - The new MAC address to update.
 * @throws {Error} If the session key is invalid or the MAC address update fails.
 */
exports.updateStudentMacAddress = async (sessionKey, macAddress) => {
    const query = `
        UPDATE students
        SET mac_address = $1, updated_at = NOW()
        WHERE session_key = $2
        RETURNING id, name, usn, email, mac_address, section_id, academic_year, updated_at;
    `;
    const values = [macAddress, sessionKey];

    try {
        const result = await pool.query(query, values);

        if (result.rows.length === 0) {
            throw new Error("Student with the provided session key not found.");
        }

        // Logging success
        logger.info(
            `MAC address updated for student with session key: ${sessionKey}. New MAC address: ${macAddress}`
        );

        return result.rows[0]; // Return the updated student details
    } catch (error) {
        // Logging error
        logger.error(
            `Error updating MAC address for session key: ${sessionKey}. Error: ${error.message}`
        );
        throw error;
    }
};

