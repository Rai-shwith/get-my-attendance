require('dotenv').config();
const os = require('os');
const prompt = require('prompt-sync')();  // Initialize the prompt-sync function

const SECRET_KEY = process.env.SECRET_KEY;
const STUDENT_DETAILS_PATH = process.env.STUDENT_DETAILS_PATH_cookie;
const PORT = process.env.PORT || 1111;
let OUTPUT_FILE_PATH = process.env.OUTPUT_FILE_PATH;
const ENABLE_LOGGING = process.env.ENABLE_LOGGING.trim()==('true') ? true: false; // Disable logging by default

const green = '\x1b[32m%s\x1b[0m' // for showing green output in the terminal
const yellow = '\x1b[33m%s\x1b[0m' // for showing yellow output in the terminal
const red = '\x1b[31m' // for showing red output in the terminal


function log(...message) {
    if (ENABLE_LOGGING) {
        console.log(...message);
    }
}
// This will be asked when tried to download the attendance details from the web interface
const attendanceDownloadPassword = Math.floor(Math.random() * 9000) + 1000

if (!STUDENT_DETAILS_PATH) {
    log(red, "Please create .env file in the project root and set STUDENT_DETAILS_PATH='path/to/student/details.json'")
    process.exit(0);
}
if (!SECRET_KEY) {
    log(red, "Please create .env file in the project root and set SECRET_KEY'")
    process.exit(0);
}
if (!OUTPUT_FILE_PATH) {
    log(red, "Please create .env file in the project root and set OUTPUT_FILE_PATH")
    process.exit(0);
}

const getLocalIP = () => {
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
};

let interval = 5 * 60; // in seconds
if (ENABLE_LOGGING) {
    // Ask for the input and wait synchronously
    const time = prompt('Enter the duration (in minutes) :');

    if (time.trim() === "") {
        log("Default duration -> 5 min");
    } else {
        interval = parseInt(time) * 60; // Convert minutes to seconds
        log(`Server will be active for ${time} minutes`);
    }
}
module.exports = { PORT, SECRET_KEY, STUDENT_DETAILS_PATH, getLocalIP, attendanceDownloadPassword, OUTPUT_FILE_PATH, log, red, yellow, green, interval };
