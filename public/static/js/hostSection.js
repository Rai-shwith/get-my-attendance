
// QR Code generation
const qrcode = new QRCode(document.getElementById("qrcode"), {
    text: document.getElementById("attendanceLink").value,
    width: 128,
    height: 128,
    colorDark: "#6200ea", // QR code color
    colorLight: "#ffffff", // Background color
    correctLevel: QRCode.CorrectLevel.H,
});

// Copy link to clipboard
document.getElementById("copyLink").addEventListener("click", async function () {
    const linkField = document.getElementById("attendanceLink");
    try {
        await navigator.clipboard.writeText(linkField.value);
        alert("Link copied to clipboard!");
    } catch (err) {
        console.error("Failed to copy: ", err);
    }
});


