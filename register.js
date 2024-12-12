const express = require('express');
const cors = require('cors');
const os = require('os');
const fs = require('fs');
const prompt = require('prompt-sync')();  // Initialize the prompt-sync function
const path = require('path')
require('dotenv').config()
const crypto = require('crypto');
const cookieParser = require('cookie-parser');
const { PORT, SECRET_KEY, STUDENT_DETAILS_PATH, getLocalIP, getMacAddress } = require('./config/env')


let startTime;
let endTime;
const green = '\x1b[32m%s\x1b[0m' // for showing green output in the terminal
const yellow = '\x1b[33m%s\x1b[0m' // for showing yellow output in the terminal
const app = express()
// Get the local IP address of the server
const localIP = getLocalIP();
// load the student details from the JSON file
const studentDetails = JSON.parse(fs.readFileSync(STUDENT_DETAILS_PATH, 'utf8'));


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

// To keep track of the time left for the server to be active
let attendanceWindowDuration = interval * 1000;

// Decrease the time left every second
setInterval(() => {
    attendanceWindowDuration -= 1000
}, 1000);

app.use(express.json());
app.use(cors());

// Use cookie-parser middleware
app.use(cookieParser(SECRET_KEY));

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public/static')));

const generateID = () => {
    return crypto.randomBytes(16).toString('hex');
}

// Returns the student object if he already registered
const getAlreadyRegistered = (usn) => {
    const StudentValues = Object.values(studentDetails);
    const alreadyRegistered = StudentValues.find(student => student?.usn === usn);
    return alreadyRegistered
}


app.get('/', (req, res) => {
    const filePath = path.join(__dirname, 'public', 'register.html');
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send('Error reading the file.');
        }
        const registerUrl = `http://${localIP}:${PORT}/register`;
        let modifiedHtml = data.replace('%registerUrl%', registerUrl);
        modifiedHtml = modifiedHtml.replace('%timer%', String(attendanceWindowDuration));
        res.send(modifiedHtml);
    });
});


// const handleRegistration = (macAddress, info) => {
//     const details = studentDetails[macAddress];
//     if (details == undefined) {
//         console.log("Registering ", info.name);
//         studentDetails[macAddress] = info;
//         currentRegistration[macAddress] = info;
//     } else {
//         console.log(info.name, " tried to register twice");
//         let errrorMessage;
//         if (studentDetails[macAddress].name === info.name && (studentDetails[macAddress].usn === info.usn)) {
//             errrorMessage = `${studentDetails[macAddress].name} is already registered`
//             console.log(errrorMessage)
//             const error = new Error(errrorMessage);
//             error.code = 409;
//             throw error;
//         }else  if (studentDetails[macAddress].name === info.name &&(studentDetails[macAddress].usn !== info.usn)){
//             errrorMessage = `Your USN is ${studentDetails[macAddress].usn} right?<br>Please contact the admin if there is any issues.`
//             console.log(errrorMessage)
//             const error = new Error(errrorMessage);
//             error.code = 409;
//             throw error;
//         }else {
//             errrorMessage = `${studentDetails[macAddress].name} is trying to register ${info.name}.<br>THIS INCIDENT WILL BE REPORTED!!!!`
//             console.log(errrorMessage)
//             const error = new Error(errrorMessage);
//             error.code = 409;
//             throw error;
//     }
// }};

const handleRegistration = (id, info, res) => {
    // TODO: update the documentation for Mac Address
    // If the id (Cookie) is empty then he either cleared his browser info(Already Registered) or New Registration
    const alreadyRegistered = getAlreadyRegistered(info.usn);
    const details = studentDetails[id];
    if (details === undefined) {
        // Checking whether the student is already registered or not based on USN
        // If the user is not registered before a unique id is set to users Cookie and the registration completes
        if (!alreadyRegistered) {
            // Setting unique ID as Cookie 
            // const uniqueId = generateID()
            // res.cookie('id', uniqueId, { signed: true, maxAge: 4 * 365 * 24 * 60 * 60 * 1000, httpOnly: true }); //expiry time for 4 years
            studentDetails[id] = info;
            currentRegistration[id] = info;
            console.log(green, "Registering " + info.name);
        } // If the user is already registered he have to contact the admin to log him
        // This could have happened if he deleted his browser cookies or cache.
        // Solution : Delete the information about the student from student details json file. (Be careful ) 
        else if ((alreadyRegistered.name !== info.name)) {
            errorMessage = `${alreadyRegistered.usn} is already registered by ${alreadyRegistered.name}!<br>Please contact the admin if there is any issues.`
            console.error(`${info.name} is trying to register ${alreadyRegistered.usn}:${alreadyRegistered.name}`)
            const error = new Error(errorMessage);
            error.code = 409;
            throw error;
        } else {
            errorMessage = `${alreadyRegistered.usn} is already registered by ${alreadyRegistered.name}!<br>Please contact the admin if you want to login.`
            console.error(`${info.name} is trying to register ${alreadyRegistered.usn}:${alreadyRegistered.name}`)
            const error = new Error(errorMessage);
            error.code = 409;
            throw error;
        }
        // If the user has id (Cookie) then,
        // CASE 1: He may be trying to register again
        // CASE 2 : He may be trying to register again with another USN
        // CASE 3: He may be trying to register Others
        // CASE 4: His information is erased from Student Details
    } else {
        let errorMessage;
        // CASE 4: 
        // Solution for CASE4: Run the deleteCookie.js script to delete the cookie form this user and then run this (register.js) script to register him again
        if (studentDetails[id] === undefined) {
            errorMessage = "Your information is erased from the system. Please contact the admin."
            console.error(`${info.name}'s information is erased from the system`)
            const error = new Error(errorMessage);
            error.code = 409;
            throw error;
        }
        // CASE 1:
        if (studentDetails[id].name === info.name && (studentDetails[id].usn === info.usn)) {
            errorMessage = `${studentDetails[id].name} is already registered`
            console.log(yellow, errorMessage)
            const error = new Error(errorMessage);
            error.code = 409;
            throw error;
        }
        // CASE 2:
        else if (studentDetails[id].name === info.name && (studentDetails[id].usn !== info.usn)) {
            errorMessage = `Your USN is ${studentDetails[id].usn} right?<br>Please contact the admin if there is any issues.`
            const error = new Error(errorMessage);
            error.code = 409;
            throw error;
        }
        // CASE 3:
        else {
            errorMessage = `${studentDetails[id].name} is trying to register ${info.name}.<br>THIS INCIDENT WILL BE REPORTED!!!!`
            console.error(`${studentDetails[id].name} is trying to register ${info.name}`)
            const error = new Error(errorMessage);
            error.code = 409;
            throw error;
        }
    }
};


// Handle form submission with cool down logic
app.post('/register', async (req, res) => {
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    console.log(ip)
    try {
        const id = await getMacAddress(ip);
        console.log("Mac Address: ", id);
    } catch (err) {
        console.log(err)
    }
    res.send("Your request is being processed. Please wait for the response.");
    return
    const info = req.body.info;
    try {
        handleRegistration(id, info, res)
        return res.status(200).json({ message: "Registration Successful" });
    } catch (error) {
        if (error.code === 409) {
            return res.status(error.code).json({ message: error.message });
        }
    }
    res.status(500).json({ message: "Something Went Wrong Please Contact the Admin" });
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
    console.log(yellow, "\n--------------------------");
    console.log(yellow, "----------RESULT----------\n");
    console.log(green, "Registered Students in this session");
    // List the students who registered in this session
    for (const info of Object.values(currentRegistration)) {
        console.log(green, info.name);
    }
    fs.writeFileSync(STUDENT_DETAILS_PATH, JSON.stringify(studentDetails));
    console.log(yellow, "\n--------------------------");
    console.log(yellow, "--------------------------");
    console.log(green, "Student details updated Successfully!")
    server.close(() => {
        console.log(green, 'Server stopped gracefully.');
        process.exit(0);
    });
}

setTimeout(() => {
    killServer()
}, attendanceWindowDuration);

process.on('SIGINT', () => {
    console.log(yellow, 'Performing cleanup...');
    killServer()
});