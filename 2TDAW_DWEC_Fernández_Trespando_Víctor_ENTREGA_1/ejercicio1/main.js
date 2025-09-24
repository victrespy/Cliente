function ej1(){
    //Pedir al usuario un numero y comprobar si es natural
    do{
        let check = true;
        let num = prompt("Introduce un numero natural: ");
        if(typeof num == 'number' && Number.isInteger(num) && num >= 0){
            check = false;
        } else {
            alert("Introduce un dato valido");
        }
    } while (check);
}