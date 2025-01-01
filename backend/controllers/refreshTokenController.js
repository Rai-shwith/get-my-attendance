const { getDetailsFromHashedRefreshToken } = require("../queries/refreshTokenQueries");
const AppError = require("../utils/AppError");
const { generateAccessToken } = require("../utils/auth");
const { hash } = require("../utils/helpers");
const { logger } = require("../utils/logger");

exports.refreshJWTToken = async (req, res, next) => {
    logger.info("Entering refreshJWTToken");
    // Check if the signed cookie exists
    if (!req.signedCookie || !req.signedCookie.refreshToken) {
        return next(new AppError(40001));
    }
    const refreshToken = req.signedCookie.refreshToken;
    const hashedRefreshToken = hash(refreshToken);
    const tokenDetails = await getDetailsFromHashedRefreshToken(hashedRefreshToken);
    const id = tokenDetails.user_id;
    const role = tokenDetails.user_type;
    const accessToken = generateAccessToken({ id, role });
    res.json({
        accessToken
    })
}