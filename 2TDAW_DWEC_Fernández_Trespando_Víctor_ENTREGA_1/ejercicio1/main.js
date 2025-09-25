function ejercicio1(){
    //Pedir al usuario un numero y comprobar si es natural
    do{
        var check = true;
        var num = prompt("Introduce un numero natural: ");
        if(num == null){
            return;
        }
        num = Number(num);
        if(typeof num == 'number' && Number.isInteger(num) && num > 0){
            check = false;
        } else {
            alert("Introduce un dato valido");
        }
    } while (check);

    //Cuando se introduce un numero natural, realizar las operaciones
    //Calcular los divisores
    let divisores = [];
    for(let i = 1; i <= num; i++){
        if(num % i == 0){
            divisores.push(i);
        }
    }
    alert("Los divisores de " + num + " son: " + divisores.join(", "));

    //Calcular la suma de los cuadrados de los divisores
    let sumaCuadrados = 0;
    for(let i = 0; i < divisores.length; i++){
        sumaCuadrados += Math.pow(divisores[i], 2);
    }
    alert("La suma de los cuadrados de los divisores de " + num + " es: " + sumaCuadrados);

    //Decir si esa suma es un cuadrado o no
    let raiz = Math.sqrt(sumaCuadrados);
    if(Number.isInteger(raiz)){
        alert("La suma de los cuadrados de los divisores de " + num + " es un cuadrado");
    } else {
        alert("La suma de los cuadrados de los divisores de " + num + " no es un cuadrado");
    }
}