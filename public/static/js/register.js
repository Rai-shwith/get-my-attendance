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


registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();  // Prevent page refresh when the numberForm is submitted

    // Get the roll number input value
    const usn = document.getElementById('usn').value.toUpperCase().trim();
    const name = document.getElementById('studentName').value.trim();
    console.log(`${name} : ${usn}`);


    try {

        // Make the POST request to the server
        const response = await fetch('/register', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({name,usn}),
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

