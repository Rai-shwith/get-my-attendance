// backend/routes/attendanceRoutes.js

const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendanceController');

// Middleware to check if the session is authenticated (simplified version)
const checkAuth = (req, res, next) => {
    if (!req.session.isAuthenticated) {
        return res.status(403).send('Unauthorized');
    }
    next();
};

// Start attendance
router.post('/host/start-attendance', checkAuth, attendanceController.startAttendance);

// Stop attendance
router.post('/host/stop-attendance', checkAuth, attendanceController.stopAttendance);

// Get attendance report (PDF/Excel)
router.get('/attendance/report', checkAuth, attendanceController.getAttendanceReport);

module.exports = router;
