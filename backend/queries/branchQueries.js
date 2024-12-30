const { pool } = require('../config/db');
const AppError = require('../utils/AppError');
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
            throw new AppError(40402);
        }
    } catch (error) {
        // Log the error and throw it for further handling
        logger.error(`Error retrieving department ID for ${departmentName}: ${error.message}`);
        throw new AppError(50002);
    }
};

/**
 * Retrieves department name from id
 * @param {number} departmentId - The department id
 * @returns {Promise<number>} - Returns the department name or an error message if not found
 */
exports.getDepartmentNameById = async (departmentId) => {
    try {
        // Query to get the department name based on the department id
        const result = await pool.query('SELECT name FROM departments WHERE id = $1', [departmentId]);

        // If department is found, return the department name
        if (result.rows.length > 0) {
            return result.rows[0].name;
        } else {
            // Department not found
            logger.warn(`Department with id "${departmentId}" not found.`);
            throw new AppError(40402);
        }
    } catch (error) {
        // Log the error and throw it for further handling
        logger.error(`Error retrieving department for ID ${departmentId}: ${error.message}`);
        throw new AppError(50002);
    }
};

