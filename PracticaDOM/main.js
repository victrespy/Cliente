// Variables globales de estado
let tableroLogico = [];
let dimension = 10;
let numMinas = 0;
let juegoTerminado = false;
let esPrimerClick = true; // Nueva variable de control

function iniciarJuego() {
    const inputDim = document.getElementById("dimension");
    dimension = parseInt(inputDim.value);

    if (isNaN(dimension) || dimension < 5 || dimension > 20) {
        alert("Por favor, introduce una dimensión entre 5 y 20.");
        return;
    }

    // Reiniciar estado
    juegoTerminado = false;
    esPrimerClick = true; // Reseteamos para la nueva partida
    document.getElementById("mensaje").textContent = "";
    numMinas = Math.floor(dimension * dimension * 0.2);
    
    // 1. Inicializamos el tablero lógico VACÍO (todo ceros)
    inicializarTableroVacio();
    
    // 2. Pintamos el tablero visual (sin minas reales todavía)
    generarHTML();
}

function inicializarTableroVacio() {
    tableroLogico = [];
    for (let i = 0; i < dimension; i++) {
        tableroLogico[i] = new Array(dimension).fill(0);
    }
}

// Esta función se llama SOLO tras el primer clic
function generarMinas(filaSegura, colSegura) {
    let minasColocadas = 0;
    
    while (minasColocadas < numMinas) {
        let f = Math.floor(Math.random() * dimension);
        let c = Math.floor(Math.random() * dimension);

        // CONDICIÓN CLAVE:
        // No poner mina si ya hay una ('*')
        // NI si es la casilla del click
        // NI si es una casilla adyacente (para asegurar que sea un 0)
        
        let esZonaSegura = (Math.abs(f - filaSegura) <= 1 && Math.abs(c - colSegura) <= 1);

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

// Pinta el tablero en el DOM
function generarHTML() {
    const contenedor = document.getElementById("tablero-juego");
    contenedor.innerHTML = "";
    contenedor.style.gridTemplateColumns = `repeat(${dimension}, 1fr)`;

    for (let i = 0; i < dimension; i++) {
        for (let j = 0; j < dimension; j++) {
            const celda = document.createElement("div");
            celda.classList.add("celda");
            celda.dataset.fila = i;
            celda.dataset.col = j;
            celda.dataset.revelada = "false";

            celda.addEventListener("click", () => clicCelda(i, j, celda));
            celda.addEventListener("contextmenu", (e) => {
                e.preventDefault();
                alternarBandera(celda);
            });

            contenedor.appendChild(celda);
        }
    }
}

function clicCelda(fila, col, elemento) {
    if (juegoTerminado || elemento.dataset.revelada === "true" || elemento.classList.contains("bandera")) return;

    // --- LÓGICA DEL PRIMER CLICK ---
    if (esPrimerClick) {
        generarMinas(fila, col); // Generamos el mapa excluyendo esta zona
        esPrimerClick = false;   // Ya no es el primer click
        
        // Nota: Como el tableroLogico ha cambiado, al continuar abajo
        // leerá el valor correcto (que será 0 garantizado).
    }
    // -------------------------------

    const valor = tableroLogico[fila][col];

    if (valor === '*') {
        elemento.classList.add("bomba");
        elemento.textContent = "💣";
        terminarJuego(false);
    } 
    else if (valor > 0) {
        revelarVisualmente(elemento, valor);
        comprobarVictoria();
    } 
    else {
        revelarRecursivo(fila, col);
        comprobarVictoria();
    }
}

function alternarBandera(elemento) {
    if (juegoTerminado || elemento.dataset.revelada === "true") return;
    elemento.classList.toggle("bandera");
    elemento.textContent = elemento.classList.contains("bandera") ? "🚩" : "";
}

function revelarVisualmente(elemento, valor) {
    // Si ya estaba revelada, no hacemos nada (evita bucles raros o repintados)
    if(elemento.dataset.revelada === "true") return;

    elemento.dataset.revelada = "true";
    elemento.classList.add("revelada");
    if (valor !== 0) {
        elemento.textContent = valor;
        elemento.classList.add(`num-${valor}`);
    }
}

function revelarRecursivo(fila, col) {
    const selector = `.celda[data-fila="${fila}"][data-col="${col}"]`;
    const elemento = document.querySelector(selector);

    if (!elemento || elemento.dataset.revelada === "true" || elemento.classList.contains("bandera")) return;

    const valor = tableroLogico[fila][col];
    revelarVisualmente(elemento, valor);

    if (valor === 0) {
        for (let x = -1; x <= 1; x++) {
            for (let y = -1; y <= 1; y++) {
                let f = fila + x;
                let c = col + y;
                if (f >= 0 && f < dimension && c >= 0 && c < dimension) {
                    revelarRecursivo(f, c);
                }
            }
        }
    }
}

function terminarJuego(victoria) {
    juegoTerminado = true;
    const msg = document.getElementById("mensaje");
    if (victoria) {
        msg.textContent = "¡OLE OLEE LOS CARACOLES! Has ganado 🎉";
        msg.style.color = "#2ecc71";
    } else {
        msg.textContent = "¡BOOM! Has perdido 💥";
        msg.style.color = "#e74c3c";
        revelarTodasLasMinas();
    }
}

function revelarTodasLasMinas() {
    for (let i = 0; i < dimension; i++) {
        for (let j = 0; j < dimension; j++) {
            if (tableroLogico[i][j] === '*') {
                const celda = document.querySelector(`.celda[data-fila="${i}"][data-col="${j}"]`);
                if(celda && !celda.classList.contains("bandera")) { // Opcional: no revelar si tenía bandera bien puesta
                    celda.classList.add("bomba");
                    celda.textContent = "💣";
                }
            }
        }
    }
}

function comprobarVictoria() {
    const celdas = document.querySelectorAll(".celda");
    let reveladas = 0;
    celdas.forEach(c => {
        if (c.dataset.revelada === "true") reveladas++;
    });

    const totalCeldas = dimension * dimension;
    // Si las celdas reveladas + las minas son el total, has ganado
    if (reveladas === totalCeldas - numMinas) {
        terminarJuego(true);
    }
}