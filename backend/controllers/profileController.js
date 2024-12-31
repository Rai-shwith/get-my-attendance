const { getTeacherInfo } = require("../queries/hostQueries");
const AppError = require("../utils/AppError");
const { logger } = require("../utils/logger")

exports.getProfile = async (req, res, next) => {
    logger("Entering getProfile");
    const { id, role } = req;
    if (role == "student") {
        // TODO: implement student profile retrieval
        return next(new AppError(50101));
    } else if (role == "teacher") {
        try {
            const data = await getTeacherInfo(id);
            return res.json({ success: true, message: "Teacher profile retrieved successfully", data }).send(200);
        } catch (error) {
            logger.error("Error while giving profile: " + JSON.stringify(error));
            next(error);
        }
    }
}