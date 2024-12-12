require('dotenv').config();
const os = require('os');
const arp = require('node-arp');

const SECRET_KEY = process.env.SECRET_KEY;
const STUDENT_DETAILS_PATH = process.env.STUDENT_DETAILS_PATH_cookie;
const PORT = process.env.PORT || 1111;
let OUTPUT_FILE_PATH = process.env.OUTPUT_FILE_PATH;

// This will be asked when tried to download the attendance details from the web interface
const attendanceDownloadPassword = Math.floor(Math.random() * 9000) + 1000

if (!STUDENT_DETAILS_PATH) {
    console.error("Please create .env file in the project root and set STUDENT_DETAILS_PATH='path/to/student/details.json'")
    process.exit(0);
}
if (!SECRET_KEY) {
    console.error("Please create .env file in the project root and set SECRET_KEY'")
    process.exit(0);
}
if (!OUTPUT_FILE_PATH) {
    console.error("Please create .env file in the project root and set OUTPUT_FILE_PATH")
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

// Function to fetch MAC address based on IP
const getMacAddress = async (ip) => {
    console.log("first line of getMacAddress")
    return new Promise((resolve, reject) => {
        arp.getMAC(ip, (err, mac) => {
            if (err || !mac) {
                reject(`Could not fetch MAC address for IP: ${ip}`);
            } else {
                resolve(mac);
            }
        });
    });
};

module.exports = { PORT, SECRET_KEY, STUDENT_DETAILS_PATH, getLocalIP,getMacAddress, attendanceDownloadPassword, OUTPUT_FILE_PATH};
