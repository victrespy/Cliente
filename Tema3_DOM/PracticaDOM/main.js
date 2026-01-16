// VARIABLES GLOBALES
let dimension = 10; //Dimension por defecto
let tableroLogico = []; //Tablero lógico
let juegoTerminado = false; //Estado del juego
let esPrimerClick = true; //El primer click es importante para que no sea una mina
let totalMinas = 0; //Numero de minas
let banderasColocadas = 0; //Contador de banderas
let porcentajeMinas = 0.15; // Por defecto Medio
let timerInterval; //Intervalo del timer
let segundosTranscurridos = 0; //Tiempo inicio

const modal = document.getElementById("modalConfig");
const btnReiniciar = document.getElementById("btnReiniciar");
const panelInfo = document.getElementById("panelInfo");
const timerDisplay = document.getElementById("timer");
const contadorBanderasDisplay = document.getElementById("contadorBanderas");

// SVG CLAVO HEMALURGICO
const SVG_CLAVO = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="32" height="32" style="display:block; margin:auto;">
  <title>Clavo Hemalúrgico</title>
  <g fill="currentColor">
    <path d="M20,4 C20,4 24,2 32,2 C40,2 44,4 44,4 L46,10 C46,10 40,14 32,14 C24,14 18,10 18,10 L20,4 Z" />
    <path d="M26,14 L38,14 L36,52 L32,62 L28,52 L26,14 Z" />
    <path d="M27,24 L29,26 L27,28 Z" opacity="0.6"/>
    <path d="M37,34 L35,36 L37,38 Z" opacity="0.6"/>
  </g>
</svg>`;



// INICIO
window.onload = function() {
    //Boton de inicio (esta en el modal)
    let botonEmpezar = document.getElementById("btnEmpezar");
    botonEmpezar.addEventListener("click", configurarYEmpezar); //Si se pulsa preparamos el juego
    
    //Boton de reiniciar
    btnReiniciar.addEventListener("click", mostrarModal);
    
    // Dificultad por defecto
    setDificultad('medio'); 
    
    // Mostrar modal de configuración al inicio
    mostrarModal();
};

function mostrarModal() {
    modal.classList.remove("oculto"); //Se muestra
    pararTimer();
}

// Función para ajustar la dificultad
window.setDificultad = function(nivel) {
    // Reset visual
    document.querySelectorAll('.opcion-dificultad').forEach(b => b.classList.remove('seleccionado'));
    
    if (nivel === 'facil') {
        porcentajeMinas = 0.10;
        document.getElementById('difFacil').classList.add('seleccionado');
    } else if (nivel === 'medio') {
        porcentajeMinas = 0.15;
        document.getElementById('difMedio').classList.add('seleccionado');
    } else if (nivel === 'dificil') {
        porcentajeMinas = 0.25;
        document.getElementById('difDificil').classList.add('seleccionado');
    }
}

function configurarYEmpezar() {
    //Obtener la dimension
    let inputDim = document.getElementById("inputDimension");
    dimension = parseInt(inputDim.value);
    
    // Validaciones
    if (isNaN(dimension) || dimension < 5) dimension = 5;
    if (dimension > 20) dimension = 20;
    inputDim.value = dimension; 

    // Quitar el modal y mostrar el tablero
    modal.classList.add("oculto");
    btnReiniciar.classList.remove("oculto");
    panelInfo.classList.remove("oculto");

    //Comenzamos el juego
    iniciarJuego();
}

function iniciarJuego() {
    // Reiniciar el juego
    juegoTerminado = false;
    esPrimerClick = true;
    banderasColocadas = 0;
    segundosTranscurridos = 0;
    
    // Reiniciar el tablero
    document.getElementById("tablero").classList.remove("tablero-derrota");
    
    // Reiniciar el temporizador
    timerDisplay.textContent = "00:00";
    pararTimer(); // El temporizador empieza en el primer click
    
    let mensaje = document.getElementById("mensajeEstado");
    mensaje.textContent = "La bruma domina la noche...";
    mensaje.style.color = "#bdc3c7"; 

    // Generar Tablero Lógico
    inicializarTableroLogico();
    
    // Generar Tablero Visible
    dibujarTableroDOM();

    // Actualizamos contador de banderas
    totalMinas = Math.floor(dimension * dimension * porcentajeMinas);
    actualizarContadorBanderas();
}

// TEMPORIZADOR
function iniciarTimer() {
    pararTimer();
    timerInterval = setInterval(() => {
        segundosTranscurridos++;
        let minutos = Math.floor(segundosTranscurridos / 60).toString().padStart(2, '0');
        let segundos = (segundosTranscurridos % 60).toString().padStart(2, '0');
        timerDisplay.textContent = `${minutos}:${segundos}`;
    }, 1000);
}

function pararTimer() {
    if (timerInterval) clearInterval(timerInterval);
}

function actualizarContadorBanderas() {
    let restantes = totalMinas - banderasColocadas;
    contadorBanderasDisplay.textContent = restantes;
    // Color rojo si nos pasamos de banderas
    contadorBanderasDisplay.style.color = restantes < 0 ? "#e74c3c" : "#3498db";
}

// LOGICA DEL TABLERO

function inicializarTableroLogico() {
    tableroLogico = [];
    for (let i = 0; i < dimension; i++) {
        let fila = [];
        for (let j = 0; j < dimension; j++) {
            fila.push(0);
        }
        tableroLogico.push(fila);
    }
}

function generarMinas(filaSegura, colSegura) { // Se llama a esta funcion en el primer click
    // Usamos el porcentaje seleccionado
    totalMinas = Math.floor(dimension * dimension * porcentajeMinas);
    let minasColocadas = 0;
    
    // Actualizamos el contador real ahora que sabemos el número exacto
    actualizarContadorBanderas();
    
    // Colocamos minas
    while (minasColocadas < totalMinas) {
        let f = Math.floor(Math.random() * dimension);
        let c = Math.floor(Math.random() * dimension);

        // Evitramos donde se hace le primer click
        let distanciaFila = Math.abs(f - filaSegura);
        let distanciaCol = Math.abs(c - colSegura);
        let esZonaSegura = (distanciaFila <= 1 && distanciaCol <= 1);

        if (tableroLogico[f][c] !== '*' && !esZonaSegura) {
            tableroLogico[f][c] = '*';
            minasColocadas++;
        }
    }
    calcularNumeros();
}

function calcularNumeros() {
    for (let i = 0; i < dimension; i++) {
        for (let j = 0; j < dimension; j++) {
            if (tableroLogico[i][j] === '*') continue; // Saltar minas
            let contador = 0;
            for (let x = -1; x <= 1; x++) {
                for (let y = -1; y <= 1; y++) {
                    if (x === 0 && y === 0) continue; // Saltar la celda actual
                    let f = i + x;
                    let c = j + y;
                    if (f >= 0 && f < dimension && c >= 0 && c < dimension) { // Para no salirnos
                        if (tableroLogico[f][c] === '*') contador++;
                    }
                }
            }
            tableroLogico[i][j] = contador;
        }
    }
}

// EVENTOS

function dibujarTableroDOM() {
    let contenedor = document.getElementById("tablero"); // Obtenemos el elemento
    contenedor.innerHTML = ""; // Borrar lo anterior
    contenedor.style.gridTemplateColumns = `repeat(${dimension}, 1fr)`; // Setear el grid

    for (let i = 0; i < dimension; i++) {
        for (let j = 0; j < dimension; j++) {
            let celda = document.createElement("div"); // Crear la celda
            celda.classList.add("celda"); // Añadir clase celda
            celda.setAttribute("data-f", i); // Fila
            celda.setAttribute("data-c", j); // Columna

            // Se le añaden los eventos del raton
            celda.addEventListener("click", clickIzd);
            celda.addEventListener("contextmenu", clickDch);
            celda.addEventListener("dblclick", dobleClick);

            contenedor.appendChild(celda);
        }
    }
}


function clickIzd(evento) {
    if (juegoTerminado) return; // Si el juego ha terminado no hacer nada
    
    let celda = evento.target.closest('.celda') || evento.target; // Para pillar la celda correcta
    if (celda.classList.contains("bandera") || celda.classList.contains("revelada")) return; // No hacer nada si tiene bandera o ya está revelada

    // Obtener fila y columna
    let f = parseInt(celda.getAttribute("data-f"));
    let c = parseInt(celda.getAttribute("data-c"));

    // Generar minas en el primer click para crear una zona segura
    if (esPrimerClick) {
        generarMinas(f, c);
        esPrimerClick = false;
        iniciarTimer(); // Iniciamos el temporizador tambien
    }

    // Pillamos el valor del tablero lógico 
    let valor = tableroLogico[f][c];

    // Revelar según el valor
    if (valor === '*') {
        celda.classList.add("bomba");
        gameOver(false); // Pierdes si es una bomba
    } else if (valor === 0) {
        revelarRecursivo(f, c); // Revelar recursivamente si es 0
    } else {
        revelarCelda(celda, valor); // Revelar solo esa celda
    }
    
    // Comprobar si hemos ganado
    comprobarVictoria();
}

function clickDch(evento) {
    evento.preventDefault(); // Para que no salga el menu contextual
    if (juegoTerminado) return; // Si el juego ha terminado no hacer nada
    
    let celda = evento.target.closest('.celda') || evento.target; // Para pillar la celda correcta
    
    // Colocar bandera si no está revelada ni tiene bandera
    if (!celda.classList.contains("revelada") && !celda.classList.contains("bandera")) {
        celda.classList.add("bandera");
        celda.innerHTML = SVG_CLAVO; // Añadir el SVG del clavo
        banderasColocadas++; // Aumentar contador
        actualizarContadorBanderas();
    }
}

function dobleClick(evento) { // Elimina la clase de bandera si existe
    if (juegoTerminado) return; // Si el juego ha terminado no hacer nada
    
    let celda = evento.target.closest('.celda') || evento.target;

    if (celda.classList.contains("bandera")) {
        celda.classList.remove("bandera");
        celda.innerHTML = "";
        banderasColocadas--; // Disminuir contador
        actualizarContadorBanderas();
    }
}

// FUNCIONES AUXILIARES

function revelarCelda(celda, valor) {
    if (celda.classList.contains("revelada")) return; // Ya está revelada no hacer nada

    // Aniadir clase revelada y mostrar valor
    celda.classList.add("revelada");
    celda.textContent = (valor === 0) ? "" : valor;
    
    // Rotacion aleatoria para que se vea chuli el tablero
    const grados = Math.floor(Math.random() * 4) * 90; 
    celda.style.setProperty('--rotacion', `${grados}deg`);

    // Añadir atributo data-val para estilos CSS
    if (valor > 0) celda.setAttribute("data-val", valor);
}

function revelarRecursivo(f, c) {
    let celda = document.querySelector(`div[data-f="${f}"][data-c="${c}"]`);
    if (!celda || celda.classList.contains("revelada") || celda.classList.contains("bandera")) return; // No hacer nada si ya está revelada o tiene bandera

    let valor = tableroLogico[f][c];
    revelarCelda(celda, valor);

    // Aqui ocurre la recursividad
    if (valor === 0) {
        for (let x = -1; x <= 1; x++) {
            for (let y = -1; y <= 1; y++) {
                let nf = f + x;
                let nc = c + y;
                if (nf >= 0 && nf < dimension && nc >= 0 && nc < dimension) {
                    revelarRecursivo(nf, nc);
                }
            }
        }
    }
}

function comprobarVictoria() {
    // Cuenta cuantas celdas han sido reveladas y le resta el total de minas. Si es igual a la dimension^2 ganas
    let celdas = document.querySelectorAll(".celda");
    let reveladas = 0;
    
    celdas.forEach(c => {
        if (c.classList.contains("revelada")) reveladas++;
    });

    let totalCasillas = dimension * dimension;
    
    if (reveladas === totalCasillas - totalMinas) {
        gameOver(true);
    }
}

function gameOver(victoria) {
    juegoTerminado = true;
    pararTimer(); // para el temporizador

    let mensaje = document.getElementById("mensajeEstado");
    
    if (victoria) {
        mensaje.textContent = "¡Has ascendido! Victoria.";
        mensaje.style.color = "#f1c40f"; 
        desactivarTableroVictoria();
    } else {
        mensaje.textContent = "¡Los Inquisidores te han encontrado!";
        mensaje.style.color = "#c0392b"; 
        document.getElementById("tablero").classList.add("tablero-derrota"); // Efecto visual de derrota
        revelarTodasLasMinas();
    }
}

function revelarTodasLasMinas() {
    for (let i = 0; i < dimension; i++) {
        for (let j = 0; j < dimension; j++) {
            if (tableroLogico[i][j] === '*') {
                let celda = document.querySelector(`div[data-f="${i}"][data-c="${j}"]`);
                if (celda && !celda.classList.contains("bandera")) {
                    celda.classList.add("bomba");
                }
            }
        }
    }
}

function desactivarTableroVictoria() {
    for (let i = 0; i < dimension; i++) {
        for (let j = 0; j < dimension; j++) {
            if (tableroLogico[i][j] === '*') {
                let celda = document.querySelector(`div[data-f="${i}"][data-c="${j}"]`);
                if (celda && !celda.classList.contains("bandera")) {
                    celda.classList.add("bandera");
                    celda.innerHTML = SVG_CLAVO; 
                }
            }
        }
    }
}