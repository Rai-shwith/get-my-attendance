// backend/routes/hostRoutes.js
const express = require('express');
const router = express.Router();
const { startAttendance, stopAttendance, getLoginPage, login, getHostHomepage, startRegistration, stopRegistration,  } = require('../controllers/hostController');
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

// Route to serve the host homepage
router.get('/',ensureLogin,getHostHomepage);

// Route to start attendance
router.get('/start-attendance',ensureLogin, startAttendance);

// Route to stop attendance
router.get('/stop-attendance',ensureLogin, stopAttendance);

// Route to start registration
router.get('/start-registration',ensureLogin, startRegistration);

// Route to stop registration
router.get('/stop-registration',ensureLogin, stopRegistration);

router.get('/login',getLoginPage);

router.post('/login',login);

module.exports = router;
