const express = require('express');
const cors = require('cors');
const os = require('os');
const fs = require('fs');
const prompt = require('prompt-sync')();  // Initialize the prompt-sync function
const path = require('path')
require('dotenv').config()
const arp = require('node-arp');

let startTime;
let endTime;
const studentDetailsPath = process.env.STUDENT_DETAILS_PATH;
const PORT = process.env.PORT || 1111;
if (!studentDetailsPath) {
    console.log("Please create .env file in the project root and set STUDENT_DETAILS_PATH='path/to/student/details.json'")
    process.exit(0);
}

const app = express()
// Get the local IP address of the server
const localIP = getLocalIP();
// load the student details from the JSON file
const studentDetails = JSON.parse(fs.readFileSync(studentDetailsPath, 'utf8'));


let interval = 5 * 60; // in seconds
const totalRegistrationCount = studentDetails.length;
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

// Function to fetch MAC address based on IP
const getMacAddress = (ip) => {
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

const handleRegistration = (macAddress, info) => {
    const details = studentDetails[macAddress];
    if (details == undefined) {
        console.log("Registering ", info.name);
        studentDetails[macAddress] = info;
        currentRegistration[macAddress] = info;
    } else {
        console.log(info.name, " tried to register twice");
        let errrorMessage;
        if (studentDetails[macAddress].name === info.name && (studentDetails[macAddress].usn === info.usn)) {
            errrorMessage = `${studentDetails[macAddress].name} is already registered`
            console.log(errrorMessage)
            const error = new Error(errrorMessage);
            error.code = 409;
            throw error;
        }else  if (studentDetails[macAddress].name === info.name &&(studentDetails[macAddress].usn !== info.usn)){
            errrorMessage = `Your USN is ${studentDetails[macAddress].usn} right?<br>Please contact the admin if there is any issues.`
            console.log(errrorMessage)
            const error = new Error(errrorMessage);
            error.code = 409;
            throw error;
        }else {
            errrorMessage = `${studentDetails[macAddress].name} is trying to register ${info.name}.<br>THIS INCIDENT WILL BE REPORTED!!!!`
            console.log(errrorMessage)
            const error = new Error(errrorMessage);
            error.code = 409;
            throw error;
    }
}};

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
app.post('/register', async (req, res) => {
    console.log("Received request");
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const info = req.body.info;
    let macAddress;
    try {
        macAddress = await getMacAddress(ip);
        console.log(`Client IP: ${clientIP}, MAC Address: ${macAddress}`);
        handleRegistration(macAddress, info)
    } catch (error) {
        if (error.code === 409) {
            console.log("Caught : ",error.message);
            return res.status(error.code).json({ message:error.message});
        }
        console.error(error);
        return res.status(500).send(error);
    }

    // try {
    //     handleRegistration(ip, info)
    // } catch (error) {
    //     if (error.code === 409) {
    //         console.log("Caught : ",error.message);
    //         return res.status(error.code).json({ message:error.message});
    //     }
    // }
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