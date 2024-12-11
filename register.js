const { PORT, SECRET_KEY, STUDENT_DETAILS_PATH, getLocalIP, attendanceDownloadPassword,log,red,yellow,green,interval} = require('./config/env')
const fs = require('fs');
const path = require('path')

const register = (app,PORT) => {
    
// Get the local IP address of the server
const localIP = getLocalIP();

// load the student details from the JSON file
const studentDetails = JSON.parse(fs.readFileSync(STUDENT_DETAILS_PATH, 'utf8'));

// To keep track of the time left for the server to be active
let attendanceWindowDuration = interval * 1000;

// Decrease the time left every second
setInterval(() => {
    attendanceWindowDuration -= 1000
}, 1000);

let startTime;
let endTime;

let currentRegistration = {};

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

    const handleRegistration = (id, info, res) => {
        // If the id (Cookie) is empty then he either cleared his browser info(Already Registered) or New Registration
        const alreadyRegistered = getAlreadyRegistered(info.usn);
        if (id === undefined) {
            // Checking whether the student is already registered or not based on USN
            // If the user is not registered before a unique id is set to users Cookie and the registration completes
            if (!alreadyRegistered) {
                // Setting unique ID as Cookie 
                const uniqueId = generateID()
                res.cookie('id', uniqueId, { signed: true, maxAge: 4 * 365 * 24 * 60 * 60 * 1000, httpOnly: true }); //expiry time for 4 years
                studentDetails[uniqueId] = info;
                currentRegistration[uniqueId] = info;
                log(green, "Registering " + info.name);
            } // If the user is already registered he have to contact the admin to log him
            // This could have happened if he deleted his browser cookies or cache.
            // Solution : Delete the information about the student from student details json file. (Be careful ) 
            else if ((alreadyRegistered.name !== info.name)) {
                errorMessage = `${alreadyRegistered.usn} is already registered by ${alreadyRegistered.name}!<br>Please contact the admin if there is any issues.`
                log(red, `${info.name} is trying to register ${alreadyRegistered.usn}:${alreadyRegistered.name}`)
                const error = new Error(errorMessage);
                error.code = 409;
                throw error;
            } else {
                errorMessage = `${alreadyRegistered.usn} is already registered by ${alreadyRegistered.name}!<br>Please contact the admin if you want to login.`
                log(red, `${info.name} is trying to register ${alreadyRegistered.usn}:${alreadyRegistered.name}`)
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
                log(red, `${info.name}'s information is erased from the system`)
                const error = new Error(errorMessage);
                error.code = 409;
                throw error;
            }
            // CASE 1:
            if (studentDetails[id].name === info.name && (studentDetails[id].usn === info.usn)) {
                errorMessage = `${studentDetails[id].name} is already registered`
                log(yellow, errorMessage)
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
                log(red, `${studentDetails[id].name} is trying to register ${info.name}`)
                const error = new Error(errorMessage);
                error.code = 409;
                throw error;
            }
        }
    };


    // Handle form submission with cool down logic
    app.post('/register', (req, res) => {
        // const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
        const id = req.signedCookies.id;
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
        log(green, `link -> http://${localIP}:${PORT}`);
    });


    const killServer = () => {
        endTime = new Date();
        const serverDuration = Math.floor((endTime - startTime) / 1000);
        log(`Shutting down the server after ${serverDuration} seconds...`);
        log(yellow, "\n--------------------------");
        log(yellow, "----------RESULT----------\n");
        log(green, "Registered Students in this session");
        // List the students who registered in this session
        for (const info of Object.values(currentRegistration)) {
            log(green, info.name);
        }
        fs.writeFileSync(STUDENT_DETAILS_PATH, JSON.stringify(studentDetails));
        log(yellow, "\n--------------------------");
        log(yellow, "--------------------------");
        log(green, "Student details updated Successfully!")
        server.close(() => {
            log(green, 'Server stopped gracefully.');
            process.exit(0);
        });
    }

    setTimeout(() => {
        killServer()
    }, attendanceWindowDuration);

    process.on('SIGINT', () => {
        log(yellow, 'Performing cleanup...');
        killServer()
    });
}

module.exports = register;