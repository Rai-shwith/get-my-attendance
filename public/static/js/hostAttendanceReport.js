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

document.getElementById('edit-attendance').addEventListener('click', () => {
    console.log("Edit attendance clicked");
    const statusCells = document.querySelectorAll('.status-cell');
    const submitButton = document.getElementById('submit-changes');
    let isEdited = false;

    // Update the style of status cells
    statusCells.forEach(cells => cells.classList.add('editable-status'));

    // Toggle status between Present and Absent
    statusCells.forEach(cell => {
        cell.addEventListener('click', () => {
            const currentStatus = cell.getAttribute('data-status');
            const newStatus = currentStatus === 'Present' ? 'Absent' : 'Present';
            const statusStyle = newStatus === 'Present' ? 'row-present' : 'row-absent';

            // Update cell content and dataset
            cell.textContent = newStatus;
            cell.setAttribute('data-status', newStatus);
            console.log("Status set to "+newStatus);
            // Update row class
            cell.parentElement.classList.remove('row-present', 'row-absent');
            cell.parentElement.classList.add(statusStyle);

            // Show submit button after the first change
            if (!isEdited) {
                submitButton.style.display = 'block';
                isEdited = true;
            }
        });
    });

    // Collect changes and submit
    submitButton.addEventListener('click', () => {
        const rows = document.querySelectorAll('#attendance-table tbody tr');
        const changes = [];

        rows.forEach(row => {
            const studentName = row.cells[0].innerText;
            const usn = row.cells[1].innerText;
            const attendanceStatus = row.cells[2].getAttribute('data-status');

            changes.push({
                name: studentName,
                usn: usn,
                status: attendanceStatus
            });
        });

        // Send data to the backend
        fetch('/attendance/update', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ attendance: changes })
        })
            .then(response => response.json())
            .then(data => {
                alert(data.message || 'Changes submitted successfully!');
                submitButton.style.display = 'none'; // Hide the button after submission
                isEdited = false;
            })
            .catch(error => {
                console.error('Error submitting changes:', error);
                alert('Failed to submit changes: Implementation pending.');
            });
    });
});

