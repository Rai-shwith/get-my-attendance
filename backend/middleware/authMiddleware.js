// backend/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const { auth } = require('../config/env');
const AppError = require('../utils/AppError');


const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization'] && req.headers['authorization'].split(' ')[1];

    if (!token) return next(new AppError(40101)); // Unauthorized
    
    jwt.verify(token, auth.jwtKey, (err, user) => {
        if (err) return next (new AppError(40301)); // Forbidden
        req.role = user.role;
        req.id = user.id;
        next();
    });
};

module.exports = { authenticateToken };