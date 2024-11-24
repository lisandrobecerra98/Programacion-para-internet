const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const db = new sqlite3.Database('./database.db');

// Middleware
app.use(express.static(path.join(__dirname, '.')));
app.use(express.json());

// Crear la tabla si no existe
db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS tasks (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            task TEXT NOT NULL,
            description TEXT NOT NULL
        )
    `);
});

// Ruta para agregar una tarea
app.post('/tasks', (req, res) => {
    const { task, description } = req.body;

    db.run(
        `INSERT INTO tasks (task, description) VALUES (?, ?)`,
        [task, description],
        (err) => {
            if (err) {
                console.error(err.message);
                res.status(500).send('Error al agregar la tarea.');
            } else {
                res.status(200).send('Tarea agregada correctamente.');
            }
        }
    );
});

// Ruta para obtener la lista de tareas
app.get('/tasks', (req, res) => {
    db.all(`SELECT * FROM tasks`, [], (err, rows) => {
        if (err) {
            console.error(err.message);
            res.status(500).send('Error al obtener las tareas.');
        } else {
            res.json(rows);
        }
    });
});

// Ruta para eliminar una tarea
app.delete('/tasks/:id', (req, res) => {
    const id = req.params.id;

    db.run(`DELETE FROM tasks WHERE id = ?`, [id], (err) => {
        if (err) {
            console.error(err.message);
            res.status(500).send('Error al eliminar la tarea.');
        } else {
            res.status(200).send('Tarea eliminada correctamente.');
        }
    });
});

// Iniciar el servidor
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
