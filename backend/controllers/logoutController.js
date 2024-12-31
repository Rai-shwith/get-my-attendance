const { revokeRefreshToken } = require("../queries/refreshTokenQueries");
const { logger } = require("../utils/logger");
exports.logout = async (req, res, next) => {
    logger.debug("Entering logout endpoint");
    res.clearCookie('refreshToken', {
        signed: true,
        secure: true,
        httpOnly: false,
    });
    const {id,role} = req;
    await revokeRefreshToken(id,role);
    res.status(204).json({success:true});
};