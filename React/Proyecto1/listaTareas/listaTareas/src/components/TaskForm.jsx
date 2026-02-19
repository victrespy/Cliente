import { useState } from 'react'

export function TaskForm ({addTarea}) {

    const [input, setInput] = useState("")

    function handleSubmit (e) {
        e.preventDefault();
        if (!input.trim()) return;
        addTarea(input);
        setInput("");
    }


    return(
        <form className="task-form" onSubmit={handleSubmit}>
            <input type="text" placeholder="Escribe una tarea" value={input} onChange={(e) => setInput(e.target.value)}></input>
            <button type="submit">Agregar</button>
        </form>
    )
}