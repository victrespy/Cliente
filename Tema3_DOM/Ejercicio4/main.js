window.onload = function() {

    const botones = document.querySelector('.botones');
    let bucle;

    botones.addEventListener('click', function(e) {

        if (e.target.tagName === 'DIV') {

            clearInterval(bucle);
            let luces = document.querySelectorAll('.luz');

            luces.forEach(elemento => {
                elemento.classList.remove('activo');
            });

            let color = e.target.textContent.toLowerCase();
            let luzSeleccionada = document.querySelector(`.${color}`);
            luzSeleccionada.classList.add('activo');

        } else if (e.target.tagName === 'BUTTON') {

            let luces = document.querySelectorAll('.luz');            
            let colores = ['rojo', 'amarillo', 'verde'];
            let indice = 0;

            bucle = setInterval(function() {
                luces.forEach(elemento => {
                    elemento.classList.remove('activo');
                });
                let luzActual = document.querySelector(`.${colores[indice]}`);
                luzActual.classList.add('activo');
                indice = (indice + 1) % colores.length;
            }, 1000);

        }

    });

};