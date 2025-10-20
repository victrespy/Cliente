//Variables globales
var tablero;
var tableroOculto;
var dimension;
var numMinas;

function main() {
    //Pedir dimension del tablero
    do{
        dimension = parseInt(prompt("Ingrese la dimension del tablero:"));
    } while (dimension < 5 || dimension > 20 || isNaN(dimension));

    //Generar numero de minas
    numMinas = Math.floor(dimension * dimension * 0.2);

    //Generar tablero
    tablero = generarTablero(dimension);

    //Colocar minas aleatoriamente
    let minasColocadas = 0;
    while (minasColocadas < numMinas) {
        let fila = Math.floor(Math.random() * dimension);
        let columna = Math.floor(Math.random() * dimension);
        if (tablero[fila][columna] !== '*') {
            tablero[fila][columna] = '*';
            minasColocadas++;
        }
    }

    //Colocar numeros en el tablero
    for (let i = 0; i < dimension; i++) {
        for (let j = 0; j < dimension; j++) {
            if (tablero[i][j] === '*') continue;
            let contador = 0;
            for (let x = -1; x <= 1; x++) {
                for (let y = -1; y <= 1; y++) {
                    if (x === 0 && y === 0) continue;
                    let comprovarFila = i + x;
                    let comprovarColumna = j + y;
                    if (comprovarFila >= 0 && comprovarFila < dimension && comprovarColumna >= 0 && comprovarColumna < dimension) {
                        if (tablero[comprovarFila][comprovarColumna] === '*') {
                            contador++;
                        }
                    }
                }
            }
            tablero[i][j] = contador;
        }
    }

    //Genero un tablero oculto
    tableroOculto = generarTablero(dimension);
    for (let i = 0; i < dimension; i++) {
        for (let j = 0; j < dimension; j++) {
            tableroOculto[i][j] = 'X';
        }
    }

    //Bucle de los turnos
    while (jugarTurno());
}


function jugarTurno() {

    //Mostrar tablero
    console.clear();
    console.log("Tablero:");
    console.table(tableroOculto);

    //Pedir coordenadas
    let fila, columna;
    do {
        fila = parseInt(prompt("Ingrese la fila (0 a " + (dimension - 1) + ") (Numero negativo para salir):"));
        if (fila < 0) break;
        columna = parseInt(prompt("Ingrese la columna (0 a " + (dimension - 1) + ") (Numero negativo para salir):"));
        if (columna < 0) break;
    } while (fila >= dimension || columna >= dimension || isNaN(fila) || isNaN(columna) || tableroOculto[fila][columna] !== 'X');

    //Guardar la partida si el numero es negativo
    if (fila < 0 || columna < 0) {
        guardarPartida();
        return false;
    }

    //Revelar celda
    if (tablero[fila][columna] === '*') {
        console.clear();
        alert("¡BOOM! Has perdido");
        console.table(tablero);
        return false;
    } else {
        tableroOculto[fila][columna] = tablero[fila][columna];
        //Revelar celdas adyacentes si es 0
        if (tablero[fila][columna] === 0) {
            revelarCeldasAdyacentes(fila, columna);
        }
    }

    //Comprobar si ha ganado
    let celdasReveladas = 0;
    for (let i = 0; i < dimension; i++) { //Recorro la matriz y cuento las celdas que no son X
        for (let j = 0; j < dimension; j++) {
            if (tableroOculto[i][j] !== 'X') {
                celdasReveladas++;
            }
        }
    }
    if (celdasReveladas === dimension * dimension - numMinas) {
        console.clear();
        alert("OLE OLEE LOS CARACOLES");
        console.table(tablero);
        return false;
    }

    return true;
}

//Si la celda es 0, revelar las celdas adyacentes
function revelarCeldasAdyacentes(fila, columna) {
    for (let x = -1; x <= 1; x++) {
        for (let y = -1; y <= 1; y++) {
            if (x === 0 && y === 0) continue;
            let comprovarFila = fila + x;
            let comprovarColumna = columna + y;
            if (comprovarFila >= 0 && comprovarFila < dimension && comprovarColumna >= 0 && comprovarColumna < dimension) {
                if (tableroOculto[comprovarFila][comprovarColumna] === 'X' && tablero[comprovarFila][comprovarColumna] !== '*') {
                    tableroOculto[comprovarFila][comprovarColumna] = tablero[comprovarFila][comprovarColumna];
                    if (tablero[comprovarFila][comprovarColumna] === 0) {
                        revelarCeldasAdyacentes(comprovarFila, comprovarColumna);
                    }
                }
            }
        }
    }
}

//Generar tablero vacio
function generarTablero(dimension) {
    let tablero = [];
    for (let i = 0; i < dimension; i++) {
        tablero[i] = [];
        for (let j = 0; j < dimension; j++) {
            tablero[i][j] = 0;
        }
    }
    return tablero;
}

function guardarPartida() {
    let partida = {
        tablero: tablero,
        tableroOculto: tableroOculto,
        dimension: dimension,
        numMinas: numMinas
    };
    console.clear();
    console.log(JSON.stringify(partida));
}