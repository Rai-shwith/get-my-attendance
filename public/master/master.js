
function showRegistrationPhase() {
    document.getElementById('registrationPhase').classList.remove('hidden');
}

function submitRegistrationTime() {
    const linkContainer = document.getElementById('linkContainer');
    linkContainer.classList.remove('hidden');
}

function copyToClipboard() {
    const link = document.getElementById('generatedLink').textContent;
    navigator.clipboard.writeText(link).then(() => {
        alert('Link copied to clipboard!');
    });
}

function addLogEntry() {
    const logView = document.getElementById('logView');
    
    // Simulated log messages
    const logMessages = [
        { text: 'Attendance successfully recorded for <b>Jane Smith [2MS23EE123]</b>.', type: 'log-success' },
        { text: 'Jane Smith [2MS23EE123] has already marked attendance.', type: 'log-info' },
        { text: 'An unregistered user attempted to mark attendance.', type: 'log-warning' },
        { text: 'Jane Smith’s information has been erased from the system.', type: 'log-error' }
    ];

}


function startServer(serverObject){
    fetch('/start', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({serverObject}),
    }).then(response => response.json())
    .then(data => {
        console.log('Success:', data.message);
        console.log("Link: ",data.link);
        document.getElementById('attendanceGeneratedLink').textContent = data.link;
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}


// Function to close all other sections and open only given section
function showSection(id){
    // Hide the cover
    if (id == 'homePage'){
        document.getElementById('backIcon').classList.add('hidden');
    } else{
        document.getElementById('backIcon').classList.remove('hidden');
    }
    console.log("Showing only section: " + id);
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        section.classList.add('hidden');
    });

    document.getElementById(id).classList.remove('hidden');
}

document.getElementById('startRegistrationBtn').addEventListener('click',()=>{
    console.log("Calling attendance");
    startServer('attendance');
})