// Variables globales de estado
let dimension = 10;
let tableroLogico = [];
let juegoTerminado = false;
let esPrimerClick = true; // <--- Nueva variable de control

window.onload = function() {
    let boton = document.getElementById("btnEmpezar");
    boton.addEventListener("click", iniciarJuego);
    iniciarJuego();
};

function iniciarJuego() {
    let inputDim = document.getElementById("inputDimension");
    dimension = parseInt(inputDim.value);
    
    // Validaciones
    if (isNaN(dimension) || dimension < 5) dimension = 5;
    if (dimension > 20) dimension = 20;

    // Reiniciar estados
    juegoTerminado = false;
    esPrimerClick = true; // <--- Reseteamos para la nueva partida
    document.getElementById("mensajeEstado").textContent = "Juego en curso...";
    
    // 1. Inicializamos el tablero lógico VACÍO (todo ceros)
    inicializarTableroVacio();
    
    // 2. Pintamos el tablero visual (sin minas reales todavía)
    dibujarTableroDOM();
}

function inicializarTableroVacio() {
    tableroLogico = [];
    for (let i = 0; i < dimension; i++) {
        let fila = [];
        for (let j = 0; j < dimension; j++) {
            fila.push(0);
        }
        tableroLogico.push(fila);
    }
}

// Esta función se llama SOLO tras el primer clic
function generarMinas(filaSegura, colSegura) {
    let numMinas = Math.floor(dimension * dimension * 0.2);
    let minasColocadas = 0;
    
    while (minasColocadas < numMinas) {
        let f = Math.floor(Math.random() * dimension);
        let c = Math.floor(Math.random() * dimension);

        // CONDICIÓN CLAVE:
        // No poner mina si ya hay una ('*')
        // NI si es la casilla del click
        // NI si es una casilla adyacente (para asegurar que sea un 0)
        
        // Comprobamos si la coordenada aleatoria (f, c) está cerca de la segura
        // Math.abs devuelve el valor absoluto (la diferencia positiva)
        let distanciaFila = Math.abs(f - filaSegura);
        let distanciaCol = Math.abs(c - colSegura);
        let esZonaSegura = (distanciaFila <= 1 && distanciaCol <= 1);

        if (tableroLogico[f][c] !== '*' && !esZonaSegura) {
            tableroLogico[f][c] = '*';
            minasColocadas++;
        }
    }

    // Una vez colocadas las minas, calculamos los números para todo el tablero
    calcularNumeros();
}

function calcularNumeros() {
    for (let i = 0; i < dimension; i++) {
        for (let j = 0; j < dimension; j++) {
            if (tableroLogico[i][j] === '*') continue;
            
            let contador = 0;
            // Recorrer vecinos
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

// Pinta el tablero en el DOM (igual que antes)
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

            celda.addEventListener("click", clickIzquierdo);
            celda.addEventListener("contextmenu", clickDerecho);

            contenedor.appendChild(celda);
        }
    }
}

function clickIzquierdo(evento) {
    if (juegoTerminado) return;
    let celda = evento.target;
    
    // Evitar clicks en banderas o celdas ya reveladas
    if (celda.classList.contains("revelada") || celda.classList.contains("bandera")) return;

    // Recuperar coordenadas
    let f = parseInt(celda.getAttribute("data-f"));
    let c = parseInt(celda.getAttribute("data-c"));

    // --- LÓGICA DEL PRIMER CLICK ---
    if (esPrimerClick) {
        generarMinas(f, c); // Generamos el mapa excluyendo esta zona
        esPrimerClick = false;   // Ya no es el primer click
        
        // Nota: Como el tableroLogico ha cambiado, al continuar abajo
        // leerá el valor correcto (que será 0 garantizado).
    }
    // -------------------------------

    let valor = tableroLogico[f][c];

    if (valor === '*') {
        celda.classList.add("bomba");
        celda.textContent = "💣";
        gameOver(false);
    } else if (valor === 0) {
        revelarRecursivo(f, c);
    } else {
        celda.classList.add("revelada");
        celda.textContent = valor;
    }
    
    comprobarVictoria();
}

function clickDerecho(evento) {
    evento.preventDefault();
    if (juegoTerminado) return;
    let celda = evento.target;
    if (celda.classList.contains("revelada")) return;

    celda.classList.toggle("bandera");
    if (celda.classList.contains("bandera")) {
        celda.textContent = "🚩";
    } else {
        celda.textContent = "";
    }
}

function revelarRecursivo(f, c) {
    let celda = document.querySelector(`div[data-f="${f}"][data-c="${c}"]`);
    
    if (!celda || celda.classList.contains("revelada") || celda.classList.contains("bandera")) return;

    celda.classList.add("revelada");
    let valor = tableroLogico[f][c];

    if (valor !== 0) {
        celda.textContent = valor;
        return;
    }
    
    celda.textContent = ""; 
    
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

function gameOver(victoria) {
    juegoTerminado = true;
    let mensaje = document.getElementById("mensajeEstado");
    if (victoria) {
        mensaje.textContent = "¡OLE OLEE LOS CARACOLES! Has ganado 🎉";
        mensaje.style.color = "#2ecc71"; // Verde victoria
    } else {
        mensaje.textContent = "¡BOOM! Has perdido 💥";
        mensaje.style.color = "#e74c3c"; // Rojo derrota
        revelarTodasLasMinas();
    }
}

function revelarTodasLasMinas() {
    for (let i = 0; i < dimension; i++) {
        for (let j = 0; j < dimension; j++) {
            if (tableroLogico[i][j] === '*') {
                let celda = document.querySelector(`div[data-f="${i}"][data-c="${j}"]`);
                // Respetamos si el usuario puso una bandera correctamente (opcional)
                if (celda && !celda.classList.contains("bandera")) {
                    celda.classList.add("bomba");
                    celda.textContent = "💣";
                }
            }
        }
    }
}

function comprobarVictoria() {
    let celdas = document.querySelectorAll(".celda");
    let reveladas = 0;
    Array.from(celdas).forEach(c => {
        if (c.classList.contains("revelada")) reveladas++;
    });

    let totalCasillas = dimension * dimension;
    let numMinas = Math.floor(totalCasillas * 0.2);

    if (reveladas === totalCasillas - numMinas) {
        gameOver(true);
    }
}