const jwt = require('jsonwebtoken');
const { auth } = require('../config/env');
const crypto = require('crypto');
const { hash } = require('./helpers');
const {getDetailsFromHashedRefreshToken,} = require('../queries/refreshTokenQueries');

exports.generateAccessToken = (user) => {
    return jwt.sign(user,auth.jwtKey, { expiresIn: auth.jwtExpiration });
};

exports.generateRefreshToken = () => {
    const token = crypto.randomBytes(64).toString('hex');
    return token;
};

exports.validateRefreshToken = async (token) => {
    const hashedToken = hash(token);
    const details = await getDetailsFromHashedRefreshToken(hashedToken);
    return details;
};