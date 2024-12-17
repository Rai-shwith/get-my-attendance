const table = document.getElementById("student-table");
const editPopup = document.getElementById("edit-popup");
const confirmPopup = document.getElementById("confirm-delete");

let selectedRow = null;

// Edit Button Logic
document.querySelectorAll(".edit-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
        selectedRow = e.target.closest("tr");
        document.getElementById("edit-name").value = selectedRow.dataset.name;
        document.getElementById("edit-usn").value = selectedRow.dataset.usn;
        editPopup.classList.remove("hidden");
    });
});

// Save Edited Data
document.getElementById("save-btn").addEventListener("click", () => {
    selectedRow.dataset.name = document.getElementById("edit-name").value;
    selectedRow.dataset.usn = document.getElementById("edit-usn").value;

    selectedRow.cells[0].textContent = selectedRow.dataset.usn;
    selectedRow.cells[1].textContent = selectedRow.dataset.name;

    editPopup.classList.add("hidden");
});

// Cancel Editing
document.getElementById("cancel-btn").addEventListener("click", () => {
    editPopup.classList.add("hidden");
});

// Delete Button Logic
document.querySelectorAll(".delete-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
        selectedRow = e.target.closest("tr");
        const name = selectedRow.dataset.name;
        const usn = selectedRow.dataset.usn;
        document.getElementById("confirm-message").textContent = `Are you sure you want to unregister ${name} [${usn}]?`;
        confirmPopup.classList.remove("hidden");
    });
});

// Confirm Delete
document.getElementById("confirm-yes").addEventListener("click", () => {
    selectedRow.remove();
    confirmPopup.classList.add("hidden");
});

// Cancel Delete
document.getElementById("confirm-no").addEventListener("click", () => {
    confirmPopup.classList.add("hidden");
});

// Submit Changes
document.getElementById("submit-btn").addEventListener("click", () => {
    const updatedStudents = {};
    document.querySelectorAll("#student-table tbody tr").forEach((row) => {
        updatedStudents[row.dataset.id]={
            usn: row.cells[0].textContent,
            name: row.cells[1].textContent,
        };
    });
    console.log("Submitting: ", updatedStudents);

    fetch("/host/edit/students", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({updatedStudents}),
    }).then((response) => {
        if (response.ok) alert("Changes submitted successfully!");
    });
});

// Search bar logic
document.getElementById("searchBar").addEventListener("input", function () {
    const query = this.value.toLowerCase();
    const rows = document.querySelectorAll("#student-table tbody tr");

    rows.forEach((row) => {
        const name = row.children[1].textContent.toLowerCase();
        const usn = row.children[0].textContent.toLowerCase();

        if (name.includes(query) || usn.includes(query)) {
            row.style.display = "";
        } else {
            row.style.display = "none";
        }
    });
});
