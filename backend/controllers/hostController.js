const { logger } = require('../utils/logger'); // Import the logger
const { authenticateHost } = require('../utils/auth'); // Import the authentication service
const { getAttendanceState, setAttendanceState } = require('../states/attendanceState');


// Route to start attendance
const startAttendance = (req, res) => {
    if (!getAttendanceState()) {
        const interval = req.cookies.interval || 5;
        logger.info('Attendance process started by host');
        //TODO: Logic to start attendance 
        setAttendanceState(true);

        // TODO: pass the actual link of the server
        const link = 'http://localhost:3000/attendance';
        res.render('hostAttendanceSection', { interval, link});
    } else {
        logger.warn('Failed attendance start attempt while attendance is already active');
        // res.render()
    }
};

// Route to stop attendance
const stopAttendance = (req, res) => {
    const { password } = req.body;

    if (authenticateHost(password)) {
        logger.info('Attendance process stopped by host');
        // Logic to stop attendance (e.g., generate reports)
        res.status(200).json({ message: 'Attendance process stopped' });
    } else {
        logger.warn('Failed attendance stop attempt by unauthorized user');
        res.status(403).json({ message: 'Unauthorized' });
    }
};

// Route to serve the login page
const getLoginPage = (req, res) => {
    res.render('hostLogin');
};

// Route to handle the login request
const login = (req, res) => {
    const { username, password } = req.body;
    if (username === 'admin' && password === '1234') {
        req.session.isLoggedIn = true; // Mark host as logged in
        // Set the default window for the attendance 
        const interval = 5;
        res.cookie('interval', 5, {
            maxAge: 31104000000, // 1 year
            httpOnly: false,
            secure: false,
        });
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


module.exports = { startAttendance, stopAttendance, getLoginPage, login, getHostHomepage, logout };
