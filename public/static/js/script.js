
const numberForm = document.getElementById('numberForm');
const registerForm = document.getElementById('registerForm');
const message = document.getElementById('message');
const submitBtn = document.getElementById('submitBtn');
const getInnerText = (id) => {
    let element = document.getElementById(id);
    if (element) {
        return element.innerText;
    }
    return null
}
const totalTime = getInnerText('timer');
const submitUrl = getInnerText('submitUrl');
const registerUrl = getInnerText('registerUrl');


console.log("total time", totalTime)
startTimer(totalTime);

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
            timerDisplay.innerHTML = `${String(minutesLeft).padStart(2, '0')}:${String(secondsLeft).padStart(2, '0')}`;
        }
    }

    // Start the interval to update the timer every second (1000ms)
    const timerInterval = setInterval(updateTimer, 1000);

    // Initial call to display the starting time
    updateTimer();
}

if (numberForm){
numberForm.addEventListener('submit', async (e) => {
    e.preventDefault();  // Prevent page refresh when the numberForm is submitted

    // Get the roll number input value
    const number = document.getElementById('rollno').value;
    console.log(`Roll number: ${number}`);  // Log the roll number for debugging


    try {

        // Local storage to keep track of one's roll no
        // let localRollNo = localStorage.getItem('rollno');
        // if (localRollNo == undefined) {
        //     console.log("first time")
        //     localStorage.setItem('rollno', String(number));
        // } else if (localRollNo !== String(number)) {
        //     console.log("proxy")
        //     message.innerHTML = `${localRollNo} was your Rollno right?<br>Proxy?        🤡🤡.<br>This incident will be reported!!🤷‍♂️<br>Retry`;
        //     message.classList.remove('hidden');
        //     setTimeout(() => {
        //         message.innerHTML = "";
        //         message.classList.add('hidden');
        //     }, 10000);
        //     await new Promise(resolve => setTimeout(resolve,10000));
        //     return
        // }



        // Make the POST request to the server
        const response = await fetch(submitUrl, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ "number": number }),
        });

        // Handle the response based on its status
        if (response.ok) {
            // Successfully submitted
            message.innerHTML = "Submitted!";
            message.classList.remove('hidden');
            submitBtn.hidden = true;
        } else {
            // Attendance already taken or other error
            const errorResponse = await response.json();
            message.innerHTML = errorResponse.message || "Attendance already taken!";
            message.classList.remove('hidden');
            submitBtn.hidden = true;
        }
    } catch (error) {
        // Log the error and display a user-friendly message
        console.error("Error during fetch:", error);
        message.innerHTML = "Times UP!!!!";
        message.classList.remove('hidden');
    }
});
}

if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();  // Prevent page refresh when the numberForm is submitted

        // Get the roll number input value
        const usn = document.getElementById('usn').value.toUpperCase().trim();
        const name = document.getElementById('studentName').value.trim();
        console.log(`${name} : ${usn}`);
        const info = { "name": name, "usn": usn }


        try {

            // Make the POST request to the server
            const response = await fetch(registerUrl, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({"info":info}),
            });

            // Handle the response based on its status
            if (response.ok) {
                console.log("ok")
                // Successfully submitted
                const data = await response.json()
                message.innerHTML = data.message || "Submitted";
                message.classList.remove('hidden');
                submitBtn.hidden = true;
            } else {
                console.log("not ok");
                // Attendance already taken or other error
                const errorResponse = await response.json();
                message.innerHTML = `<span style="color: #ff9595;">${errorResponse.message || "Already Registered!"}</span>`;
                message.classList.remove('hidden');
                submitBtn.hidden = true;
            }
        } catch (error) {
            // Log the error and display a user-friendly message
            console.error("Error during fetch:", error);
            message.innerHTML = "Times UP!!!!";
            message.classList.remove('hidden');
        }
    });
}

