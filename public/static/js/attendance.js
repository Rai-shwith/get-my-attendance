
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
            timerDisplay.innerHTML =`${String(minutesLeft).padStart(2, '0')}:${String(secondsLeft).padStart(2, '0')}`;
        }
    }

    // Start the interval to update the timer every second (1000ms)
    const timerInterval = setInterval(updateTimer, 1000);

    // Initial call to display the starting time
    updateTimer();
}
startTimer(totalTime);
