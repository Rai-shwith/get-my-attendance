// backend/routes/hostRoutes.js
const express = require('express');
const router = express.Router();
const { startAttendance, stopAttendance } = require('../controllers/hostController');

// Route to start attendance
router.post('/start-attendance', startAttendance);

// Route to stop attendance
router.post('/stop-attendance', stopAttendance);

module.exports = router;
