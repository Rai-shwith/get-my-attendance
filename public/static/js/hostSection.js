
// QR Code generation
const qrcode = new QRCode(document.getElementById("qrcode"), {
  text: document.getElementById("copyLink").dataset.link,
  width: 128,
  height: 128,
  colorDark: "#6200ea", // QR code color
  colorLight: "#ffffff", // Background color
  correctLevel: QRCode.CorrectLevel.H,
});

const linkField = document.getElementById("copyLink");
// Copy link to clipboard
document.getElementById("copyLinkBtn").addEventListener("click", () => {
  if (navigator && navigator.clipboard) {
    // Use the modern clipboard API
    navigator.clipboard.writeText(linkField.dataset.link)
      .then(() => {
        alert("Link copied to clipboard!");
      })
      .catch(err => {
        console.error("Failed to copy: ", err);
      });
  } else {
    // Fallback for older browsers
    const tempTextarea = document.createElement('textarea');
    tempTextarea.value = linkField.dataset.link;
    document.body.appendChild(tempTextarea);
    tempTextarea.select();
    document.execCommand('copy');
    document.body.removeChild(tempTextarea);
    alert("Link copied to clipboard.");
  }
});

const socket = io();

// Display notifications
socket.on("notification", (data) => {
  const {type,message} = JSON.parse(data);
  console.log("Received from server:",type, message);
  const container = document.getElementById("notification-container");

  // Create a notification element
  const notification = document.createElement("div");
  notification.classList.add("notification",type);
  notification.textContent = message;

  // Append the notification to the container
  container.appendChild(notification);

  // Remove notification after 3 seconds
  setTimeout(() => {
    notification.remove();
  }, 3000);
});