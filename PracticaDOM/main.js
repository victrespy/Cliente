// --- VARIABLES GLOBALES DE ESTADO ---
let dimension = 10;
let tableroLogico = []; // Matriz de datos
let juegoTerminado = false;
let esPrimerClick = true;
let celdasReveladasCount = 0;
let totalMinas = 0;

// --- INICIO ---
window.onload = function() {
    let boton = document.getElementById("btnEmpezar");
    boton.addEventListener("click", iniciarJuego);
    
    // Iniciamos una partida por defecto al cargar
    iniciarJuego();
};

function iniciarJuego() {
    let inputDim = document.getElementById("inputDimension");
    dimension = parseInt(inputDim.value);
    
    // Validaciones de tamaño
    if (isNaN(dimension) || dimension < 5) dimension = 5;
    if (dimension > 20) dimension = 20;
    inputDim.value = dimension; // Actualizar input si se corrigió

    // Reiniciar estados
    juegoTerminado = false;
    esPrimerClick = true;
    celdasReveladasCount = 0;
    
    // Mensaje inicial
    let mensaje = document.getElementById("mensajeEstado");
    mensaje.textContent = "La bruma domina la noche...";
    mensaje.style.color = "#bdc3c7"; 

    // 1. Generar Tablero Lógico (Datos)
    inicializarTableroLogico();
    
    // 2. Generar Tablero Visible (DOM)
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
    
    let celda = evento.target;
    
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
        // CASO MINA
        celda.classList.add("bomba");
        celda.textContent = "💥";
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
    
    let celda = evento.target;
    
    // Solo poner bandera si no está revelada y NO tiene bandera ya
    if (!celda.classList.contains("revelada") && !celda.classList.contains("bandera")) {
        celda.classList.add("bandera");
        celda.textContent = "🚩";
    }
}

function manejarDobleClic(evento) {
    if (juegoTerminado) return;
    
    let celda = evento.target;

    // Solo quitar bandera si la tiene
    if (celda.classList.contains("bandera")) {
        celda.classList.remove("bandera");
        celda.textContent = ""; // Volver a estado "niebla"
    }
}

// --- FUNCIONES AUXILIARES ---

function revelarCelda(celda, valor) {
    if (celda.classList.contains("revelada")) return;

    celda.classList.add("revelada");
    celda.textContent = (valor === 0) ? "" : valor;
    
    // Atributo para colorear según el metal (CSS Mistborn)
    if (valor > 0) celda.setAttribute("data-val", valor);
}

function revelarRecursivo(f, c) {
    // Seleccionar celda del DOM por sus atributos
    let celda = document.querySelector(`div[data-f="${f}"][data-c="${c}"]`);
    
    // Condiciones de salida: fuera de rango, ya revelada o con bandera
    if (!celda || celda.classList.contains("revelada") || celda.classList.contains("bandera")) return;

    let valor = tableroLogico[f][c];
    revelarCelda(celda, valor);

    // Si es 0, seguimos expandiendo
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

    // La victoria ocurre si: Total Casillas - Total Minas = Casillas Reveladas
    let totalCasillas = dimension * dimension;
    
    if (reveladas === totalCasillas - totalMinas) {
        gameOver(true);
    }
}

function gameOver(victoria) {
    juegoTerminado = true;
    let mensaje = document.getElementById("mensajeEstado");
    
    if (victoria) {
        // Mensaje REQUERIDO exacto
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
                    celda.textContent = "💣";
                }
            }
        }
    }
}

function desactivarTableroVictoria() {
    // Visualmente marcar las minas restantes como banderas automáticamente (opcional pero elegante)
    for (let i = 0; i < dimension; i++) {
        for (let j = 0; j < dimension; j++) {
            if (tableroLogico[i][j] === '*') {
                let celda = document.querySelector(`div[data-f="${i}"][data-c="${j}"]`);
                if (celda && !celda.classList.contains("bandera")) {
                    celda.classList.add("bandera");
                    celda.textContent = "🚩";
                }
            }
        }
    }
}