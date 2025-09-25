function ejercicio(){
    let colores = ["red", "yellow", "green", "white", "blue", "brown", "pink", "black"];

    //Pedir al usuario un numero entre 1 y 5
    do{
        var check = true;
        var num = prompt("Cuantas franjas tiene tu bandera? (1-5): ");
        if(num == null){
            return;
        }
        num = Number(num);
        if(typeof num == 'number' && Number.isInteger(num) && num >= 1 && num <= 5){
            check = false;
        } else {
            alert("Introduce un dato valido");
        }
    } while (check);

    //Generar los colores aleatorios repitiendose
    colores[Math.floor(Math.random() * colores.length)];

    document.writeln("<table><tr>");
    for(let i = 0; i < num; i++){
        let color = colores[Math.floor(Math.random() * colores.length)];
        document.writeln("<td style='background-color: " + color + "; width: 100px; height: 50px;'></td>");
    }
    document.writeln("</tr></table>");

    //Generar los colores aleatorios sin repetirse
    let coloresUsados = [];
    document.writeln("<table><tr>");
    for(let i = 0; i < num; i++){
        let color;
        do{
            color = colores[Math.floor(Math.random() * colores.length)];
        } while(coloresUsados.includes(color));
        coloresUsados.push(color);
        document.writeln("<td style='background-color: " + color + "; width: 100px; height: 50px;'></td>");
    }
    document.writeln("</tr></table>");

    //Generar los colores puediendo repetirse pero sin ser contiguos
    let ultimoColor = "";
    document.writeln("<table><tr>");
    for(let i = 0; i < num; i++){
        let color;
        do{
            color = colores[Math.floor(Math.random() * colores.length)];
        } while(color == ultimoColor);
        ultimoColor = color;
        document.writeln("<td style='background-color: " + color + "; width: 100px; height: 50px;'></td>");
    }
    document.writeln("</tr></table>");
}