// Function to handle the login form submission
document.getElementById('login-form').addEventListener('submit', function (event) {
    event.preventDefault(); // Prevent the form from submitting automatically

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    // Make a POST request to the server at /host/login
    fetch('/host/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
    })
    .then(response => {
        if (response.ok) {
            // If login is successful, redirect to the host page
            window.location.href = '/host'; // Redirect to host page
        } else {
            // If there's an error (e.g., invalid credentials), show the error message
            return response.text(); // Assuming the error message is returned as text
        }
    })
    .then(errorMessage => {
        // Show the error message
        if (errorMessage) {
            showErrorMessage(errorMessage);
        }
    })
    .catch(error => {
        // Handle any other errors (e.g., network issues)
        console.error("An error occurred:", error);
        showErrorMessage("Something went wrong. Please try again later.");
    });
});

// Function to show error message
function showErrorMessage(message) {
    const errorMessageDiv = document.getElementById('error-message');
    const errorMessageText = document.getElementById('error-message-text');
    
    if (errorMessageDiv && errorMessageText) {
        errorMessageText.textContent = message; // Set the error message text
        errorMessageDiv.classList.remove('hidden'); // Show the error message
    } else {
        console.error('Error message element not found!');
    }
}
