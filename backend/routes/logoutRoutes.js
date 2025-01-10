const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/authMiddleware');
const { logout } = require('../controllers/logoutController');

// Router to Register a student
router.post('/',authenticateToken, logout);

module.exports = router;
