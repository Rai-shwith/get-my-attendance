const { logger } = require('../utils/logger'); // Import the logger
const { getAttendanceState, setAttendanceState, setAttendanceWindowInterval, getRemainingAttendanceTime } = require('../states/attendanceState');
const { getRegistrationState, setRegistrationState, setRegistrationWindowInterval, getRemainingRegistrationTime } = require('../states/registerState');
const { saveStudentData, attendance, getAllStudents } = require('../models/studentDetails');
const helpers = require('../utils/helpers');
const generatePDF = require('../services/pdfService');
const generateExcel = require('../services/excelService');
const { addAttendanceEntry, getAttendanceReport, getAttendanceHistorySummary } = require('../models/attendanceDetails');
const { getBaseURL } = require('../states/general');


// Route to start attendance
const startAttendance = (req, res) => {
    logger.debug("startAttendance :Entering");
    const defaultInterval = 5 * 60 * 1000; // 5 minutes in milliseconds
    let interval = parseInt(req.session.interval, 10); // Convert to integer
    logger.debug("Session Interval : " + interval);
    const link = getBaseURL()+'/attendance';
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

        // Get the list of present and absent students
        const present = attendance.getPresentStudents();
        const absent = attendance.getAbsentStudents();

        // Length of present and absent details
        const presentCount = Object.keys(present).length;
        const absentCount = Object.keys(absent).length;

        // Combine the present and absent students
        const combinedData = helpers.combineData(present, absent);

        const timestamp = new Date().getTime();

        // Save the attendance details
        addAttendanceEntry(timestamp, combinedData);


        res.redirect("/host/reports/attendance?timestamp=" + timestamp)
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
    const link = getBaseURL()+'/register';
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
        res.render('error', { status: 401, message: "Invalid credentials!" });
    }
};

// Route to serve the webpage
const getHostHomepage = (req, res) => {
    res.render('hostHomepage');
}

// Route to download the pdf report
const downloadPdf = async (req, res) => {
    logger.debug("downloadPdf : Entering");
    const { timestamp } = req.body;
    if (!timestamp) {
        res.render('error', { status: 404, message: "Timestamp is required to download" });
    }
    const attendanceReport = getAttendanceReport(timestamp);
    const { presentCount, absentCount } = helpers.getCounts(attendanceReport);
    const pdfBuffer = await generatePDF(attendanceReport, presentCount, absentCount, timestamp);
    const formattedDate = helpers.getFormattedDate(timestamp);
    // Set headers
    res.set({
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${formattedDate}.pdf"`,
    });

    // Send the buffer
    res.send(pdfBuffer);
    logger.info("PDF sent");
}

// Route to download the Excel report
const downloadExcel = async (req, res) => {
    logger.debug("downloadExcel : Entering");
    const { timestamp } = req.body;
    if (!timestamp) {
        res.render('error', { status: 404, message: "Timestamp is required to download" });
    }
    const attendanceReport = getAttendanceReport(timestamp);
    const { presentCount, absentCount } = helpers.getCounts(attendanceReport);
    const excelBuffer = await generateExcel(attendanceReport, presentCount, absentCount, timestamp);
    const formattedDate = helpers.getFormattedDate(timestamp);
    // Set headers
    res.set({
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="${formattedDate}.xlsx"`,
    });

    // Send the buffer
    res.send(excelBuffer);
    logger.info("Excel sent");
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

// Route to preview the history
const getHistory = (req, res) => {
    logger.info("Sending the History Summary")
    const sessions = getAttendanceHistorySummary();
    res.render('hostAttendanceHistory', { sessions });    
};


// Route to view Attendance Details
const getAttendanceDetails = (req, res) => {
    const timestamp = parseInt(req.query.timestamp);
    const attendance = getAttendanceReport(timestamp);

    if (!attendance){
        const [status,message]= [404,"No Attendance Report Found!"];
        return res.status(status).render('error', { status, message});
    }

    // Sort the students based on status and then USN
      attendance.sort((a, b) => {
        if (a.status === b.status) {
            return a.usn.localeCompare(b.usn);
        }
        return a.status === "Absent" ? -1 : 1;
    });
    const {absentCount, presentCount} = helpers.getCounts(attendance);
    logger.debug(`timestamp: ${timestamp} - presentCount: ${presentCount} - absentCount: ${absentCount}`);
    res.render('hostAttendanceReport', { attendance,timestamp,presentCount,absentCount})
}

// Route to view EnrolledStudent
const getEnrolledStudents = (req, res) => {
    const enrolledStudents = getAllStudents();
    enrolledStudents.sort((a, b) => {
            return a.usn.localeCompare(b.usn);
    });
    res.render('hostViewEnrolled',{enrolledStudents});
};
module.exports = { startAttendance, stopAttendance, startRegistration, stopRegistration, getLoginPage, login, getHostHomepage, logout, getAttendanceDetails, getEnrolledStudents, getHistory, downloadExcel, downloadPdf };
