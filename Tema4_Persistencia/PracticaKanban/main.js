//Comprobar si existe un usuario guardado
function existeUsuario() {
    const usuario = localStorage.getItem("datos_tablero");
    
    // Si es distinto de null, es que existe
    if (usuario !== null) {
        return true;
    } else {
        return false;
    }
}

function mostrarTablero() {
    console.log("Mostrando el tablero Kanban...");
    // Aquí iría la lógica para mostrar el tablero Kanban
}

function mostrarFormulario() {
    console.log("Mostrando el formulario de registro...");
    // Aquí iría la lógica para mostrar el formulario de registro
}

// A la hora de cargar la página, comprobamos si existe un usuario
window.onload = function() {
    if (existeUsuario()) {
        mostrarTablero();
    } else {
        mostrarFormulario();
    }
}