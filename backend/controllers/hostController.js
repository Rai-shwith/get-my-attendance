const { logger } = require('../utils/logger'); // Import the logger
const { authenticateHost } = require('../utils/auth'); // Import the authentication service
const { getAttendanceState, setAttendanceState, setAttendanceWindowInterval, getRemainingAttendanceTime } = require('../states/attendanceState');
const { getRegistrationState, setRegistrationState, setRegistrationWindowInterval, getRemainingRegistrationTime } = require('../states/registerState');
const { saveStudentData, attendance } = require('../models/studentDetails');
const helpers = require('../utils/helpers');
const generatePDF = require('../services/pdfService');
const { updateOutputPdfPath, updateOutputExcelPath } = require('../states/general');
const generateExcel = require('../services/excelService');


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
        if (isNaN(interval) || interval <= 0) {
            interval = defaultInterval; // Use default if invalid
        }
        setAttendanceWindowInterval(interval);
        setAttendanceState(true);
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
const stopAttendance = async (req, res) => {
    logger.debug("stopAttendance :Entering");
    if (getAttendanceState()) {
        logger.info("Stopping the Attendance Process")
        setAttendanceState(false);

        // // Get the list of present and absent students
        // const present = attendance.getPresentStudents();
        // const absent = attendance.getAbsentStudents();

        // // Length of present and absent details
        // const presentCount = Object.keys(present).length;
        // const absentCount = Object.keys(absent).length;

        // // Combine the present and absent students
        // const combinedData = helpers.combineData(present, absent);

        // // Generate pdf
        // const outputPdfPath = await generatePDF(combinedData,presentCount,absentCount);
        // updateOutputPdfPath(outputPdfPath);

        // // Generate Excel
        // const outputExcelPath = await generateExcel(combinedData,presentCount,absentCount);
        // updateOutputExcelPath(outputExcelPath);


        // TODO: render hostAttendanceReport
        res.redirect("/host/reports/attendance")
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
        setRegistrationWindowInterval(interval);
        setRegistrationState(true);
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
        logger.debug("Stopping the Registration Process")
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
        res.render('error', { status:401,message: "Invalid credentials!" });
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

// Route to view Attendance Details
const getAttendanceDetails = (req, res) => {
    const attendance = [
        { name: "John Doe", usn: "1MS23EC001", status: "present" },
        { name: "Jane Smith", usn: "1MS23EC002", status: "absent" },
        { name: "Alice Johnson", usn: "1MS23EC003", status: "present" },
        { name: "Bob Brown", usn: "1MS23EC004", status: "absent" },
        { name: "Charlie Davis", usn: "1MS23EC005", status: "present" },
        { name: "Diana Wilson", usn: "1MS23EC006", status: "present" },
        { name: "Ethan Taylor", usn: "1MS23EC007", status: "absent" },
        { name: "Fiona Anderson", usn: "1MS23EC008", status: "present" },
        { name: "George Harris", usn: "1MS23EC009", status: "absent" },
        { name: "Hannah Clark", usn: "1MS23EC010", status: "present" },
        { name: "Ian Lewis", usn: "1MS23EC011", status: "present" },
        { name: "Julia Walker", usn: "1MS23EC012", status: "absent" },
        { name: "Kevin Young", usn: "1MS23EC013", status: "present" },
        { name: "Laura King", usn: "1MS23EC014", status: "absent" },
        { name: "Michael Scott", usn: "1MS23EC015", status: "present" },
        { name: "Natalie Hall", usn: "1MS23EC016", status: "present" },
        { name: "Oscar Wright", usn: "1MS23EC017", status: "absent" },
        { name: "Paula Lopez", usn: "1MS23EC018", status: "present" },
        { name: "Quincy Hill", usn: "1MS23EC019", status: "absent" },
        { name: "Rachel Green", usn: "1MS23EC020", status: "present" },
        { name: "Samuel Adams", usn: "1MS23EC021", status: "present" },
        { name: "Tina Baker", usn: "1MS23EC022", status: "absent" },
        { name: "Victor Moore", usn: "1MS23EC023", status: "present" },
        { name: "Wendy Perez", usn: "1MS23EC024", status: "absent" },
        { name: "Xavier Thompson", usn: "1MS23EC025", status: "present" }
    ];
    
        res.render('hostAttendanceReport',{attendance})
}

module.exports = { startAttendance, stopAttendance, startRegistration, stopRegistration, getLoginPage, login, getHostHomepage, logout,getAttendanceDetails };
