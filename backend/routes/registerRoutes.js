// backend/routes/registerRoutes.js

const express = require('express');
const router = express.Router();
const registerController = require('../controllers/registerController');

// Middleware to check if the session is authenticated (simplified version)
const checkAuth = (req, res, next) => {
    if (!req.session.isAuthenticated) {
        return res.status(403).send('Unauthorized');
    }
    next();
};

// Start registration process
router.post('/host/start-register', checkAuth, registerController.startRegister);

// Register a student
router.post('/register', registerController.registerStudent);

module.exports = router;
