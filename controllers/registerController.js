const fs = require('fs');
const path = require('path');
const { getLocalIP, log, green, red, yellow, interval, STUDENT_DETAILS_PATH } = require('../config/env');
const { generateID, getAlreadyRegistered } = require('../utils/helpers');

const localIP = getLocalIP();
const studentDetails = JSON.parse(fs.readFileSync(STUDENT_DETAILS_PATH, 'utf8'));
let attendanceWindowDuration = interval * 1000;
let currentRegistration = {};

const register = (req, res) => {
    const filePath = path.join(__dirname, '../public', 'register.html');
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send('Error reading the file.');
        }
        const registerUrl = `http://${localIP}:${PORT}/register`;
        let modifiedHtml = data.replace('%registerUrl%', registerUrl);
        modifiedHtml = modifiedHtml.replace('%timer%', String(attendanceWindowDuration));
        res.send(modifiedHtml);
    });
};

const handleRegistration = (req, res) => {
    const id = req.signedCookies.id;
    const info = req.body.info;
    try {
        // Registration logic here
        // ...
        return res.status(200).json({ message: "Registration Successful" });
    } catch (error) {
        if (error.code === 409) {
            return res.status(error.code).json({ message: error.message });
        }
    }
    res.status(500).json({ message: "Something Went Wrong Please Contact the Admin" });
};

module.exports = { register, handleRegistration };