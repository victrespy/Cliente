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

    // CREAMOS EL FORMULARIO
    const formulario = document.createElement("form");
    formulario.id = "form-usuario";
    app.appendChild(formulario);

    //Titulo del formulario
    const titulo = document.createElement("h2");
    titulo.textContent = "Configuración del Tablero";
    formulario.appendChild(titulo);
    
    //Input para el número de columnas
    const inputColumnas = document.createElement("input");
    inputColumnas.type = "number";           
    inputColumnas.placeholder = "Nº de columnas"; 
    inputColumnas.id = "num-columnas";       
    formulario.appendChild(inputColumnas);

    //Boton de continuar
    const botonContinuar = document.createElement("button");
    botonContinuar.textContent = "Continuar";
    formulario.appendChild(botonContinuar);
    botonContinuar.addEventListener("click", function(e) {
        e.preventDefault(); // para evitar recargar la página

        // Pillamos el valor del input
        const numColumnas = parseInt(inputColumnas.value);

        // Comprobamos que es un número válido
        if (numColumnas > 0) {
            console.log("Número de columnas válido:", numColumnas);
            generarCamposColumnas(numColumnas); 
        } else {
            alert("Por favor, introduce un número de columnas válido (mayor a 0).");
        }
    });
}

function generarCamposColumnas(cantidad) {
    //Limpiamos el formulario de antes
    const app = document.getElementById("app");
    app.innerHTML = "";

    // Creo el nuebo formulario
    const formulario = document.createElement("form");
    formulario.id = "form-config-columnas"; 
    app.appendChild(formulario);

    const titulo = document.createElement("h2");
    titulo.textContent = "Detalles de las columnas";
    formulario.appendChild(titulo);

    //Bucle para cada columna
    for (let i = 0; i < cantidad; i++) {
        // Creamos un contenedor visual para cada columna
        const contenedor = document.createElement("fieldset");
        contenedor.style.margin = "10px 0";
        contenedor.style.padding = "10px";
        
        // Añado una leyenda para identificar la columna
        const leyenda = document.createElement("legend");
        leyenda.textContent = "Columna " + (i + 1);
        contenedor.appendChild(leyenda);

        // Para que el usuario ponga el nombre
        const inputNombre = document.createElement("input");
        inputNombre.type = "text";
        inputNombre.placeholder = "Nombre de la columna";
        inputNombre.required = true;
        // Le voy a poner una clase común para buscarlos todos luego
        inputNombre.classList.add("input-nombre-columna"); 
        contenedor.appendChild(inputNombre);

        // Limite de tareas
        const inputLimite = document.createElement("input");
        inputLimite.type = "number";
        inputLimite.placeholder = "Límite de tareas";
        inputLimite.min = 1;
        inputLimite.style.marginLeft = "10px";
        inputLimite.classList.add("input-limite-columna");
        contenedor.appendChild(inputLimite);

        
        formulario.appendChild(contenedor);
    }

    // Boton para guardar todo
    const botonGuardar = document.createElement("button");
    botonGuardar.textContent = "Finalizar Configuración";
    botonGuardar.style.marginTop = "20px";
    formulario.appendChild(botonGuardar);

    // Evento para guardar
    botonGuardar.addEventListener("click", function(e) {
        e.preventDefault();
        procesarConfiguracion();
    });
}

function procesarConfiguracion() {
    // Buscamos los inpust de antes
    const inputsNombres = document.querySelectorAll(".input-nombre-columna");
    const inputsLimites = document.querySelectorAll(".input-limite-columna");
    
    // Para guardar los datos
    const configuracionTablero = {
        columnas: [] 
    };

    // Recorremos cada input para crear las columnas
    for (let i = 0; i < inputsNombres.length; i++) {
        
        const nombre = inputsNombres[i].value;
        const limite = inputsLimites[i].value;

        // Comprobacion de que el nombre no esté vacío
        if (nombre.trim() === "") {
            alert("Todas las columnas deben tener nombre.");
            return;
        }

        // Creamos el objeto de la columna
        const columna = {
            id: i,
            titulo: nombre,
            limite: parseInt(limite),
            tareas: []
        };

        configuracionTablero.columnas.push(columna);
    }

    // Guardamos la configuración en localStorage
    localStorage.setItem("kanban_config", JSON.stringify(configuracionTablero));

    console.log("Configuración guardada:", configuracionTablero);

    // Con recargar la pagina, la funcion onload va a mostrar el tablero
    location.reload(); 
}

// A la hora de cargar la página, comprobamos si existe un usuario
window.onload = function() {
    if (existeUsuario()) {
        mostrarTablero();
    } else {
        mostrarFormulario();
    }
}