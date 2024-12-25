const { pool } = require('../config/db');
const { logger } = require('../utils/logger');

/**
 * Retrieves department id from name
 * @param {string} departmentName - The name of the department (e.g., "Computer Science")
 * @returns {Promise<number>} - Returns the department id or an error message if not found
 */
exports.getDepartmentIdByName = async (departmentName) => {
    try {
        // Query to get the department id based on the department name
        const result = await pool.query('SELECT id FROM departments WHERE name = $1', [departmentName.toLowerCase()]);

        // If department is found, return the department id
        if (result.rows.length > 0) {
            return result.rows[0].id;
        } else {
            // Department not found
            logger.warn(`Department with name "${departmentName}" not found.`);
            return null; // Or throw an error depending on how you want to handle this
        }
    } catch (error) {
        // Log the error and throw it for further handling
        logger.error(`Error retrieving department ID for ${departmentName}: ${error.message}`);
        throw new Error('Error retrieving department ID');
    }
};

