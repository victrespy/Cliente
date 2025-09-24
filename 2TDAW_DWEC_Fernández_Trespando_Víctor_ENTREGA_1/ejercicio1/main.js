function ejercicio1(){
    //Pedir al usuario un numero y comprobar si es natural
    do{
        var check = true;
        let num = prompt("Introduce un numero natural: ");
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
}