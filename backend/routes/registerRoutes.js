// backend/routes/registerRoutes.js

const express = require('express');
const router = express.Router();
const registerController = require('../controllers/registerController');



// Router to render the registration page
router.get('/register', registerController.getRegistrationPage);

// Router to Register a student
router.post('/register', registerController.registerStudent);

module.exports = router;
