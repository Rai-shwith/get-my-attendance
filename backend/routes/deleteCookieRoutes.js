// backend/routes/hostRoutes.js
const express = require('express');
const { deleteCookie } = require('../controllers/deleteCookieController');
const router = express.Router();

// Route to start attendance
router.post('/deleteCookies', deleteCookie);


module.exports = router;
