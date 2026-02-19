export function addTask (text) {
    const tasks = JSON.parse(localStorage.getItem("tasks"));
    const newTask = {
        id: tasks.length,
        text: text
    }
    const newTaskList = [...tasks, newTask];
    localStorage.setItem("tasks", JSON.stringify(newTaskList));
}

export function deleteTask (id) {
    const tasks = JSON.parse(localStorage.getItem("tasks"));
    const newTaskList = tasks.filter((task) => task.id !== id);
    localStorage.setItem("tasks", JSON.stringify(newTaskList));
}