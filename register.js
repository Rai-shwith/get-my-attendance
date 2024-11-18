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
const SECRET_KEY = process.env.SECRET_KEY;
const studentDetailsPath = process.env.STUDENT_DETAILS_PATH;
const PORT = process.env.PORT || 1111;
if (!studentDetailsPath) {
    console.log("Please create .env file in the project root and set STUDENT_DETAILS_PATH='path/to/student/details.json'")
    process.exit(0);
}
if (!SECRET_KEY) {
    console.log("Please create .env file in the project root and set SECRET_KEY'")
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

// Use cookie-parser middleware
app.use(cookieParser(SECRET_KEY));

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

const generateID = () => {
    return crypto.randomBytes(16).toString('hex');
}

// Returns the student object if he already registerd
const getAlreadyRegistered = (usn) => {
    console.log(usn);
    const StudentValues = Object.values(studentDetails);
    const alreadyRegistered = StudentValues.find(student => student?.usn === usn);
    console.log(alreadyRegistered)
    return alreadyRegistered
}

const handleRegistration = (id, info, res) => {
    // If the id (Cookie) is empty then he either cleared his browser info(Already Registered) or New Registration
    if (id === undefined) {
        // Checking wheather the student is already registed or not based on USN
        const alreadyRegistered = getAlreadyRegistered(info.usn);
        // If the user is not registerd before a unique id is set to users Cookie and the registration completes
        if (!alreadyRegistered) { 
            // Setting unique ID as Cookie 
            const uniqueId = generateID()
            res.cookie('id', uniqueId, { signed: true, maxAge: 4 * 365 * 24 * 60 * 60 * 1000, httpOnly: true }); //expiry time for 4 years
            studentDetails[uniqueId] = info;
            currentRegistration[uniqueId] = info;
            console.log(green, "Registering " + info.name);
        } // If the user is already registered he have to contact the admin to log him
        else if ((alreadyRegistered.name !== info.name)){
            errrorMessage = `${alreadyRegistered.usn} is already registered by ${alreadyRegistered.name}!<br>Please contact the admin if there is any issues.`
            console.error(`${info.name} is trying to register ${alreadyRegistered.usn}:${alreadyRegistered.name}`)
            const error = new Error(errrorMessage);
            error.code = 409;
            throw error;
        }else{
            errrorMessage = `${alreadyRegistered.usn} is already registered by ${alreadyRegistered.name}!<br>Please contact the admin if you want to login.`
            console.error(`${info.name} is trying to register ${alreadyRegistered.usn}:${alreadyRegistered.name}`)
            const error = new Error(errrorMessage);
            error.code = 409;
            throw error;
        }
// If the user has id (Cookie) then,
    // CASE 1: He may be trying to register again
    // CASE 2 : He may be trying to register again with another USN
    // CASE 3: Register Others
    } else {
        let errrorMessage;
        console.error(studentDetails[id].name, " tried to register twice");
        // CASE 1:
        if (studentDetails[id].name === info.name && (studentDetails[id].usn === info.usn)) {
            errrorMessage = `${studentDetails[id].name} is already registered`
            console.error(errrorMessage)
            const error = new Error(errrorMessage);
            error.code = 409;
            throw error;
        }
        // CASE 2:
         else if (studentDetails[id].name === info.name && (studentDetails[id].usn !== info.usn)) {
            errrorMessage = `Your USN is ${studentDetails[id].usn} right?<br>Please contact the admin if there is any issues.`
            const error = new Error(errrorMessage);
            error.code = 409;
            throw error;
         } 
         // CASE 3:
        else {
            errrorMessage = `${studentDetails[id].name} is trying to register ${info.name}.<br>THIS INCIDENT WILL BE REPORTED!!!!`
            console.error(`${studentDetails[id].name} is trying to register ${info.name}`)
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
    // const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const id = req.signedCookies.id;
    console.log(id);
    const info = req.body.info;

    try {
        handleRegistration(id, info, res)
    } catch (error) {
        if (error.code === 409) {
            // console.log("Caught : ", error.message);
            return res.status(error.code).json({ message: error.message });
        }
    }
    // console.log("Registration Successfull")
    res.status(200).json({ message: "Registration Successfull" });
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
    fs.writeFileSync(filePath, JSON.stringify(studentDetails));
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