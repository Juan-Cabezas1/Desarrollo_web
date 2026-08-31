// Función para guardar en Local Storage
function saveLocal() {
    const name = document.getElementById('localName').value;
    localStorage.setItem('localName', name);
    displayLocal();
}

// Función para mostrar datos desde Local Storage
function displayLocal() {
    const storedName = localStorage.getItem('localName');
    document.getElementById('localOutput').textContent = storedName ? `Nombre guardado en Local Storage: ${storedName}` : "No hay nombre guardado en Local Storage.";
}

// Función para guardar en Session Storage
function saveSession() {
    const name = document.getElementById('sessionName').value;
    sessionStorage.setItem('sessionName', name);
    displaySession();
}

// Función para mostrar datos desde Session Storage
function displaySession() {
    const storedName = sessionStorage.getItem('sessionName');
    document.getElementById('sessionOutput').textContent = storedName ? `Nombre guardado en Session Storage: ${storedName}` : "No hay nombre guardado en Session Storage.";
}

// Mostrar los datos al cargar la página
window.onload = function() {
    displayLocal();
    displaySession();
};