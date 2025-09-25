function ejercicio(){
    
    let presupuesto = prompt("Introduce el presupuesto total de la obra: ");
    if(presupuesto <= 0){
        document.writeln("<h1>Error: Presupuesto no valido</h1>");
    } else {
        let materiales = presupuesto * 0.5;
        let licencias = presupuesto * 0.3;
        let mano = presupuesto * 0.2;

        document.writeln("<h1>Presupuesto de la obra</h1>");
        document.writeln(`<ul>
                            <li>Materiales: ${materiales}€</li>
                            <li>Licencias de obra: ${licencias}€</li>
                            <li>Mano de obra: ${mano}€</li>
                        </ul>`);
    }
}