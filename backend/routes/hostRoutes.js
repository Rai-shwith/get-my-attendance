// backend/routes/hostRoutes.js
const express = require('express');
const router = express.Router();
const { startAttendance, stopAttendance, getLoginPage, login, getHostHomepage, startRegistration, stopRegistration, getAttendanceDetails, downloadPdf, downloadExcel, getHistory, getEnrolledStudents, getRegistrationDetails, getEditStudentsPage, editStudentData, logout,  } = require('../controllers/hostController');
const { logger } = require('../utils/logger');

function ensureLogin(req, res, next) {
    if (req.session.isLoggedIn) {
        logger.debug('Host is authenticated');
        next(); // Proceed to the requested route
    } else {
        logger.warn('Unauthorized access to host page');
        res.redirect('/host/login'); // Redirect to login if not authenticated
    }
}

// Route to get the login Page
router.get('/login',getLoginPage);

// Route to login
router.post('/login',login);

// Route to logout
router.get('/logout',logout);

router.use(ensureLogin);

// Route to serve the host homepage
router.get('/',getHostHomepage);

// Route to start attendance
router.get('/start-attendance', startAttendance);

// Route to stop attendance
router.get('/stop-attendance', stopAttendance);

// Route to start registration
router.get('/start-registration', startRegistration);

// Route to stop registration
router.get('/stop-registration', stopRegistration);

// Route to view enrolled students
router.get('/enrolled-students',getEnrolledStudents );

// Route to view attendance Report
router.get('/reports/attendance',getAttendanceDetails);

// Route to view Registration Report
router.get('/reports/registration',getRegistrationDetails);

// Route to preview the history
router.get('/reports/history',getHistory);

// Route to send page for edit registered students
router.get('/edit/students',getEditStudentsPage);

// Route to send page for edit registered students
router.post('/edit/students',editStudentData);

// Route to download pdf
router.post('/download-pdf',downloadPdf);

// Route to download excel
router.post('/download-excel',downloadExcel);

module.exports = router;
