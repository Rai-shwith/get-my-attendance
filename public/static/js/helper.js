document.addEventListener("DOMContentLoaded", () => {
    const themeCheckbox = document.getElementById("theme");
    themeCheckbox.addEventListener("change", () => {
        console.log("Theme changed");
        document.body.classList.toggle('dark-theme');
    });
});