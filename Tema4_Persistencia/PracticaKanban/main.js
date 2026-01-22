//Comprobar si existe un usuario guardado
function tieneConfiguracion() {
    const configuracion = localStorage.getItem("datos_tablero");
    
    // Si es distinto de null, es que existe
    if (configuracion !== null) {
        return true;
    } else {
        return false;
    }
}

function mostrarTablero() {
    // Limpiamos el contenido previo
    const app = document.getElementById("app");
    app.innerHTML = "";

    // Pillar los datos
    const datosJSON = localStorage.getItem("datos_tablero");
    const config = JSON.parse(datosJSON);

    // Creo un contenedor para el tablero
    const contenedorTablero = document.createElement("section");
    contenedorTablero.id = "tablero-contenedor";
    app.appendChild(contenedorTablero);

    // Recorremos las columnas guardadas
    config.columnas.forEach(columna => {
        const columnaDiv = document.createElement("div");
        columnaDiv.classList.add("columna-tablero");
        
        // Titulo
        const titulo = document.createElement("h3");
        titulo.textContent = `${columna.titulo} (0/${columna.limite})`;
        columnaDiv.appendChild(titulo);

        // Donde iran las tareas
        const contenedorTareas = document.createElement("div");
        contenedorTareas.classList.add("contenedor-tareas");
        contenedorTareas.id = `tareas-columna-${columna.id}`;
        columnaDiv.appendChild(contenedorTareas);

        // Recorremos las tareas de la columna
        columna.tareas.forEach(tarea => {
            const tareaDiv = document.createElement("div");
            tareaDiv.textContent = tarea.contenido;
            tareaDiv.classList.add("tarea-card");
            
            contenedorTareas.appendChild(tareaDiv);
        });

        // Añadimos la columna al tablero
        contenedorTablero.appendChild(columnaDiv);
    });

    // Voy a hacer un formulario para añadir tareas a cualquiera de las columnas en vez de una entrada por columna

    // Creo el formulario
    const formTarea = document.createElement("div");
    formTarea.classList.add("form-tareas");
    
    const tituloForm = document.createElement("h3");
    tituloForm.textContent = "Añadir Nueva Tarea";
    formTarea.appendChild(tituloForm);

    // Select
    const selectColumna = document.createElement("select");
    selectColumna.id = "select-columna-destino";
    
    config.columnas.forEach(columna => {
        const option = document.createElement("option");
        option.value = columna.id;
        option.textContent = columna.titulo;
        selectColumna.appendChild(option);
    });
    formTarea.appendChild(selectColumna);

    //Input
    const inputTarea = document.createElement("input");
    inputTarea.type = "text";
    inputTarea.placeholder = "Descripción de la tarea";
    inputTarea.classList.add("input-texto-tarea");
    formTarea.appendChild(inputTarea);

    // Boton
    const btnAdd = document.createElement("button");
    btnAdd.textContent = "Añadir Tarea";
    formTarea.appendChild(btnAdd);

    // Pongo todo esto al main
    app.appendChild(formTarea);

    // Aniadir la tarea a la columna
    btnAdd.addEventListener("click", function() {
        const texto = inputTarea.value;
        const idColumnaDestino = parseInt(selectColumna.value);

        // Comprobar que no este vacia
        if (texto.trim() === "") {
            alert("La tarea no puede estar vacía.");
            return;
        }

        // Buscar la columna destino
        const columnaDestino = config.columnas.find(c => c.id === idColumnaDestino);

        // Avisar si la columna esta llena
        if (columnaDestino.tareas.length >= columnaDestino.limite) {
            alert("¡Esa columna está llena! Mueve tareas o elige otra.");
            return;
        }
        
        // Hago el objeto tarea, le pongo id fecha para que sea unico
        const nuevaTarea = {
            id: Date.now(), 
            contenido: texto
        };

        // Aniadir la tarea a la columna (el objeto columna)
        columnaDestino.tareas.push(nuevaTarea);

        // Actualizar el localStorage
        localStorage.setItem("datos_tablero", JSON.stringify(config));

        // Recargar la pagina
        mostrarTablero(); 
    });
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
        guardarConfiguracion();
    });
}

function guardarConfiguracion() {
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
    localStorage.setItem("datos_tablero", JSON.stringify(configuracionTablero));

    console.log("Configuración guardada:", configuracionTablero);

    // Con recargar la pagina, la funcion onload va a mostrar el tablero
    location.reload(); 
}

// A la hora de cargar la página, comprobamos si existe un usuario
window.onload = function() {
    if (tieneConfiguracion()) {
        mostrarTablero();
    } else {
        mostrarFormulario();
    }
}