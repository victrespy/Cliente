// Le pasamos el objeto tarea como props a este componente, y lo renderizamos
// Entendemos el objeto tarea como un objeto con una propiedad text, que es el texto de la tarea
export function Task ({task, deleteTask}) {
    return(
        <li className="task">
            <span>{task.text}</span>
            <button onClick={() => deleteTask(task.id)}>
                X
            </button>
        </li>
    )
}