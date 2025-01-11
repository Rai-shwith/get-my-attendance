// backend/routes/hostRoutes.js
const express = require('express');
const router = express.Router();
const { startAttendance, stopAttendance, getLoginPage, login, getHostHomepage, startRegistration, stopRegistration, getAttendanceDetails, downloadPdf, downloadExcel, getHistory, getEnrolledStudents, getRegistrationDetails, getEditStudentsPage, editStudentData, logout,  } = require('../controllers/hostController');
const { logger } = require('../utils/logger');
const { decodeJwt } = require('../utils/auth');
const { authenticateToken } = require('../middleware/authMiddleware');



router.use(authenticateToken);

// Route to start attendance
router.get('/start-attendance', startAttendance);

// Route to stop attendance
router.get('/stop-attendance', stopAttendance);

// Route to start registration
router.post('/start-registration', startRegistration);

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
