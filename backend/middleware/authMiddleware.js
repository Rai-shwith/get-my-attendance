// backend/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const { auth } = require('../config/env');


const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization'] && req.headers['authorization'].split(' ')[1];

    if (!token) return res.sendStatus(401); // Unauthorized
    
    jwt.verify(token, auth.jwtKey, (err, user) => {
        if (err) return res.sendStatus(403); // Forbidden
        req.user = user.username; // Attach user info to request
        req.role = user.role;
        req.id = user.id;
        next();
    });
};

module.exports = { authenticateToken };