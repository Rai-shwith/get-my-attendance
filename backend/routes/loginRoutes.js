// backend/routes/registerRoutes.js

const express = require('express');
const router = express.Router();
const loginController = require('../controllers/loginController');

// Router to Register a student
router.post('/login', loginController.login);

module.exports = router;
