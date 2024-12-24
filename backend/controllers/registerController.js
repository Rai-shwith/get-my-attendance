// backend/controllers/registerController.js

const helpers = require('../utils/helpers');
const {getStudentByUSN,currentRegistration,getStudentById,addStudent} = require('../models/studentDetails');
const { getRegistrationState, setRegistrationState, getRemainingRegistrationTime } = require('../states/registerState');
const { logger } = require('../utils/logger');
const { sendMessage } = require('../utils/socketHelper');


// TODO: Break this into middlewares as attendanceRoutes.js
const handleRegistration = (registerID,name,usn, req) => {
    logger.debug(`Entering handleRegistration : Id[${registerID}] Name[${name}] USN[${usn}]`);
    // If the registerID (Cookie) is empty then he either cleared his browser info(Already Registered) or New Registration
    const alreadyRegistered = getStudentByUSN(usn);
    if (registerID === undefined) {
        logger.debug("ID is undefined")
        // Checking whether the student is already registered or not based on USN
        // If the user is not registered before a unique registerID is set to users Cookie and the registration completes
        if (!alreadyRegistered) {
            logger.debug("New Registration")
            // Setting unique ID as Cookie 
            const uniqueId = helpers.generateID()
            req.session.registerID = uniqueId;
            logger.debug("registerID set in the cache")
            addStudent(uniqueId,{name,usn});
            currentRegistration.addStudent(uniqueId,{name,usn});
            logger.info("Registering " + name);
        } // If the user is already registered he have to contact the admin to log him
        // This could have happened if he deleted his browser cookies or cache.
        // Solution : Delete the information about the student from student details json file. (Be careful ) 
        else if ((alreadyRegistered.name !== name)) {
            errorMessage = `${alreadyRegistered.usn} is already registered by ${alreadyRegistered.name}!<br>Please contact the admin if there is any issues.`
            logger.error(`${name} is trying to register ${alreadyRegistered.usn}:${alreadyRegistered.name}`)
            const error = new Error(errorMessage);
            error.code = 409;
            throw error;
        } else {
            errorMessage = `${alreadyRegistered.usn} is already registered by ${alreadyRegistered.name}!<br>Please contact the admin if you want to login.`
            logger.error(`${name} is trying to register ${alreadyRegistered.usn}:${alreadyRegistered.name}`)
            const error = new Error(errorMessage);
            error.code = 409;
            throw error;
        }
        // If the user has registerID (Cookie) then,
        // CASE 1: He may be trying to register again
        // CASE 2 : He may be trying to register again with another USN
        // CASE 3: He may be trying to register Others
        // CASE 4: His information is erased from Student Details
} else {
        let errorMessage;
        // CASE 4: 
        // Solution for CASE4: Run the deleteCookie.js script to delete the cookie form this user and then run this (register.js) script to register him again
        if (getStudentById(registerID) === null) {
            errorMessage = "Your information is erased from the system. Please contact the admin."
            logger.error(`${name}'s information is erased from the system`)
            const error = new Error(errorMessage);
            error.code = 409;
            throw error;
        }
        // CASE 1:
        if (getStudentById(registerID).name === name && (getStudentById(registerID).usn === usn)) {
            errorMessage = `${getStudentById(registerID).name} is already registered`
            logger.warn( errorMessage)
            const error = new Error(errorMessage);
            error.code = 409;
            throw error;
        }
        // CASE 2:
        else if (getStudentById(registerID).name === name && (getStudentById(registerID).usn !== usn)) {
            errorMessage = `Your USN is ${getStudentById(registerID).usn} right?<br>Please contact the admin if there is any issues.`
            const error = new Error(errorMessage);
            error.code = 409;
            throw error;
        }
        // CASE 3:
        else {
            errorMessage = `${getStudentById(registerID).name} is trying to register ${name}.<br>THIS INCIDENT WILL BE REPORTED!!!!`
            logger.error(`${getStudentById(registerID).name} is trying to register ${name}`)
            const error = new Error(errorMessage);
            error.code = 409;
            throw error;
        }
    }
};



exports.getRegistrationPage = (req, res) => {
    logger.info('GET /register');
    // check if the registration is started
    if (getRegistrationState()) {
    const remainingTime = getRemainingRegistrationTime();
    res.render('register', { timer:remainingTime,registerStarted: true });
    } else {
    logger.info('Registration not started');
    res.render('register', { timer: 0,registerStarted: false });
    }
};

//  Router to register Student
exports.registerStudent = (req, res) => {
    const registerID = req.session.registerID;
    let { name, usn } = req.body;
    name = name.replaceAll('\n','').trim();
    usn = usn.replaceAll('\n','').trim();
    logger.info(`POST /register ${name} : ${usn}`);
    try {
        handleRegistration(registerID, name, usn, req)
        sendMessage("notification",JSON.stringify({type:'success',message:`${name} [${usn}] registered Successfully`}));
        return res.status(200).json({ message: "Registration Successful" });
    } catch (error) {
        logger.error(error.message)
        if (error.code === 409) {
        sendMessage("notification",JSON.stringify({type:'error',message:`Error found`}) );
        return res.status(error.code).json({ message: error.message });
        }
    }
    res.status(500).json({ message: "Something Went Wrong Please Contact the Admin" });
};
