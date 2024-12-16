
function downloadReport(type) {
    // Logic to handle report download
    alert(`Downloading ${type.toUpperCase()} report...`);
}

function sortTable(event) {

    const table = document.getElementById('attendance-table');
    const rows = Array.from(table.tBodies[0].rows);
    const sortOrder = table.dataset.sortOrder === 'usn' ? 'status' : 'usn';

    rows.sort((a, b) => {
        if (sortOrder === 'status') {
            event.target.innerText = 'Sort by USN';
            return a.className.localeCompare(b.className); // Sort by class (present/absent)
        }
        event.target.innerText = 'Sort by Status';
        return a.cells[0].innerText.localeCompare(b.cells[0].innerText); // Sort by USN
    });

    table.tBodies[0].append(...rows); // Reattach sorted rows
    table.dataset.sortOrder = sortOrder;
}

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

// Function to save attendance data to local storage
function saveAttendanceData(attendanceData) {
    localStorage.setItem('attendance', JSON.stringify(attendanceData));
}

function populateAttendanceTable() {
    // Fetch attendance data from local storage
    const attendance = JSON.parse(localStorage.getItem('attendance')) || [];
    
    // Get the table body element
    const tableBody = document.querySelector('#attendance-table tbody');
    
    // Clear existing rows in the table body
    tableBody.innerHTML = '';

    // Loop through the attendance array and create rows
    attendance.forEach(student => {
        const row = document.createElement('tr');
        row.className = student.status === 'present' ? 'row-present' : 'row-absent';

        // Create and append the USN cell
        const usnCell = document.createElement('td');
        usnCell.textContent = student.usn;
        row.appendChild(usnCell);

        // Create and append the Name cell
        const nameCell = document.createElement('td');
        nameCell.textContent = student.name;
        row.appendChild(nameCell);

        // Create and append the Status cell
        const statusCell = document.createElement('td');
        statusCell.textContent = student.status.charAt(0).toUpperCase() + student.status.slice(1);
        row.appendChild(statusCell);

        // Append the row to the table body
        tableBody.appendChild(row);
    });
}

