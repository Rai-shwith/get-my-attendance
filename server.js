const os = require('os');
const path = require('path');
const express = require('express');
const cors = require('cors');
const fs = require("fs");
const prompt = require('prompt-sync')();  // Initialize the prompt-sync function

let interval = 5 * 60; // in seconds

// Ask for the input and wait synchronously
const time = prompt('Enter the duration (in minutes) for recording attendance:');

if (time.trim() === "") {
    console.log("Default duration -> 5 min");
} else {
    interval = parseInt(time) * 60; // Convert minutes to seconds
    console.log(`Server will be active for ${time} minutes`);
}

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

const app = express();
const localIP = getLocalIP();
const PORT = 80;
let totalCount = 0;

// Middleware
app.use(express.json());
app.use(cors());

// Cooldown data
const attendedList = new Set();
const proxyList = new Set();
let WINDOWINTERVAL = interval * 1000;

setInterval(() => {
    WINDOWINTERVAL -= 1000
}, 1000);

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public/static')));

// Route to serve the main HTML file
app.get('/', (req, res) => {
    const filePath = path.join(__dirname, 'public', 'index.html');
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send('Error reading the file.');
        }
        const submitUrl = `http://${localIP}:${PORT}/submit`;
        let modifiedHtml = data.replace('%submitUrl%', submitUrl);
        modifiedHtml = modifiedHtml.replace('%timer%', String(WINDOWINTERVAL));
        res.send(modifiedHtml);
    });
});

// Handle form submission with cooldown logic
app.post('/submit', (req, res) => {
    console.log("Entering submit")
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const now = Date.now();

    if (attendedList.has(ip)) {
        proxyList.add(ip)
        return res.status(429).json({ message: "Attendance already taken!.<br>THIS INCIDENT WILL BE REPORTED!!!" });
    }

    attendedList.add(ip);
    totalCount += 1
    const number = req.body.number;
    console.log(`Received number: ${number} from ${ip}`);
    res.status(200).send("success");
});

// Start the server
const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`Attendance link -> ${localIP}`);
    console.log(`Personal link -> localhost`);
});


setTimeout(() => {
    const proxyCount = proxyList.size;
    console.log(`Shutting down the server after ${interval} seconds...`);
    console.log('Total connections established', totalCount);
    console.log('Those who tried to give proxy', proxyCount);
    server.close(() => {
        console.log('Server stopped gracefully.');
        process.exit(0);
    });
}, WINDOWINTERVAL);