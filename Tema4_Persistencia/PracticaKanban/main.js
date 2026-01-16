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
    const app = document.getElementById("app");

    // Limpiamos el contenido previo
    app.innerHTML = "";

    // Creamos el formulario
    const formulario = document.createElement("form");
    formulario.id = "form-usuario";
    app.appendChild(formulario);

    const titulo = document.createElement("h2");
    titulo.textContent = "Configuración del Tablero";
    formulario.appendChild(titulo);
    
    const inputColumnas = document.createElement("input");
    inputColumnas.type = "number";           // Hacemos que sea numérico
    inputColumnas.placeholder = "Nº de columnas"; // Texto de ayuda
    inputColumnas.id = "num-columnas";       // Le damos un ID para buscarlo luego
    
    formulario.appendChild(inputColumnas);

    const botonContinuar = document.createElement("button");
    botonContinuar.textContent = "Continuar";
    formulario.appendChild(botonContinuar);
}

// A la hora de cargar la página, comprobamos si existe un usuario
window.onload = function() {
    if (existeUsuario()) {
        mostrarTablero();
    } else {
        mostrarFormulario();
    }
}