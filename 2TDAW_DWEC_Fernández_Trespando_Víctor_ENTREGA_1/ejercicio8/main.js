function ejercicio(){
    let mesas = [];
    let numMesas = prompt("Introduce el número de mesas:");
    for(let i = 0; i < numMesas; i++){
        mesas[i] = Math.floor(Math.random() * 5);
    }
    console.log("Mesas: " + mesas);

    let numComensales;
    do {
        do{
            numComensales = parseInt(prompt("Introduce el número de comensales (0 para salir):"));
            if(numComensales < 0 || numComensales > 4){
                alert("Número de comensales no válido. Debe estar entre 0 y 4.");
            }
        } while(numComensales < 0 || numComensales > 4);

        if(numComensales == 0) break;

        if(mesas.includes(0)){
            alert("Se le ha asignado la mesa " + mesas.indexOf(0));
            mesas[mesas.indexOf(0)] = numComensales;
            console.log("Mesas: " + mesas);
        } else {
            let check = true
            for(let i = 0; i < mesas.length && check; i++){
                if(mesas[i] + numComensales <= 4){
                    alert("Se le ha asignado la mesa " + i);
                    mesas[i] += numComensales;
                    console.log("Mesas: " + mesas);
                    check = false;
                } else if(i == mesas.length - 1){
                    alert("No hay mesas disponibles para " + numComensales + " comensales.");
                }
            }
        }
        
    } while (numComensales >0);
}