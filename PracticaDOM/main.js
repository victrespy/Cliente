// --- VARIABLES GLOBALES DE ESTADO ---
let dimension = 10;
let tableroLogico = []; 
let juegoTerminado = false;
let esPrimerClick = true;
let celdasReveladasCount = 0;
let totalMinas = 0;

// Referencias al DOM (para no buscarlas todo el rato)
const modal = document.getElementById("modalConfig");
const btnReiniciar = document.getElementById("btnReiniciar");

// --- CONSTANTES ---

// SVG: Cabeza de Inquisidor (Mina)
const SVG_INQUISIDOR = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="32" height="32" style="display:block; margin:auto;">
  <title>Cabeza de Inquisidor</title>
  <g fill="#36454F" color="#36454F"> 
    <path d="M32,8 C22,8 14,16 14,28 C14,38 18,46 24,50 L24,62 L40,62 L40,50 C46,46 50,38 50,28 C50,16 42,8 32,8 Z"/>
    <path d="M18,24 L14,28 L18,32 L22,28 Z M20,30 L48,54 L52,50 L24,26 Z" />
    <path d="M46,24 L42,28 L46,32 L50,28 Z M44,30 L16,54 L12,50 L40,26 Z" />
  </g>
</svg>`;

// SVG: Clavo Hemalúrgico (Bandera)
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
    
    // Al cargar, nos aseguramos de que el modal esté visible
    mostrarModalConfiguracion();
};

function mostrarModalConfiguracion() {
    modal.classList.remove("oculto"); // Mostramos el pop-up
    btnReiniciar.classList.add("oculto"); // Ocultamos el botón de reiniciar del fondo
}

function configurarYEmpezar() {
    let inputDim = document.getElementById("inputDimension");
    dimension = parseInt(inputDim.value);
    
    // Validaciones
    if (isNaN(dimension) || dimension < 5) dimension = 5;
    if (dimension > 20) dimension = 20;
    inputDim.value = dimension; 

    // Ocultamos el modal y mostramos el botón de reiniciar
    modal.classList.add("oculto");
    btnReiniciar.classList.remove("oculto");

    iniciarJuego();
}

function iniciarJuego() {
    // Reiniciar estados
    juegoTerminado = false;
    esPrimerClick = true;
    celdasReveladasCount = 0;
    
    // Mensaje inicial
    let mensaje = document.getElementById("mensajeEstado");
    mensaje.textContent = "La bruma domina la noche...";
    mensaje.style.color = "#bdc3c7"; 

    // 1. Generar Tablero Lógico
    inicializarTableroLogico();
    
    // 2. Generar Tablero Visible
    dibujarTableroDOM();
}

// --- LÓGICA DEL TABLERO ---

function inicializarTableroLogico() {
    tableroLogico = [];
    for (let i = 0; i < dimension; i++) {
        let fila = [];
        for (let j = 0; j < dimension; j++) {
            fila.push(0); // 0 representa vacío inicialmente
        }
        tableroLogico.push(fila);
    }
}

function generarMinas(filaSegura, colSegura) {
    // Calculamos minas (aprox 20% del tablero)
    totalMinas = Math.floor(dimension * dimension * 0.2);
    let minasColocadas = 0;
    
    while (minasColocadas < totalMinas) {
        let f = Math.floor(Math.random() * dimension);
        let c = Math.floor(Math.random() * dimension);

        // Evitar poner mina en la casilla del primer clic y sus alrededores
        let distanciaFila = Math.abs(f - filaSegura);
        let distanciaCol = Math.abs(c - colSegura);
        let esZonaSegura = (distanciaFila <= 1 && distanciaCol <= 1);

        if (tableroLogico[f][c] !== '*' && !esZonaSegura) {
            tableroLogico[f][c] = '*';
            minasColocadas++;
        }
    }

    // Una vez puestas las minas, calculamos los números adyacentes
    calcularNumeros();
}

function calcularNumeros() {
    for (let i = 0; i < dimension; i++) {
        for (let j = 0; j < dimension; j++) {
            if (tableroLogico[i][j] === '*') continue;
            
            let contador = 0;
            // Recorrer 8 vecinos
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
    contenedor.innerHTML = ""; // Limpiar tablero anterior
    
    // Configurar rejilla CSS dinámicamente
    contenedor.style.gridTemplateColumns = `repeat(${dimension}, 1fr)`;

    for (let i = 0; i < dimension; i++) {
        for (let j = 0; j < dimension; j++) {
            let celda = document.createElement("div");
            celda.classList.add("celda");
            // Guardamos coordenadas en atributos data
            celda.setAttribute("data-f", i);
            celda.setAttribute("data-c", j);

            // --- ASIGNACIÓN DE EVENTOS REQUERIDOS ---
            
            // 1. Clic Izquierdo: Descubrir
            celda.addEventListener("click", manejarClicIzquierdo);
            
            // 2. Clic Derecho (contextmenu): Poner bandera
            celda.addEventListener("contextmenu", manejarClicDerecho);
            
            // 3. Doble Clic: Quitar bandera
            celda.addEventListener("dblclick", manejarDobleClic);

            contenedor.appendChild(celda);
        }
    }
}

// --- MANEJADORES DE EVENTOS ---

function manejarClicIzquierdo(evento) {
    if (juegoTerminado) return;
    
    let celda = evento.target.closest('.celda') || evento.target;
    
    // IMPORTANTE: No hacer nada si está marcada con bandera o ya revelada
    if (celda.classList.contains("bandera") || celda.classList.contains("revelada")) return;

    let f = parseInt(celda.getAttribute("data-f"));
    let c = parseInt(celda.getAttribute("data-c"));

    // Generar minas tras el primer clic para asegurar zona segura
    if (esPrimerClick) {
        generarMinas(f, c);
        esPrimerClick = false;
    }

    let valor = tableroLogico[f][c];

    if (valor === '*') {
        // CASO MINA (INQUISIDOR)
        celda.classList.add("bomba");
        celda.innerHTML = SVG_INQUISIDOR; 
        gameOver(false); // Perder
    } else if (valor === 0) {
        // CASO 0: Recursividad
        revelarRecursivo(f, c);
    } else {
        // CASO NÚMERO
        revelarCelda(celda, valor);
    }
    
    comprobarVictoria();
}

function manejarClicDerecho(evento) {
    evento.preventDefault(); // Evitar menú contextual del navegador
    if (juegoTerminado) return;
    
    let celda = evento.target.closest('.celda') || evento.target;
    
    // Solo poner bandera si no está revelada y NO tiene bandera ya
    if (!celda.classList.contains("revelada") && !celda.classList.contains("bandera")) {
        celda.classList.add("bandera");
        celda.innerHTML = SVG_CLAVO; // Inyectar SVG del clavo
    }
}

function manejarDobleClic(evento) {
    if (juegoTerminado) return;
    
    let celda = evento.target.closest('.celda') || evento.target;

    // Solo quitar bandera si la tiene
    if (celda.classList.contains("bandera")) {
        celda.classList.remove("bandera");
        celda.innerHTML = ""; // Limpiar el SVG
    }
}

// --- FUNCIONES AUXILIARES ---

function revelarCelda(celda, valor) {
    if (celda.classList.contains("revelada")) return;

    celda.classList.add("revelada");
    celda.textContent = (valor === 0) ? "" : valor;
    
    // --- ROTACIÓN ALEATORIA DEL FONDO ---
    const grados = Math.floor(Math.random() * 4) * 90; 
    celda.style.setProperty('--rotacion', `${grados}deg`);

    // Atributo para colorear según el metal (CSS Mistborn)
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
    let mensaje = document.getElementById("mensajeEstado");
    
    if (victoria) {
        mensaje.textContent = "Enhorabuena, has ganado";
        mensaje.style.color = "#f1c40f"; // Dorado
        desactivarTableroVictoria();
    } else {
        mensaje.textContent = "¡BOOM! Has perdido";
        mensaje.style.color = "#c0392b"; // Rojo
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
                    celda.innerHTML = SVG_INQUISIDOR;
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
                    // Marcamos las minas restantes con el clavo hemalúrgico
                    celda.innerHTML = SVG_CLAVO; 
                }
            }
        }
    }
}