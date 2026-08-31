const themeToggle = document.getElementById("themeToggle");

// Revisar si existe un tema guardado en localStorage
const savedTheme = localStorage.getItem("theme");

// Si había un tema guardado, aplicarlo
if (savedTheme === "dark") {
    document.body.classList.add("dark-mode");
    themeToggle.textContent = "Modo claro";
} else {
    themeToggle.textContent = "Modo oscuro";
}

// Cambiar entre modo claro y oscuro
themeToggle.addEventListener("click", function () {

    document.body.classList.toggle("dark-mode");

    if (document.body.classList.contains("dark-mode")) {

        // Modo oscuro
        themeToggle.textContent = "Modo claro";

        // Guardar en localStorage
        localStorage.setItem("theme", "dark");

        // Guardar en sessionStorage
        sessionStorage.setItem("theme", "dark");

    } else {

        // Modo claro
        themeToggle.textContent = "Modo oscuro";

        // Guardar en localStorage
        localStorage.setItem("theme", "light");

        // Guardar en sessionStorage
        sessionStorage.setItem("theme", "light");
    }
});