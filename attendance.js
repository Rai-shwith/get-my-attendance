const os = require('os');
const express = require('express');
const cors = require('cors');
const fs = require("fs");
const prompt = require('prompt-sync')();  // Initialize the prompt-sync function
const generatePDF = require('./pdfGenerator');
require('dotenv').config();
const crypto = require('crypto');

let interval = 5 * 60; // in seconds
let startTime;
let endTime;
const outputFilePath = process.env.OUTPUT_FILE_PATH;
const studentDetailsPath = process.env.STUDENT_DETAILS_PATH_canvas;
const PORT = process.env.PORT || 1111;
const SECRET_KEY = process.env.SECRET_KEY;


if (!outputFilePath) {
    console.log("Please create .env file in the project root and set OUTPUT_FILE_PATH")
    process.exit(0);
}
if (!studentDetailsPath) {
    console.log("Please create .env file in the project root and set STUDENT_DETAILS_PATH='path/to/student/details.json'")
    process.exit(0);
}
if (!SECRET_KEY) {
    console.log("Please create .env file in the project root and set SECRET_KEY'")
    process.exit(0);
}
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

// To display how much time left
setInterval(() => {
    WINDOWINTERVAL -= 1000
}, 1000);

// To keep track of students who gave attendance
const presentList = new Object();
// Load the student details from the file
const studentDetails = JSON.parse(fs.readFileSync(studentDetailsPath, 'utf8'));

// Middleware
app.use(express.json());
app.use(cors());

// Server uptime in milliseconds
let WINDOWINTERVAL = interval * 1000;

const getHTML = (condition, name, usn) => {
    let color, message;
    let hideInfo = false;
    if (condition === "alreadyGiven") {
        color = "#f44336";
        message = "Attendance already taken!";
    } else if (condition === "notRegistered") {
        hideInfo = true;
        color = "#ff9800";
        message = "You are not registered for this class!";
    } else {
        color = "#4caf50";
        message = "Attendance taken successfully!";
    }
    htmlString = `<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Attendance</title>
    <style>
        body {
            margin: 0;
            padding: 0;
            font-family: 'Arial', sans-serif;
            background: linear-gradient(135deg, #6a11cb, #2575fc);
            color: #fff;
            display: flex;
            flex-direction: column;
            align-items: center;
            height: 100vh;
        }

        h1 {
            color: ${color}

            ;
            font-size: 2.5rem;
            margin-bottom: 20px;
        }

        .container {
            margin-top: 3em;
            width: 75vw;
            text-align: center;
            background: rgba(255, 255, 255, 0.1);
            padding: 20px 40px;
            border-radius: 12px;
            box-shadow: 0px 8px 15px rgba(0, 0, 0, 0.2);
        }

        header {
            text-align: center;
            margin-top: 10px;
            width: 90vw;
            background: rgba(255, 255, 255, 0.1);
            padding: 20px 40px;
            border-radius: 12px;
            box-shadow: 0px 8px 15px rgba(0, 0, 0, 0.2);
        }
    </style>
</head>

<body class="column">
    <header >Time remaining : <span id="timer" style="color: red;">${WINDOWINTERVAL}</span></header>
    <div class="container">
        <h1>${message}</h1>
    </div>
    <br>
    <div class="container" ${hideInfo ? 'hidden' : ''}>
        <section>
            <h2>${name} : ${usn}</h2>
        </section>
    </div>
    <script>
        const totalTime = document.getElementById('timer').innerText;
        function startTimer(timeString) {
            // Parse the input time string to milliseconds
            let totalMilliseconds = Number(timeString);

            // Create a reference to the DOM element where you want to display the timer
            const timerDisplay = document.getElementById("timer");

            // Function to update the time and display it
            function updateTimer() {
                console.log("Timer Started")
                if (totalMilliseconds <= 0) {
                    clearInterval(timerInterval); // Stop the timer when it reaches 0
                    timerDisplay.innerHTML = "Time's up!";
                } else {
                    totalMilliseconds -= 1000; // Decrease the time by 1 second (1000ms)

                    let minutesLeft = Math.floor(totalMilliseconds / 60000); // Get minutes
                    let secondsLeft = Math.floor((totalMilliseconds % 60000) / 1000); // Get seconds

                    // Format the time in "mm:ss"
                    timerDisplay.innerHTML = \`${"${String(minutesLeft).padStart(2, '0')}"}:${"${String(secondsLeft).padStart(2, '0')}"}\`;
                }
            }

            // Start the interval to update the timer every second (1000ms)
            const timerInterval = setInterval(updateTimer, 1000);

            // Initial call to display the starting time
            updateTimer();
        }
        startTimer(totalTime);   
    </script>
</body>

</html>`
    return htmlString;
}

// Route to serve the main HTML file
app.get('/', (req, res) => {
    const html = `
    <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Register</title>
</head>
<body>
    <script>
    // Generate canvas fingerprint
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        ctx.textBaseline = "top";
        ctx.font = "14px Arial";
        ctx.fillText("get-my-attendance", 2, 2);

        // Get the canvas data URL (the fingerprint)
        const fingerprint = canvas.toDataURL();
         // Send the hash to the backend
    fetch('/get-my-attendance', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fingerprint}),
    })
    .then(response =>  response.text())
    .then(html =>  {
        document.open();        
        document.write(html);  
        document.close();
        })
    .catch(err => console.error("Error sending fingerprint:", err));
        </script>
</body>
</html>`
    return res.status(200).send(html);
});


app.post('/get-my-attendance', (req, res) => {
    const { fingerprint } = req.body;
    // Generate HMAC hash
    const hash = crypto.createHmac('sha256', SECRET_KEY)
        .update(fingerprint)
        .digest('hex');
    if (presentList[hash]) {
        console.log(presentList[hash].name + " already gave attendance!");
        const html = getHTML("alreadyGiven", presentList[hash].name, presentList[hash].usn);
        return res.status(429).send(html);
    }
    if (!studentDetails[hash]) {
        console.log(hash + " is not registered for this class!");
        const html = getHTML("notRegistered");
        return res.status(403).send(html);
    }
    const html = getHTML("normal", studentDetails[hash].name, studentDetails[hash].usn);
    presentList[hash] = studentDetails[hash];
    console.log(`Attendance given to ${presentList[hash].name} [${presentList[hash].usn}]`);
    return res.status(200).send(html);
});

// Start the server
const server = app.listen(PORT, '0.0.0.0', () => {
    startTime = new Date();
    console.log(`Attendance link -> http://${localIP}:${PORT}`);
});


const killServer = async () => {
    endTime = new Date();
    const serverDuration = Math.floor((endTime - startTime) / 1000);
    console.log(`Shutting down the server after ${serverDuration} seconds...`);

    const absentList = {};
    for (const ip in studentDetails) {
        if (!presentList[ip]) {
            absentList[ip] = studentDetails[ip];
        }
    }

    console.log("\n----------RESULT----------");
    console.log("\n----------PRESENT----------");
    Object.values(presentList).forEach(({ usn, name }) => console.log(`${usn} : ${name}`));
    console.log("\n----------ABSENT----------");
    Object.values(absentList).forEach(({ usn, name }) => console.log(`${usn} : ${name}`));

    try {
        console.log("Generating PDF...");
        await generatePDF(outputFilePath, presentList, absentList); // Wait for PDF generation
        console.log("PDF successfully generated!");
    } catch (err) {
        console.error("Error during PDF generation:", err);
    }

    server.close(() => {
        console.log('Server stopped gracefully.');
        process.exit(0);
    });
};





let isShuttingDown = false;

const shutdownHandler = async () => {
    if (isShuttingDown) {
        console.log("Server is already shutting down. Please wait...");
        return;
    }
    isShuttingDown = true;
    console.log("Initiating server shutdown...");
    await killServer();
};

// Set a timeout to call the shutdown handler
setTimeout(() => {
    shutdownHandler();
}, WINDOWINTERVAL);

// Handle SIGINT for graceful shutdown
process.on("SIGINT", async () => {
    console.log("Performing cleanup due to SIGINT...");
    await shutdownHandler();
});
