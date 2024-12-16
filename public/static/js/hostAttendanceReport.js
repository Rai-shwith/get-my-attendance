function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

async function downloadReport(type) {
    const timestamp = getQueryParam('timestamp');
    if (!timestamp){
        return alert("Don't directly visit /reports/attendance");
    }
    const [extension,applicationType] = (type=='pdf')?[type,'application/pdf']:['xlsx','application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
    try {
        const response = await fetch('/host/download-'+type, {
            method: 'POST',
            headers: {
              'Accept': applicationType, 
              'Content-Type': 'application/json', 
            },
            body: JSON.stringify({
              timestamp, // Ensure the body is a JSON string.
            }),
          });

        if (!response.ok) {
            throw new Error('Failed to fetch the PDF file');
        }

        // Extract the filename from the Content-Disposition header
        const contentDisposition = response.headers.get('Content-Disposition');
        let filename = 'download.'+extension; // Fallback filename

        if (contentDisposition) {
            const match = contentDisposition.match(/filename="(.+?)"/);
            if (match && match[1]) {
                filename = match[1];
            }
        }

        // Convert response to blob
        const blob = await response.blob();

        // Create a temporary download link
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = filename; // Use the extracted filename
        document.body.appendChild(link);

        // Trigger the download
        link.click();

        // Clean up the link
        document.body.removeChild(link);
        URL.revokeObjectURL(link.href);
    } catch (error) {
        console.error('Error downloading the file:', error);
    }
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

