`This Script is used to combine registration ,attendance and deleting Cookie into a single one which will be controlled by frontend`
const express = require('express');
const cors = require('cors');
const path = require('path')
require('dotenv').config()
const crypto = require('crypto');
const cookieParser = require('cookie-parser');
const { PORT,HOSTPORT, SECRET_KEY, STUDENT_DETAILS_PATH, getLocalIP, attendanceDownloadPassword,log,red,yellow,green,interval} = require('./config/env')
const attendance = require('./attendance');
const deleteCookie = require('./deleteCookie');
const register = require('./register'); 

const host = express()
const app = express()

host.use(express.json());
host.use(cors());

host.use(cookieParser(SECRET_KEY));

host.use(express.static(path.join(__dirname, 'public/master')));

// host.get('/', (req, res) => {
//     res.send('This is the main server');
// });

localIP = getLocalIP();

// Start the server
const server = host.listen(HOSTPORT, '0.0.0.0', () => {
    log(green, `link -> http://${localIP}:${HOSTPORT}`);
});





















app.use(express.json());
app.use(cors());

// Use cookie-parser middleware
app.use(cookieParser(SECRET_KEY));

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public/static')));

// deleteCookie(app,PORT); 