const express = require('express');
const router = express.Router();
const profile = require('../controllers/profileController');
const { authenticateToken } = require('../middleware/authMiddleware');

// Router to Register a student
router.post('/', authenticateToken, profile.getProfile);

module.exports = router;
