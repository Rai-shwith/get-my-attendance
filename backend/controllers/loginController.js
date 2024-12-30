const { loginTeacher } = require("../queries/hostQueries");
const AppError = require("../utils/AppError");
const { logger } = require("../utils/logger");

const handleTeacherLogin = async ({email, password}) => {
    if (! (email && password )) {
        throw new AppError(40001);
    }
    if (!email.includes('@') || password.length < 5) {
        throw new AppError(40002);
      }
      try {
        return await loginTeacher(email,password);
      } catch (error) {
        logger.debug("While registering teacher"+error);
        throw error;
      }
}

const handleStudentLogin = async ({name,usn, email, dateOfBirth, enrollmentYear, registeredUnder, department}) => {
    if (! (name && usn && email && dateOfBirth && enrollmentYear && registeredUnder  && department)) {
        throw new AppError(40001);
    }
    if (!email.includes('@') ||(new Date(dateOfBirth) > new Date())) {
        throw new AppError(40002);
      }
      try {
        
      } catch (error) {
        
      }
}


//  Router to login both teacher or student
exports.login = async (req, res, next) => {
    logger.debug("Entering login , Credentials "+req.body);
    const credentials = req.body

    if (!credentials) {
        return next(new AppError(40001));
    }

    if (credentials.role == 'student'){
        // TODO: Not yet implemented
        logger.debug("Trying to login student");
        return next(new AppError(50101));
        try {
            await handleStudentLogin(credentials)
        }catch (error) {
            logger.error("While Logging student : "+error);
            return next(error);
        }
    } else if (credentials.role == 'teacher') {
        logger.debug("Trying to login teacher");
        try {
            const result = await handleTeacherLogin(credentials)
            return res.status(200).json({
                success: true,
                message: "Teacher logged in successfully",
                data: result,
                role: "host"
            })
        } catch (error) {
            logger.error("While logging teacher "+error);
            return next(error);
        }
    } else {
        return next(new AppError(40004));
    }
};
