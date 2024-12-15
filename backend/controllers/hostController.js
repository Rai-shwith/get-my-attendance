const { logger } = require('../utils/logger'); // Import the logger
const { authenticateHost } = require('../utils/auth'); // Import the authentication service
const { getAttendanceState, setAttendanceState, setAttendanceWindowInterval, getRemainingAttendanceTime } = require('../states/attendanceState');
const { getRegistrationState, setRegistrationState, setRegistrationWindowInterval, getRemainingRegistrationTime } = require('../states/registerState');
const { saveStudentData } = require('../models/studentDetails');


// Route to start attendance
const startAttendance = (req, res) => {
    logger.debug("startAttendance :Entering");
    const defaultInterval = 5 * 60 * 1000; // 5 minutes in milliseconds
    let interval = parseInt(req.session.interval, 10); // Convert to integer
    logger.debug("Session Interval : " + interval);
    const link = 'http://localhost:3000/attendance';
    if (getRegistrationState()) {
        logger.warn('Failed attendance start attempt while registration is active');
        res.render('hostAttendanceSection', { interval: 0, link, showNotification: 'Registration is active', otherProcessRunning: true });
        return;
    }

    if (!getAttendanceState()) {
        //TODO: Logic to start attendance 
        setAttendanceState(true);
        if (isNaN(interval) || interval <= 0) {
            interval = defaultInterval; // Use default if invalid
        }
        setAttendanceWindowInterval(interval);
        const remainingTime = getRemainingAttendanceTime();
        logger.debug("Remaining Time:" + remainingTime);
        // TODO: pass the actual link of the server
        res.render('hostAttendanceSection', { interval: remainingTime, link, showNotification: '', otherProcessRunning: false });
        logger.info('Attendance process started by host');
        return;
    }
    const remainingTime = getRemainingAttendanceTime();
    logger.debug("Remaining Time:" + remainingTime);
    logger.warn('Failed attendance start attempt while attendance is already active');
    res.render('hostAttendanceSection', { interval: remainingTime, link, showNotification: 'Attendance is already active', otherProcessRunning: false });
    return;
};



// Route to stop attendance
const stopAttendance = (req, res) => {
    logger.debug("stopAttendance :Entering");
    if (getAttendanceState()) {
        setAttendanceState(false);

        // TODO: render hostAttendanceReport
        res.redirect('/host')
        logger.info("Stopping the Attendance Process")
        return;
    }
    logger.warn("Failed to Stop Attendance Process: process not started yet")
    res.render('error', {
        status: 404,
        message: "Attendance process is not started yet."
    })
};


// Route to start Registration 
const startRegistration = (req, res) => {
    logger.info('Entering startRegistration function');
    const defaultInterval = 5 * 60 * 1000; // 5 minutes in milliseconds
    let interval = parseInt(req.session.interval, 10); // Convert to integer
    if (isNaN(interval) || interval <= 0) {
        interval = defaultInterval; // Use default if invalid
    }
    const link = 'http://localhost:3000/register';
    if (getAttendanceState()) {
        logger.warn('Failed Register start attempt while attendance is active');
        res.render('hostRegistrationSection', { interval: 0, link, showNotification: 'Registration is active', otherProcessRunning: true });
        return;
    }
    if (!getRegistrationState()) {
        logger.info('Registration process started by host');
        //TODO: Logic to start attendance 
        setRegistrationState(true);
        setRegistrationWindowInterval(interval);
        const remainingTime = getRemainingRegistrationTime();
        // TODO: pass the actual link of the server
        res.render('hostRegistrationSection', { interval: remainingTime, link, showNotification: '', otherProcessRunning: false });
        return;
    }
    const remainingTime = getRemainingRegistrationTime();
    logger.warn('Failed attendance start attempt while attendance is already active');
    res.render('hostRegistrationSection', { interval: remainingTime, link, showNotification: 'Attendance is already active', otherProcessRunning: false });
    return;
};


// Route to stop Registration 
const stopRegistration = (req, res) => {
    logger.debug("stopRegistration :Entering");

    if (getRegistrationState()) {
        setRegistrationState(false);
        saveStudentData();
        // TODO: render hostRegistrationReport
        res.redirect('/host')
        logger.info("Stopping the Registration Process")
        return;
    }
    logger.warn("Failed to Stop Registration Process: process not started yet")
    res.render('error', {
        status: 404,
        message: "Registration process is not started yet."
    })
}

// Route to serve the login page
const getLoginPage = (req, res) => {
    res.render('hostLogin');
};

// Route to handle the login request
const login = (req, res) => {
    const { username, password } = req.body;
    if (username === 'admin' && password === '1234') {
        req.session.isLoggedIn = true; // Mark host as logged in
        // TODO: Set the default window for the attendance 
        const interval = 5 * 60 * 1000;
        req.session.interval = interval;
        res.redirect('/host');
    } else {
        res.render('error', { message: "Invalid credentials!" });
    }
};

// Route to serve the webpage
const getHostHomepage = (req, res) => {
    res.render('hostHomepage');
}

// Route to logout 
const logout = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error("Error destroying session:", err);
        }
        res.redirect('/login');
    });
};


module.exports = { startAttendance, stopAttendance, startRegistration, stopRegistration, getLoginPage, login, getHostHomepage, logout };
