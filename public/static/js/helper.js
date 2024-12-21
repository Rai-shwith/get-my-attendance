const themeCheckbox = document.getElementById("theme");
themeCheckbox.addEventListener("change", () => {
    document.body.classList.toggle('dark-theme');
});