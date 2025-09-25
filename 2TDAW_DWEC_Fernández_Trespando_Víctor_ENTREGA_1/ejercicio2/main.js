function ejercicio(){
    let kmDia = prompt("Introduce los kilometros que corres al dia: ");
    let kmSemana = kmDia * 7;
    if(kmSemana < 0){
        alert("Introduce un dato valido");
    } else if(kmSemana < 10){
        document.writeln("<h1>Eres un corredor novato</h1>");
    } else if(kmSemana < 30){
        document.writeln("<h1>Eres un corredor iniciado</h1>");
    } else if(kmSemana < 40){
        document.writeln("<h1>Eres un corredor experto</h1>");
    } else if(kmSemana >= 40){
        document.writeln("<h1>Eres un corredor elite</h1>");
    }
}