const express = require('express');
const { register, handleRegistration } = require('../controllers/registerController');

const router = express.Router();

router.get('/', register);
router.post('/', handleRegistration);

module.exports = router;