const generatePDF = require('./pdfGenerator');
const generateExcel = require('./excelGenerator')
const fs = require('fs');
const path = require('path');
const { PORT, SECRET_KEY, STUDENT_DETAILS_PATH, getLocalIP, attendanceDownloadPassword,log,red,yellow,green,interval} = require('./config/env')
let { OUTPUT_FILE_PATH } = require('./config/env')

const attendance = (app, PORT) => {
    let pdfOutputPath;
    let excelOutputPath;
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


    // To keep track of students who gave attendance
    const presentList = new Object();

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
        footer{
                position: absolute;
                bottom: 0;
                text-align: center;
                background: rgba(255, 255, 255, 0.1);
                padding: 0.5em;
                width: 100vw;
                font-size: small;
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
        <footer>
        © 2024 <a href="https://github.com/Rai-shwith" rel="noopener" target="_blank">Ashwith Rai</a> . Licensed under
        <a rel="noopener" href="https://creativecommons.org/licenses/by-nc-sa/4.0/" target="_blank">CC BY-NC-SA 4.0</a>.
    </footer>
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
                <div class="group">
                    <button id="pdfSubmitBtn" type="button">Download PDF</button>
                    <button id="excelSubmitBtn" type="button">Download EXCEL</button>
                </div>
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
            footer{
                position: absolute;
                bottom: 0;
                text-align: center;
                background: rgba(255, 255, 255, 0.1);
                padding: 0.5em;
                width: 100vw;
                font-size: small;
                border-radius: 12px;
                box-shadow: 0px 8px 15px rgba(0, 0, 0, 0.2);
            }
            .group {
                display: flex;
                gap: 10px;
            }
        </style>
    </head>
    
    <body>
        ${container}
        <footer>
        © 2024 <a href="https://github.com/Rai-shwith" rel="noopener" target="_blank">Ashwith Rai</a> . Licensed under
        <a rel="noopener" href="https://creativecommons.org/licenses/by-nc-sa/4.0/" target="_blank">CC BY-NC-SA 4.0</a>.
        </footer>
        <script>
            const message = document.getElementById('message');
        const pdfSubmitBtn = document.getElementById('pdfSubmitBtn');
        const excelSubmitBtn = document.getElementById('excelSubmitBtn');

        // function to download pdf or excel 
        // here type can be pdf or xlsx
        const downloadHandler = (type) => {
            // Get the password
            const password = document.getElementById('password').value.trim();

            console.log("Sending Download Request with Password =", password);

            fetch(\`/\${type}\`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ password }),
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
                    let fileName = \`Attendance.\${type}\`; // Default file name

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


        }

        pdfSubmitBtn.addEventListener('click', async (e) => {
            downloadHandler('pdf')
        });
        
        excelSubmitBtn.addEventListener('click', async (e) => {
            downloadHandler('xlsx')
        });
        </script>
    </body>
    </html>`;
            res.send(htmlString);
            return
        }

        const id = req.signedCookies.id;

        if (!id) {
            log(red, "Student not registered!");
            const html = getHTML("notRegistered");
            return res.status(403).send(html);
        }
        if (presentList[id]) {
            log(yellow, presentList[id].name + " already gave attendance!");
            const html = getHTML("alreadyGiven", presentList[id].name, presentList[id].usn);
            return res.status(429).send(html);
        }
        if (!studentDetails[id]) {
            res.clearCookie('id');
            log(red, "Someone's Details have been Missing");
            const html = getHTML("detailsMissing");
            return res.status(429).send(html);
        }
        const html = getHTML("normal", studentDetails[id].name, studentDetails[id].usn);
        presentList[id] = studentDetails[id];
        log(green, `Attendance given to ${presentList[id].name} [${presentList[id].usn}]`);
        return res.status(200).send(html);
    });


    // Start the server
    const server = app.listen(PORT, '0.0.0.0', () => {
        startTime = new Date();
        log("Password to Download the pdf\n");
        log(red, attendanceDownloadPassword, '\n');
        log(green, `Attendance link -> http://${localIP}:${PORT}`);
    });


    // Function to close the server
    const closeServer = async () => {
        server.close(() => {
            log(yellow, 'Server stopped gracefully.');
            process.exit(0);
        });
    }

    // TODO: Rename the function because kill server doesn't actually kill whole server it just generates pdf and makes the download possible from web
    const killServer = async () => {
        endTime = new Date();
        const serverDuration = Math.floor((endTime - startTime) / 1000);
        log(yellow, `Shutting down the server after ${serverDuration} seconds...`);

        const absentList = {};
        for (const id in studentDetails) {
            if (!presentList[id]) {
                absentList[id] = studentDetails[id];
            }
        }

        log(yellow, "\n--------------------------");
        log(yellow, "----------RESULT----------");
        log(green, "\n----------PRESENT----------");
        Object.values(presentList).forEach(({ usn, name }) => log(green, `${usn} : ${name}`));
        log(red, "\n----------ABSENT----------");
        Object.values(absentList).forEach(({ usn, name }) => log(red, `${usn} : ${name}`));
        log(yellow, "\n--------------------------");
        log(yellow, "--------------------------");
        try {
            console.log(yellow, "Generating Download Details...");
            // To store the modified output path with date
            excelOutputPath = await generateExcel(OUTPUT_FILE_PATH, presentList, absentList); // Wait for PDF generation
            console.log(green, "EXCEL successfully generated!");
            pdfOutputPath = await generatePDF(OUTPUT_FILE_PATH, presentList, absentList); // Wait for PDF generation
            console.log(green, "PDF successfully generated!");
        } catch (err) {
            log(red, "Error during PDF generation:", err);
        }
    };


    app.post('/pdf', (req, res) => {
        const { password } = req.body;
        if (password != attendanceDownloadPassword) {
            res.status(400).json({ message: "invalid Credentials" });
            return
        }
        const baseFileName = path.basename(pdfOutputPath);
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="${baseFileName}"`);
        res.sendFile(path.resolve(pdfOutputPath), (err) => {
            if (err) {
                log(red, 'Error sending file:', err);
                res.status(500).send('Error downloading the file.');
            }
        });
        log(green, "PDF Sent.")
    });

    // Endpoint to download the excel file
    app.post('/xlsx', (req, res) => {
        const { password } = req.body;
        if (password != attendanceDownloadPassword) {
            res.status(400).json({ message: "invalid Credentials" });
            return
        }
        const baseFileName = path.basename(excelOutputPath);
        res.setHeader('Content-Type', 'application/xlsx');
        res.setHeader('Content-Disposition', `attachment; filename="${baseFileName}"`);
        res.sendFile(path.resolve(excelOutputPath), (err) => {
            if (err) {
                console.error('Error sending file:', err);
                res.status(500).send('Error downloading the file.');
            }
        });
        console.log(green, "EXCEL Sent.")
    });


    let isShuttingDown = false;

    const shutdownHandler = async () => {
        if (isShuttingDown) {
            log(yellow, "Server is shutting down..");
            await closeServer()
        }
        isShuttingDown = true;
        log(yellow, "Closing attendance portal...");
        await killServer(); // To save the pdf
        log("Password to Download the pdf\n");
        log(red, attendanceDownloadPassword, '\n');
        log(green, `Refresh the page or visit http://${localIP}:${PORT} to download the attendance report.`);

    };

    // Set a timeout to call the shutdown handler
    setTimeout(() => {
        shutdownHandler();
    }, attendanceWindowDuration);

    // Handle SIGINT for graceful shutdown
    process.on("SIGINT", async () => {
        log(yellow, "Performing cleanup due to SIGINT...");
        await shutdownHandler();
    });
}

module.exports = attendance;