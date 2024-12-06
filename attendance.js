const os = require('os');
const express = require('express');
const cors = require('cors');
const fs = require("fs");
const prompt = require('prompt-sync')();  // Initialize the prompt-sync function
const generatePDF = require('./pdfGenerator');
require('dotenv').config();
const cookieParser = require('cookie-parser');
const path = require('path');
const { PORT, SECRET_KEY, STUDENT_DETAILS_PATH, getLocalIP, attendanceDownloadPassword } = require('./config/env')
let { OUTPUT_FILE_PATH } = require('./config/env')


let interval = 5 * 60; // in seconds
let startTime;
let endTime;
const green = '\x1b[32m%s\x1b[0m' // for showing green output in the terminal
const yellow = '\x1b[33m%s\x1b[0m' // for showing yellow output in the terminal

// Ask for the input and wait synchronously
const time = prompt('Enter the duration (in minutes) for recording attendance:');

if (time.trim() === "") {
    console.log("Default duration -> 5 min");
} else {
    interval = parseInt(time) * 60; // Convert minutes to seconds
    console.log(`Server will be active for ${time} minutes`);
}


const app = express();
const localIP = getLocalIP();

// To display how much time left
setInterval(() => {
    attendanceWindowDuration -= 1000
}, 1000);

// To keep track of students who gave attendance
const presentList = new Object();
// Load the student details from the file
const studentDetails = JSON.parse(fs.readFileSync(STUDENT_DETAILS_PATH, 'utf8'));

// Middleware
app.use(express.json());
app.use(cors());
// Use cookie-parser middleware
app.use(cookieParser(SECRET_KEY));

// Server uptime in milliseconds
let attendanceWindowDuration = interval * 1000;

const getHTML = (condition, name, usn) => {
    let color, message;
    let hideInfo = false;
    let showReasons = false;
    if (condition === "alreadyGiven") {
        color = "#ff9800";
        message = "Attendance already taken! 🙅‍♂️";
    } else if (condition === "notRegistered") {
        showReasons = true;
        hideInfo = true;
        color = "#f44336";
        message = "You are not registered! 📋<br> Please contact the admin. 👨‍💻";
    } else if (condition === "detailsMissing") {
        // This is the rare case when the details of student is removed from the Attendance info
        hideInfo = true;
        color = "#f44336";
        message = "Your details are missing! 🕵️‍♂️<br> Please register again. 🔄";
    } else {
        color = "#4caf50";
        message = "Attendance taken successfully! ✅";
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
    <header >Time remaining : <span id="timer" style="color: red;">${attendanceWindowDuration}</span></header>
    <div class="container">
        <h1>${message}</h1>
        <h2 style="text-align: left;" ${showReasons ? '' : 'hidden'}>Reasons :
    <ul>
        <li>You did not register</li>
        <li>You registered in incognito mode</li>
        <li>You registered in another Browser</li>
        <li>You cleared the Cookies or Browser cache</li>
    </ul>
</h2>
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
    if (isShuttingDown) {
        // When the attendance portal is shutting down server different html 
        let container;
        if (isShuttingDown) {
            container = `<div class="container">
            <h1>Attendance Details</h1>
            <form id="downloadForm">
                <input type="password" id="password" name="number" placeholder="Enter the password" required>
                <button id="submitBtn" type="submit">Download</button>
                <p id="message" class="hidden">😑</p>
            </form>
        </div>`;
        } else {
            container = `<div class="container">
            <h1>Attendance is currently in progress. Please return once it is completed.</h1>
        </div>`
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
                font-size: 2.5rem;
                margin-bottom: 20px;
            }
    
            .container {
                margin: auto 3%;
                text-align: center;
                background: rgba(255, 255, 255, 0.1);
                padding: 20px 40px;
                border-radius: 12px;
                box-shadow: 0px 8px 15px rgba(0, 0, 0, 0.2);
            }
    
            button {
                padding: 10px 20px;
                font-size: 1rem;
                color: #fff;
                background-color: #4caf50;
                border: none;
                border-radius: 6px;
                cursor: pointer;
                transition: background-color 0.3s ease;
            }
    
            button:hover {
                background-color: #45a049;
            }
    
            button:active {
                transform: scale(1.2);
            }
    
            form {
                display: flex;
                flex-direction: column;
                align-items: center;
            }
            #message{
                color: #ff3838;
            }
            input[type="password"],
            [type="text"] {
                padding: 10px;
                width: 80%;
                margin-bottom: 20px;
                border: none;
                border-radius: 6px;
                font-size: 1rem;
                outline: none;
                box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
            }
            .hidden{
                visibility: hidden;
            }
        </style>
    </head>
    
    <body>
        ${container}
        <script>
            const message = document.getElementById('message');
            const downloadForm = document.getElementById('downloadForm');
            downloadForm.addEventListener('submit', async (e) => {
                e.preventDefault();  // Prevent page refresh when the numberForm is submitted
        
                // Get the password
                const password = document.getElementById('password').value.trim();
        
                console.log("Sending Download Request with Password =", password);
        
                fetch('/pdf',{
                    method:'POST',
                    headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({password}),
                })
                    .then(response => {
                            if (response.status == 400) {
                                message.innerText = '😑Incorrect Password😑'
                                message.classList.remove('hidden');
                                setTimeout(() => {
                                    message.classList.add('hidden');
                                }, 5000);
                                throw new Error('Incorrect Password');
                            } else if (!response.ok) {
                                message.innerText = '😨Something went wrong😨'
                                message.classList.remove('hidden');
                                setTimeout(() => {
                                    message.classList.add('hidden');
                                }, 5000);
                            throw new Error('Network response was not ok');
                            }
                                message.innerText = '👍Save the file'
                                message.classList.remove('hidden');
                                setTimeout(() => {
                                    message.classList.add('hidden');
                                }, 5000);
                        // Extract the file name from the Content-Disposition header
                        const contentDisposition = response.headers.get('Content-Disposition');
                        let fileName = 'Attendance.pdf'; // Default file name
        
                        if (contentDisposition && contentDisposition.includes('filename=')) {
                            const match = contentDisposition.match(/filename="(.+)"/);
                            if (match && match[1]) {
                                fileName = match[1];
                            }
                        }
        
                        return response.blob().then(blob => ({ blob, fileName }));
                    })
                    .then(({ blob, fileName }) => {
                        const url = window.URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = fileName; // Use the file name from the server
                        document.body.appendChild(a);
                        a.click();
                        a.remove();
                    })
                    .catch(error => console.error('Error during file download:', error));
        
                
            });
        </script>
    </body>
    </html>`;
        res.send(htmlString);
        return
    }

    const id = req.signedCookies.id;

    if (!id) {
        console.error("Student not registered!");
        const html = getHTML("notRegistered");
        return res.status(403).send(html);
    }
    if (presentList[id]) {
        console.log(yellow, presentList[id].name + " already gave attendance!");
        const html = getHTML("alreadyGiven", presentList[id].name, presentList[id].usn);
        return res.status(429).send(html);
    }
    if (!studentDetails[id]) {
        res.clearCookie('id');
        console.error("Someone's Details have been Missing");
        const html = getHTML("detailsMissing");
        return res.status(429).send(html);
    }
    const html = getHTML("normal", studentDetails[id].name, studentDetails[id].usn);
    presentList[id] = studentDetails[id];
    console.log(green, `Attendance given to ${presentList[id].name} [${presentList[id].usn}]`);
    return res.status(200).send(html);
});


// Start the server
const server = app.listen(PORT, '0.0.0.0', () => {
    startTime = new Date();
    console.log("Password to Download the pdf\n");
    console.error(attendanceDownloadPassword, '\n');
    console.log(green, `Attendance link -> http://${localIP}:${PORT}`);
});


// Function to close the server
const closeServer = async () => {
    server.close(() => {
        console.log(yellow, 'Server stopped gracefully.');
        process.exit(0);
    });
}

// TODO: Rename the function because kill server doesn't actually kill whole server it just generates pdf and makes the download possible from web
const killServer = async () => {
    endTime = new Date();
    const serverDuration = Math.floor((endTime - startTime) / 1000);
    console.log(yellow, `Shutting down the server after ${serverDuration} seconds...`);

    const absentList = {};
    for (const id in studentDetails) {
        if (!presentList[id]) {
            absentList[id] = studentDetails[id];
        }
    }

    console.log(yellow, "\n--------------------------");
    console.log(yellow, "----------RESULT----------");
    console.log(green, "\n----------PRESENT----------");
    Object.values(presentList).forEach(({ usn, name }) => console.log(green, `${usn} : ${name}`));
    console.error("\n----------ABSENT----------");
    Object.values(absentList).forEach(({ usn, name }) => console.error(`${usn} : ${name}`));
    console.log(yellow, "\n--------------------------");
    console.log(yellow, "--------------------------");
    try {
        console.log(yellow, "Generating PDF...");
        // To store the modified output path with date
        OUTPUT_FILE_PATH = await generatePDF(OUTPUT_FILE_PATH, presentList, absentList); // Wait for PDF generation
        console.log(green, "PDF successfully generated!");
    } catch (err) {
        console.error("Error during PDF generation:", err);
    }
};


app.post('/pdf', (req, res) => {
    const { password } = req.body;
    if (password != attendanceDownloadPassword) {
        res.status(400).json({ message: "invalid Credentials" });
        return
    }
    const baseFileName = path.basename(OUTPUT_FILE_PATH);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${baseFileName}"`);
    res.sendFile(path.resolve(OUTPUT_FILE_PATH), (err) => {
        if (err) {
            console.error('Error sending file:', err);
            res.status(500).send('Error downloading the file.');
        }
    });
    console.log(green, "PDF Sent.")
});


let isShuttingDown = false;

const shutdownHandler = async () => {
    if (isShuttingDown) {
        console.log(yellow, "Server is shutting down..");
        await closeServer()
    }
    isShuttingDown = true;
    console.log(yellow, "Closing attendance portal...");
    await killServer(); // To save the pdf
    console.log("Password to Download the pdf\n");
    console.error(attendanceDownloadPassword, '\n');
    console.log(green, `Refresh the page or visit http://${localIP}:${PORT} to download the attendance report.`);

};

// Set a timeout to call the shutdown handler
setTimeout(() => {
    shutdownHandler();
}, attendanceWindowDuration);

// Handle SIGINT for graceful shutdown
process.on("SIGINT", async () => {
    console.log(yellow, "Performing cleanup due to SIGINT...");
    await shutdownHandler();
});
