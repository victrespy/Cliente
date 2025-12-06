// --- VARIABLES GLOBALES DE ESTADO ---
let dimension = 10;
let tableroLogico = []; 
let juegoTerminado = false;
let esPrimerClick = true;
let totalMinas = 0;
let banderasColocadas = 0;

// Variables de Dificultad y Tiempo
let porcentajeMinas = 0.15; // Por defecto Medio (Bronce)
let timerInterval;
let segundosTranscurridos = 0;

// Referencias al DOM
const modal = document.getElementById("modalConfig");
const btnReiniciar = document.getElementById("btnReiniciar");
const panelInfo = document.getElementById("panelInfo");
const timerDisplay = document.getElementById("timer");
const contadorBanderasDisplay = document.getElementById("contadorBanderas");

// --- CONSTANTES ---
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

// --- INICIO ---
window.onload = function() {
    let botonEmpezar = document.getElementById("btnEmpezar");
    botonEmpezar.addEventListener("click", configurarYEmpezar);
    
    btnReiniciar.addEventListener("click", mostrarModalConfiguracion);
    
    // Selección inicial de dificultad por defecto en UI
    setDificultad('medio'); 
    
    mostrarModalConfiguracion();
};

function mostrarModalConfiguracion() {
    modal.classList.remove("oculto"); 
    btnReiniciar.classList.add("oculto");
    panelInfo.classList.add("oculto"); // Ocultamos HUD en config
    pararTimer();
}

// Función global para los botones de dificultad
window.setDificultad = function(nivel) {
    // Reset visual: buscamos .opcion-dificultad en vez de botones
    document.querySelectorAll('.opcion-dificultad').forEach(b => b.classList.remove('seleccionado'));
    
    if (nivel === 'facil') {
        porcentajeMinas = 0.10; // 10% minas
        document.getElementById('difFacil').classList.add('seleccionado');
    } else if (nivel === 'medio') {
        porcentajeMinas = 0.15; // 15% minas
        document.getElementById('difMedio').classList.add('seleccionado');
    } else if (nivel === 'dificil') {
        porcentajeMinas = 0.25; // 25% minas
        document.getElementById('difDificil').classList.add('seleccionado');
    }
}

function configurarYEmpezar() {
    let inputDim = document.getElementById("inputDimension");
    dimension = parseInt(inputDim.value);
    
    // Validaciones
    if (isNaN(dimension) || dimension < 5) dimension = 5;
    if (dimension > 20) dimension = 20;
    inputDim.value = dimension; 

    modal.classList.add("oculto");
    btnReiniciar.classList.remove("oculto");
    panelInfo.classList.remove("oculto"); // Mostrar HUD

    iniciarJuego();
}

function iniciarJuego() {
    // Reiniciar estados
    juegoTerminado = false;
    esPrimerClick = true;
    banderasColocadas = 0;
    segundosTranscurridos = 0;
    
    // Limpiar visuales
    document.getElementById("tablero").classList.remove("tablero-derrota");
    
    // Reset HUD
    timerDisplay.textContent = "00:00";
    pararTimer(); // El timer arranca en el primer click
    
    let mensaje = document.getElementById("mensajeEstado");
    mensaje.textContent = "La bruma domina la noche...";
    mensaje.style.color = "#bdc3c7"; 

    // 1. Generar Tablero Lógico
    inicializarTableroLogico();
    
    // 2. Generar Tablero Visible
    dibujarTableroDOM();

    // Actualizamos contador de banderas
    totalMinas = Math.floor(dimension * dimension * porcentajeMinas);
    actualizarContadorBanderas();
}

// --- TIMER ---
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

// --- LÓGICA DEL TABLERO ---

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

function generarMinas(filaSegura, colSegura) {
    // Usamos el porcentaje seleccionado
    totalMinas = Math.floor(dimension * dimension * porcentajeMinas);
    let minasColocadas = 0;
    
    // Actualizamos el contador real ahora que sabemos el número exacto
    actualizarContadorBanderas();
    
    while (minasColocadas < totalMinas) {
        let f = Math.floor(Math.random() * dimension);
        let c = Math.floor(Math.random() * dimension);

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
            if (tableroLogico[i][j] === '*') continue;
            let contador = 0;
            for (let x = -1; x <= 1; x++) {
                for (let y = -1; y <= 1; y++) {
                    if (x === 0 && y === 0) continue;
                    let f = i + x;
                    let c = j + y;
                    if (f >= 0 && f < dimension && c >= 0 && c < dimension) {
                        if (tableroLogico[f][c] === '*') contador++;
                    }
                }
            }
            tableroLogico[i][j] = contador;
        }
    }
}

// --- DOM Y EVENTOS ---

function dibujarTableroDOM() {
    let contenedor = document.getElementById("tablero");
    contenedor.innerHTML = "";
    contenedor.style.gridTemplateColumns = `repeat(${dimension}, 1fr)`;

    for (let i = 0; i < dimension; i++) {
        for (let j = 0; j < dimension; j++) {
            let celda = document.createElement("div");
            celda.classList.add("celda");
            celda.setAttribute("data-f", i);
            celda.setAttribute("data-c", j);

            celda.addEventListener("click", manejarClicIzquierdo);
            celda.addEventListener("contextmenu", manejarClicDerecho);
            celda.addEventListener("dblclick", manejarDobleClic);

            contenedor.appendChild(celda);
        }
    }
}

// --- MANEJADORES DE EVENTOS ---

function manejarClicIzquierdo(evento) {
    if (juegoTerminado) return;
    
    let celda = evento.target.closest('.celda') || evento.target;
    if (celda.classList.contains("bandera") || celda.classList.contains("revelada")) return;

    let f = parseInt(celda.getAttribute("data-f"));
    let c = parseInt(celda.getAttribute("data-c"));

    if (esPrimerClick) {
        generarMinas(f, c);
        esPrimerClick = false;
        iniciarTimer(); // ARRANCAR TEMPORIZADOR
    }

    let valor = tableroLogico[f][c];

    if (valor === '*') {
        celda.classList.add("bomba");
        gameOver(false);
    } else if (valor === 0) {
        revelarRecursivo(f, c);
    } else {
        revelarCelda(celda, valor);
    }
    
    comprobarVictoria();
}

function manejarClicDerecho(evento) {
    evento.preventDefault();
    if (juegoTerminado) return;
    
    let celda = evento.target.closest('.celda') || evento.target;
    
    if (!celda.classList.contains("revelada") && !celda.classList.contains("bandera")) {
        celda.classList.add("bandera");
        celda.innerHTML = SVG_CLAVO;
        banderasColocadas++; // Aumentar contador
        actualizarContadorBanderas();
    }
}

function manejarDobleClic(evento) {
    if (juegoTerminado) return;
    
    let celda = evento.target.closest('.celda') || evento.target;

    if (celda.classList.contains("bandera")) {
        celda.classList.remove("bandera");
        celda.innerHTML = "";
        banderasColocadas--; // Disminuir contador
        actualizarContadorBanderas();
    }
}

// --- FUNCIONES AUXILIARES ---

function revelarCelda(celda, valor) {
    if (celda.classList.contains("revelada")) return;

    celda.classList.add("revelada");
    celda.textContent = (valor === 0) ? "" : valor;
    
    const grados = Math.floor(Math.random() * 4) * 90; 
    celda.style.setProperty('--rotacion', `${grados}deg`);

    if (valor > 0) celda.setAttribute("data-val", valor);
}

function revelarRecursivo(f, c) {
    let celda = document.querySelector(`div[data-f="${f}"][data-c="${c}"]`);
    if (!celda || celda.classList.contains("revelada") || celda.classList.contains("bandera")) return;

    let valor = tableroLogico[f][c];
    revelarCelda(celda, valor);

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
    pararTimer(); // PARAR TEMPORIZADOR

    let mensaje = document.getElementById("mensajeEstado");
    
    if (victoria) {
        mensaje.textContent = "¡Has ascendido! Victoria.";
        mensaje.style.color = "#f1c40f"; 
        desactivarTableroVictoria();
    } else {
        mensaje.textContent = "¡El Inquisidor te ha encontrado!";
        mensaje.style.color = "#c0392b"; 
        document.getElementById("tablero").classList.add("tablero-derrota");
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