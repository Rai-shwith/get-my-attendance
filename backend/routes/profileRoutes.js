// backend/routes/registerRoutes.js

const express = require('express');
const router = express.Router();
const p = require('../controllers/loginController');
const profile = require('../controllers/profileController');
const { authenticateToken } = require('../middleware/authMiddleware');

// Router to Register a student
router.post('/profile', authenticateToken, profile.getProfile);

module.exports = router;
