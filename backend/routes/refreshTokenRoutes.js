const express = require('express');
const router = express.Router();
const refreshTokenController = require('../controllers/refreshTokenController');

// Router to send the JWT token using refresh tokens
router.post('/',refreshTokenController.refreshJWTToken);

module.exports = router;
