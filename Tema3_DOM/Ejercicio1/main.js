
let itemCount = 1;

const itemList = document.getElementById('itemList');
const addButton = document.getElementById('addButton');

const addItem = () => {
    const newItem = document.createElement('li');
    newItem.textContent = `Elemento ${itemCount}`;
    
    itemList.appendChild(newItem);
    itemCount++;

    const initialMessage = itemList.querySelector('.initial-message');
    if (initialMessage) {
        initialMessage.remove();
    }
};

addButton.addEventListener('click', addItem);


itemList.addEventListener('click', (event) => {
    const listItem = event.target.closest('li');

    if (listItem && itemList.contains(listItem)) {
        if (listItem.classList.contains('initial-message')) {
            return;
        }
        
        listItem.classList.toggle('seleccionado');
    }
});

itemList.addEventListener('dblclick', (event) => {
    const listItem = event.target.closest('li');

    if (listItem && itemList.contains(listItem)) {
        if (listItem.classList.contains('initial-message')) {
            return;
        }

        if (listItem.classList.contains('seleccionado')) {
            itemList.querySelectorAll('.seleccionado').forEach(item => item.remove());
        } else {
            listItem.remove();
        }
    }
});