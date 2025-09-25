function ejercicio(){
    let colores = ["red", "yellow", "green", "white", "blue", "brown", "pink", "black"];
    let frase = [];
    //Pedir al usuario 8 palabras
    for(let i=0; i<8; i++){
        let palabra = prompt("Introduce una palabra:");
        if(colores.includes(palabra)){
            frase.unshift(palabra);
        }else{
            frase.push(palabra);
        }
    }

    console.log(frase);
}