
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
document.getElementById("copyLink").addEventListener("click", function () {
    const linkField = document.getElementById("attendanceLink");
    linkField.select();
    document.execCommand("copy");
    alert("Link copied to clipboard!");
});

