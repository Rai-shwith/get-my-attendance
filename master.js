`This Script is used to combine registration ,attendance and deleting Cookie into a single one which will be controlled by frontend`
const express = require('express');
const cors = require('cors');
const os = require('os');
const fs = require('fs');
const path = require('path')
require('dotenv').config()
const crypto = require('crypto');
const cookieParser = require('cookie-parser');
const { PORT, SECRET_KEY, STUDENT_DETAILS_PATH, getLocalIP,log,red,yellow,green,interval} = require('./config/env')

const app = express()


app.use(express.json());
app.use(cors());

// Use cookie-parser middleware
app.use(cookieParser(SECRET_KEY));

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public/static')));

// Get the local IP address of the server
const localIP = getLocalIP();
// load the student details from the JSON file
const studentDetails = JSON.parse(fs.readFileSync(STUDENT_DETAILS_PATH, 'utf8'));

// To keep track of the time left for the server to be active
let attendanceWindowDuration = interval * 1000;

// Decrease the time left every second
setInterval(() => {
    attendanceWindowDuration -= 1000
}, 1000);

let startTime;
let endTime;

let currentRegistration = {};
