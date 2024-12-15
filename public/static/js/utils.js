// Show the notification
function showNotification(message) {
    if (!message) return;
    const notification = document.getElementById('attendanceNotification');
    notification.style.visibility = 'visible';
    notification.innerHTML = message;

    // Hide the notification after 5 seconds
    setTimeout(() => {
        notification.style.visibility = 'hidden';
    }, 5000);
}