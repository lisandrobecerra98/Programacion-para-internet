// Manejar envío del formulario
document.getElementById('taskForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    const task = document.getElementById('task').value;
    const description = document.getElementById('description').value;

    const response = await fetch('/tasks', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ task, description }),
    });

    const messageDiv = document.getElementById('message');

    if (response.ok) {
        messageDiv.textContent = 'Tarea agregada correctamente.';
        messageDiv.style.color = 'green';
        loadTasks(); // Recargar la lista de tareas
        document.getElementById('taskForm').reset(); // Limpiar el formulario
    } else {
        messageDiv.textContent = 'Error al agregar la tarea.';
        messageDiv.style.color = 'red';
    }
});

// Función para cargar las tareas
async function loadTasks() {
    const response = await fetch('/tasks');
    const tasks = await response.json();

    const tableBody = document.querySelector('#tasksTable tbody');
    tableBody.innerHTML = ''; // Limpiar tabla antes de llenarla

    tasks.forEach((task) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${task.id}</td>
            <td>${task.task}</td>
            <td>${task.description}</td>
            <td><button onclick="deleteTask(${task.id})">Eliminar</button></td>
        `;
        tableBody.appendChild(row);
    });
}

// Función para eliminar una tarea
async function deleteTask(id) {
    const response = await fetch(`/tasks/${id}`, { method: 'DELETE' });

    if (response.ok) {
        loadTasks(); // Recargar la lista de tareas
    } else {
        alert('Error al eliminar la tarea.');
    }
}

// Cargar las tareas al cargar la página
document.addEventListener('DOMContentLoaded', loadTasks);
