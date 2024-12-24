function interceptBackNavigationAndRedirectToHome() {
    const redirectUrl = '/host'; // Set the redirect URL to home

    // Replace the current state with a new one (this clears the previous page)
    history.replaceState(null, "", location.href);
    
    // Push a new state to prevent users from navigating back
    history.pushState(null, "", location.href);

    // Listen for popstate event to handle back navigation
    window.onpopstate = function(event) {
        // Redirect to home when back navigation is detected
        window.location.href = redirectUrl;
    };
}
document.addEventListener("DOMContentLoaded", function() {
    interceptBackNavigationAndRedirectToHome();
});
document.getElementById("searchBar").addEventListener("input", function () {
    console.log("Searching...");
    const query = this.value.toLowerCase();
    const rows = document.querySelectorAll("#attendance-table tbody tr");

    rows.forEach((row) => {
        const name = row.children[0].textContent.toLowerCase();
        const usn = row.children[1].textContent.toLowerCase();

        if (name.includes(query) || usn.includes(query)) {
            row.style.display = "";
        } else {
            row.style.display = "none";
        }
    });
});


