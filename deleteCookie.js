`
USE THIS SCRIPT WITH CAUTION:
This script is used to remove the id Cookie from the browser.
After running this script, the user can not give attendance untill he registers again and students info must be deleted from attendance info mannually.
`
const express = require('express');
const cors = require('cors');
const os = require('os');
const fs = require('fs');
const prompt = require('prompt-sync')();  // Initialize the prompt-sync function
const path = require('path')
require('dotenv').config()
const crypto = require('crypto');
const cookieParser = require('cookie-parser');

let startTime;
let endTime;
const green = '\x1b[32m%s\x1b[0m' // for showing green output in the terminal
const yellow = '\x1b[33m%s\x1b[0m' // for showing yellow output in the terminal
const SECRET_KEY = process.env.SECRET_KEY;
const PORT = process.env.PORT || 1111;
if (!SECRET_KEY) {
    console.error("Please create .env file in the project root and set SECRET_KEY'")
    process.exit(0);
}
const app = express()
// Get the local IP address of the server
const localIP = getLocalIP();
// load the student details from the JSON file


let interval = 5 * 60; // in seconds

// Ask for the input and wait synchronously
const time = prompt('Enter the duration (in minutes) for recording attendance:');

if (time.trim() === "") {
    console.log("Default duration -> 5 min");
} else {
    interval = parseInt(time) * 60; // Convert minutes to seconds
    console.log(`Server will be active for ${time} minutes`);
}

let WINDOWINTERVAL = interval * 1000;

setInterval(() => {
    WINDOWINTERVAL -= 1000
}, 1000);

app.use(express.json());
app.use(cors());

// Use cookie-parser middleware
app.use(cookieParser(SECRET_KEY));


function getLocalIP() {
    const interfaces = os.networkInterfaces();
    let localIP = '0.0.0.0'; // Default fallback IP in case no valid address is found

    // Loop through all network interfaces
    for (const iface in interfaces) {
        for (const alias of interfaces[iface]) {
            // Check if the alias is IPv4 and not internal (loopback address)
            if (alias.family === 'IPv4' && !alias.internal) {
                localIP = alias.address; // Use the first non-internal IPv4 address
                break; // Stop further searching once a valid IP is found
            }
        }
        if (localIP !== '0.0.0.0') break; // If a valid IP is found, exit the loop
    }

    return localIP;
}




app.get('/', (req, res) => {
    res.clearCookie('id');
    // Confirmation message
    res.status(200).send(`<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Attendance</title><style>body {margin: 0;padding: 0;font-family: 'Arial', sans-serif;background: linear-gradient(135deg, #6a11cb, #2575fc);color: #fff;display: flex;flex-direction: column;align-items: center;justify-content: center;height: 100vh;}.container {color: chartreuse;width: 75vw;text-align: center;background: rgba(255, 255, 255, 0.1);padding: 20px 40px;border-radius: 12px;box-shadow: 0px 8px 15px rgba(0, 0, 0, 0.2);}</style></head><body><div class="container"><section><h2>Now you have to register again</h2></section></div></body></html>`);
});


// Start the server
const server = app.listen(PORT, '0.0.0.0', () => {
    startTime = new Date();
    console.log(green, `link -> http://${localIP}:${PORT}`);
});


const killServer = () => {
    endTime = new Date();
    const serverDuration = Math.floor((endTime - startTime) / 1000);
    console.log(`Shutting down the server after ${serverDuration} seconds...`);
    server.close(() => {
        console.log(green, 'Server stopped gracefully.');
        process.exit(0);
    });
}

setTimeout(() => {
    killServer()
}, WINDOWINTERVAL);

process.on('SIGINT', () => {
    console.log(yellow, 'Performing cleanup...');
    killServer()
});