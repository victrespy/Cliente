import { Task } from "./Task"

export function TaskList ({tasksArray, deleteTask}) {
    return(
        <ul className="task-list">
            {
                tasksArray.map((task) => (
                    <Task key={task.id} task={task} deleteTask={deleteTask}></Task>
                ))
            }
        </ul>
    )
}