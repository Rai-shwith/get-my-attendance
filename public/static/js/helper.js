const toggleButton = document.getElementById("theme-toggle");
const body = document.body;

toggleButton.addEventListener("click", () => {
    body.classList.toggle("dark-theme");
    const elements = document.querySelectorAll("header, .card, .button, footer");
    elements.forEach(element => {
        element.classList.toggle("dark-theme");
    });
});