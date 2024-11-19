const express = require('express');
const cors = require('cors');
const os = require('os');
const fs = require('fs');
const prompt = require('prompt-sync')();  // Initialize the prompt-sync function
const path = require('path')
const crypto = require('crypto');
require('dotenv').config()

let startTime;
let endTime;
const studentDetailsPath = process.env.STUDENT_DETAILS_PATH;
const PORT = process.env.PORT || 1111;
const SECRET_KEY = process.env.SECRET_KEY;
if (!studentDetailsPath) {
    console.error("Please create .env file in the project root and set STUDENT_DETAILS_PATH='path/to/student/details.json'")
    process.exit(0);
}
if (!SECRET_KEY) {
    console.error("Please create .env file in the project root and set SECRET_KEY")
    process.exit(0);
}
const app = express()
// Get the local IP address of the server
const localIP = getLocalIP();
// load the student details from the JSON file
const studentDetails = JSON.parse(fs.readFileSync(studentDetailsPath, 'utf8'));


let interval = 5 * 60; // in seconds
let currentRegistration = {};

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

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public/static')));

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

const handleRegistration = (hash, info) => {
    const details = studentDetails[hash];
    if (details == undefined) {
        console.log("Registering ", info.name);
        studentDetails[hash] = info;
        currentRegistration[hash] = info;
    } else {
        console.log(info.name, " tried to register twice");
        let errrorMessage;
        if (studentDetails[hash].name === info.name && (studentDetails[hash].usn === info.usn)) {
            errrorMessage = `${studentDetails[hash].name} is already registered`
            console.log(errrorMessage)
            const error = new Error(errrorMessage);
            error.code = 409;
            throw error;
        } else if (studentDetails[hash].name === info.name && (studentDetails[hash].usn !== info.usn)) {
            errrorMessage = `Your USN is ${studentDetails[hash].usn} right?<br>Please contact the admin if there is any issues.`
            console.log(errrorMessage)
            const error = new Error(errrorMessage);
            error.code = 409;
            throw error;
        } else {
            errrorMessage = `${studentDetails[hash].name} is trying to register ${info.name}.<br>THIS INCIDENT WILL BE REPORTED!!!!`
            console.log(errrorMessage)
            const error = new Error(errrorMessage);
            error.code = 409;
            throw error;
        }
    }
};

app.get('/', (req, res) => {
    const filePath = path.join(__dirname, 'public', 'register.html');
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send('Error reading the file.');
        }
        const registerUrl = `http://${localIP}:${PORT}/register`;
        let modifiedHtml = data.replace('%registerUrl%', registerUrl);
        modifiedHtml = modifiedHtml.replace('%timer%', String(WINDOWINTERVAL));
        res.send(modifiedHtml);
    });
});

// Handle form submission with cooldown logic
app.post('/register', (req, res) => {
    console.log("Received request");
    const { fingerprint, info } = req.body;
    if (!fingerprint) {
        return res.status(400).json({ message: "Fingerprint is required!" });
    }

    // Generate HMAC hash
    const hash = crypto.createHmac('sha256', SECRET_KEY)
        .update(fingerprint)
        .digest('hex');
    try {
        handleRegistration(hash, info)
    } catch (error) {
        if (error.code === 409) {
            console.log("Caught : ", error.message);
            return res.status(error.code).json({ message: error.message });
        }
    }
    res.status(200).json({ message: "Registration Sucessfull" });
});

// Start the server
const server = app.listen(PORT, '0.0.0.0', () => {
    startTime = new Date();
    console.log(`Server is running at http://${localIP}:${PORT}`);
});


const killServer = () => {
    endTime = new Date();
    const serverDuration = Math.floor((endTime - startTime) / 1000);
    console.log(`Shutting down the server after ${serverDuration} seconds...`);
    console.log("\n\n----------RESULT----------\n");
    console.log("Registerd Students in this session");
    // List the students who registered in this session
    for (const info of Object.values(currentRegistration)) {
        console.log(info.name);
    }
    fs.writeFileSync('attendance/info.json', JSON.stringify(studentDetails));
    console.log("\n--------------------------\n\n");
    console.log("Student details updated Succesfully!")
    server.close(() => {
        console.log('Server stopped gracefully.');
        process.exit(0);
    });
}

setTimeout(() => {
    killServer()
}, WINDOWINTERVAL);

process.on('SIGINT', () => {
    console.log('Performing cleanup...');
    killServer()
});