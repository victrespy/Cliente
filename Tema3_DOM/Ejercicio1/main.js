
// Contador inicial para nuevos elementos
let itemCount = 1;

// Obtener referencias a la lista y el botón
const itemList = document.getElementById('itemList');
const addButton = document.getElementById('addButton');

// Añade un nuevo elemento de lista al UL.
const addItem = () => {
    const newItem = document.createElement('li');
    newItem.textContent = `Elemento ${itemCount}`;
    
    // Los estilos base ya están definidos en el CSS para #itemList li
    
    itemList.appendChild(newItem);
    itemCount++;

    // Eliminar el mensaje de instrucción inicial si existe
    const initialMessage = itemList.querySelector('.initial-message');
    if (initialMessage) {
        initialMessage.remove();
    }
};

// Listener para el botón de añadir
addButton.addEventListener('click', addItem);


itemList.addEventListener('click', (event) => {
    // Usar closest('li') para asegurar que el target es un <li>, incluso si se hace clic en el texto.
    const listItem = event.target.closest('li');

    // Verificar si un elemento LI válido fue clickeado
    if (listItem && itemList.contains(listItem)) {
        // Ignorar el mensaje de instrucción inicial
        if (listItem.classList.contains('initial-message')) {
            return;
        }
        
        // Alternar la clase 'seleccionado'
        listItem.classList.toggle('seleccionado');
    }
});

itemList.addEventListener('dblclick', (event) => {
    // Usar closest('li') para asegurar que el target es un <li>
    const listItem = event.target.closest('li');

    // Verificar si un elemento LI válido fue doble-clickeado
    if (listItem && itemList.contains(listItem)) {
            // Ignorar el mensaje de instrucción inicial
        if (listItem.classList.contains('initial-message')) {
            return;
        }

        // Eliminar el elemento de la lista
        listItem.remove();
    }
});