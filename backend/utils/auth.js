const jwt = require('jsonwebtoken');
const { auth } = require('../config/env');

exports.generateAccessToken = (user) => {
    return jwt.sign(user, auth.jwtExpiration, { expiresIn: auth.jwtExpiration });
};

exports.generateRefreshToken = (user) => {
    return jwt.sign(user, auth.refreshToken, { expiresIn: auth.refreshTokenExpiration });
};

exports.validateRefreshToken = async (token) => {
    const decoded = jwt.verify(token, auth.refreshToken);
    
    const refreshToken = await db.query('SELECT * FROM refresh_tokens WHERE token = $1', [token]);

    if (!refreshToken || refreshToken.expires_at < new Date()) {
        throw new Error('Invalid or expired refresh token');
    }
    
    
    // Token is valid, generate new access token
    const newAccessToken = generateAccessToken({ userId: refreshToken.user_id });
    return newAccessToken;
};