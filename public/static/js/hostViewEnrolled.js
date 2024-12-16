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


