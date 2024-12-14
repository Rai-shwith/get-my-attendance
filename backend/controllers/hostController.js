const {logger} = require('../utils/logger'); // Import the logger
const { authenticateHost } = require('../utils/auth'); // Import the authentication service


// Route to start attendance
const startAttendance = (req, res) => {
    const { password } = req.body; // Assuming the password is sent in the request body

    // Authenticate the host (teacher)
    if (authenticateHost(password)) {
        logger.info('Attendance process started by host');
        // Logic to start attendance (e.g., mark the session as active)
        res.status(200).json({ message: 'Attendance process started' });
    } else {
        logger.warn('Failed attendance start attempt by unauthorized user');
        res.status(403).json({ message: 'Unauthorized' });
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

module.exports = { startAttendance, stopAttendance };
