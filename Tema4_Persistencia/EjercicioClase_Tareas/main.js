// Definimos una constante para la clave ("key") del localStorage. 
// Es buena práctica para no equivocarse al escribirla varias veces (ej. "miLista" vs "miLsta").
const CLAVE_LOCAL = 'miListaWeb';

// Guardamos en una variable la referencia al elemento <ul> del HTML donde pintaremos la lista.
const listaDom = document.getElementById('listaDom');

// --- FUNCIÓN PRINCIPAL PARA PINTAR EN PANTALLA ---
// Esta función se encarga de leer los datos guardados y crear el HTML correspondiente.
const mostrarLista = () => {
    // 1. Limpiamos el contenido actual de la lista <ul> para no duplicar elementos al repintar.
    listaDom.innerHTML = ''; 

    // 2. Recuperamos los datos:
    // - localStorage.getItem(CLAVE_LOCAL): Obtiene la cadena de texto guardada.
    // - JSON.parse(...): Convierte esa cadena de texto de vuelta a un Array de JavaScript.
    // - || []: Si getItem devuelve null (porque es la primera vez y no hay nada), asigna un array vacío para que el código no falle.
    let lista = JSON.parse(localStorage.getItem(CLAVE_LOCAL)) || [];

    // 3. Recorremos el array. 'item' es el texto de la tarea, 'index' es su posición (0, 1, 2...).
    lista.forEach((item, index) => {
        // Creamos un nuevo elemento <li> en memoria (aún no está en el HTML visible).
        const li = document.createElement('li');
        
        // Asignamos el texto de la tarea al <li>.
        li.textContent = item;
        
        // Añadimos un "tooltip" que sale al dejar el ratón encima.
        li.title = "Doble click para borrar";

        // --- EVENTO BORRAR (Doble Clic) ---
        // Le añadimos a CADA elemento su propia función para borrarse.
        li.addEventListener('dblclick', () => {
            // Elimina 1 elemento del array 'lista' situado en la posición 'index'.
            lista.splice(index, 1); 
            
            // Guardamos el array actualizado en localStorage (convirtiéndolo a texto de nuevo).
            localStorage.setItem(CLAVE_LOCAL, JSON.stringify(lista));
            
            // Llamamos recursivamente a mostrarLista() para que borre el HTML viejo y pinte la lista nueva sin el elemento borrado.
            mostrarLista(); 
        });

        // Finalmente, insertamos el <li> que acabamos de configurar dentro del <ul>.
        listaDom.appendChild(li);
    });
};

// --- EVENTO AÑADIR (Click en botón) ---
document.getElementById('btnAnadir').addEventListener('click', () => {
    // Referencia al campo de texto input.
    const input = document.getElementById('inputItem');
    
    // Si el input está vacío, hacemos 'return' para salir de la función y no guardar nada.
    if (!input.value) return;

    // Recuperamos la lista actual del almacenamiento (o array vacío si no existe).
    let lista = JSON.parse(localStorage.getItem(CLAVE_LOCAL)) || [];
    
    // Añadimos el valor escrito en el input al final del array.
    lista.push(input.value);
    
    // Guardamos el array modificado en localStorage convirtiéndolo a String (JSON).
    localStorage.setItem(CLAVE_LOCAL, JSON.stringify(lista));
    
    // Limpiamos el campo de texto para que quede bonito.
    input.value = ''; 
    
    // Actualizamos la vista para que aparezca el nuevo elemento.
    mostrarLista(); 
});

// --- EVENTO LIMPIAR TODO ---
document.getElementById('btnLimpiar').addEventListener('click', () => {
    // Borra TODOS los datos del localStorage asociados a este dominio.
    localStorage.clear();
    
    // Actualizamos la vista (como no hay datos, dejará la lista vacía).
    mostrarLista(); 
});

// --- INICIALIZACIÓN ---
// Ejecutamos la función nada más cargar el script para que, si había datos guardados de una visita anterior, aparezcan al refrescar la página.
mostrarLista();