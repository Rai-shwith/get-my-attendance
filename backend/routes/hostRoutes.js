// backend/routes/hostRoutes.js
const express = require('express');
const router = express.Router();
const { startAttendance, stopAttendance, getLoginPage, login, getHostHomepage,  } = require('../controllers/hostController');

function ensureLogin(req, res, next) {
    if (req.session.isLoggedIn) {
        next(); // Proceed to the requested route
    } else {
        res.redirect('/host/login'); // Redirect to login if not authenticated
    }
}

// Route to serve the host homepage
router.get('/',ensureLogin,getHostHomepage);

// Route to start attendance
router.post('/start-attendance',ensureLogin, startAttendance);

// Route to stop attendance
router.post('/stop-attendance',ensureLogin, stopAttendance);

router.get('/login',getLoginPage);

router.post('/login',login);

module.exports = router;
