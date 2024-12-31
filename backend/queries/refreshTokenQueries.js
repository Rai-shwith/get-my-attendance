import { db } from "../config/env";
import AppError from "../utils/AppError";
import { logger } from "../utils/logger";

/**
 * Function to get the refresh token entry for the given token.
 * 
 * @param {string} hashedToken - The hashed refresh hashedToken.
 * @returns {Promise<object>} - Returns the refresh token entry or an error message.
 */
exports.getDetailsFromHashedRefreshToken = async (hashedToken) => {
    logger.debug("Attempting to get the refresh token entry for the given token.");
    if (!hashedToken) {
        logger.info("No token provided");
        throw new AppError(40005);
    }
    const query = `
        SELECT * FROM refresh_tokens WHERE token = $1;
    `;
    try {
        const result = await db.query(query, [hashedToken]);
        if (result.rows.length === 0) {
            logger.info("No refresh token found");
            throw new AppError(40103);
        }
        const tokenDetails = result.rows[0]
        if (tokenDetails.revoked) {
            logger.info("Refresh token has been revoked");
            throw new AppError(40104);
        }
        if (tokenDetails.expires_at < new Date()) {
            logger.info("Refresh token has expired");
            throw new AppError(40103);
        }
        return tokenDetails;
    } catch (error) {
        logger.error("Error occurred while getting the refresh token entry: " + JSON.stringify(error));
        throw new AppError(50002);
    }
}

/**
 * Function to revoke the refresh token entry for the given token.
 * 
 * @param {number} userId - The user ID.
 * @param {string} userType - The user type (e.g., "teacher" or "student").
 * @returns {Promise<object>} - Returns the refresh token entry or an error message.
 */
exports.revokeRefreshToken = async (userId, userType) => {
    logger.debug("Attempting to revoke the refresh token entry for the given token.");
    if (!userId) {
        logger.info("No user ID ");
        throw new AppError(40006);
    }
    if (!userType) {
        logger.info("No user role provided");
        throw new AppError(40007);
    }
    const query = `UPDATE refresh_tokens SET revoked = true WHERE user_id = $1 AND user_type = $2;`;
    try {
        await db.query(query, [userId, userType]);
        logger.info("Refresh token revoked successfully");
    }
    catch (error) {
        logger.error("Error occurred while revoking the refresh token entry: " + JSON.stringify(error));
        throw new AppError(50002);
    }
};

/**
 * Function to add a new refresh token entry.
 * 
 * @param {string} hashedToken - The hashed refresh token.
 * @param {number} userId - The user ID.
 * @param {string} userType - The user type (e.g., "teacher" or "student").
 * @param {Date} expiresAt - The expiry date of the refresh token.
 * @returns {Promise<object>} - Returns the refresh token entry or an error message.
 */
exports.addRefreshToken = async (hashedToken, userId, userType, expiresAt) => {
    logger.debug("Attempting to add a new refresh token entry.");
    if (!hashedToken) {
        logger.error("Missing hashed token");
        throw new AppError(40005);
    }
    if (!userId) {
        logger.error("Missing user ID");
        throw new AppError(40006);
    }
    if (!userType) {
        logger.error("Missing user role");
        throw new AppError(40007);
    }
    if (!["teacher", "student"].includes(userType)) {
        logger.error("Invalid user role");
        throw new AppError(40004);
    }
    if (!expiresAt) {
        logger.error("Missing expiry time");
        throw new AppError(40008);
    }
    if (expiresAt < new Date()) {
        logger.error("Invalid expiry time");
        throw new AppError(40009);
    }
    // If a refresh token already exists for the user, delete it
    const deleteQuery = `DELETE FROM refresh_tokens WHERE user_id = $1 AND user_type = $2;`;
    try {
        await db.query(deleteQuery, [userId, userType]);
        logger.info("Existing refresh token deleted successfully");
    } catch (error) {
        logger.error("Error occurred while deleting existing refresh token: " + JSON.stringify(error));
        throw new AppError(50002);
    }

    const query = `INSERT INTO refresh_tokens (hashed_token, user_id, user_type, expires_at) VALUES ($1, $2, $3, $4) RETURNING *;`;
    try {
        const result = await db.query(query, [hashedToken, userId, userType, expiresAt]);
        logger.info("Refresh token added successfully");
        return result.rows[0];
    } catch (error) {
        logger.error("Error occurred while adding the refresh token entry: " + JSON.stringify(error));
        throw new AppError(50003);
    }
};