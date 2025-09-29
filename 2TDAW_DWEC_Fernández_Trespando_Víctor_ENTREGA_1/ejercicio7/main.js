function ejercicio(){
    let numeros = [];

    for(let i=0; i<10; i++){
        let numero = prompt("Introduce un número:");
        numeros.push(numero);
    }

    for(let i=0; i<numeros.length; i++){
        console.log("Índice " + i + ": " + numeros[i]);
    }

    console.log("Cambiamos de posición");
    let inicial, final;

    do {
        inicial = parseInt(prompt("Introduce la posición inicial (0-9):"));
        final = parseInt(prompt("Introduce la posición final (0-9):"));
        if (inicial == null || final == null) {
            return;
        }
    } while (inicial < 0 || inicial > 9 || final < 0 || final > 9 || inicial >= final);

    let numeroInicial = numeros[inicial];
    for (let i = inicial; i > 0; i--) {
        numeros[i] = numeros[i - 1];
    }
    numeros[0] = numeros[numeros.length - 1 ];
    for (let i = numeros.length - 1; i > final; i--) {
        numeros[i] = numeros[i - 1];
    }
    numeros[final] = numeroInicial;

    for(let i=0; i<numeros.length; i++){
        console.log("Índice " + i + ": " + numeros[i]);
    }
}