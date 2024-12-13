`This Script is used to combine registration ,attendance and deleting Cookie into a single one which will be controlled by frontend`
const express = require('express');
const cors = require('cors');
const path = require('path')
require('dotenv').config()
const crypto = require('crypto');
const cookieParser = require('cookie-parser');
const { PORT, HOSTPORT, SECRET_KEY, STUDENT_DETAILS_PATH, getLocalIP, attendanceDownloadPassword, log, red, yellow, green, interval } = require('./config/env')
const {startAttendance, endAttendance, closeServer} = require('./attendance');
const deleteCookie = require('./deleteCookie');
const register = require('./register');
const { link } = require('pdfkit');

const isAppServing = false; // Flag to check if the app is serving or not
let service; // Service name
let server ; // Server object

const host = express()
const app = express()

host.use(express.json());
host.use(cors());
host.use(cookieParser(SECRET_KEY));
host.use(express.static(path.join(__dirname, 'public/master')));

app.use(express.json());
app.use(cors());
app.use(cookieParser(SECRET_KEY));



localIP = getLocalIP();

// Start the server
const hostServer = host.listen(HOSTPORT, '0.0.0.0', () => {
    log(green, `link -> http://${localIP}:${HOSTPORT}`);
});



host.post('/start', (res, req) => {
    if (isAppServing) {
        res.status(400).json({message:'Server is already serving'});
        return;
    }
    const { serverObject } = req.body;
    if (serverObject === undefined) {
        res.status(400).json({message:'Invalid request'});
        return;
    }
    if (serverObject == 'attendance') {
        service = 'attendance';
        server = startAttendance(app, PORT);
    } else if (serverObject == 'register') {
        service = 'register';
        server = register(app, PORT);
    } else if (serverObject == 'deleteCookie') {
        service='deleteCookie';
        server = deleteCookie(app, PORT);
    } else {
        res.status(400).send('Invalid request');
        return;
    }
    isAppServing = true;
    res.status(200).json({ message: 'Server started', service: serverObject,link: `http://${localIP}:${PORT}` });
});

host.get('/end', (res, req) => {
    if (!isAppServing) {
        res.status(400).send('Server is not serving');
        return;
    }
    if (service === 'attendance') {
        endAttendance(server);
    } else if (service === 'register') {
        closeServer(server);
    } else if (service === 'deleteCookie') {
        closeServer(server);
    }
    isAppServing = false;
    res.status(200).send('Server stopped');
});


host.get('/', (res, req) => {
});

















app.use(express.json());
app.use(cors());

// Use cookie-parser middleware
app.use(cookieParser(SECRET_KEY));

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public/static')));

// deleteCookie(app,PORT); 