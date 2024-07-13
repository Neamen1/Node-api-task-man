const db = require('./database');  // Assuming you create a separate module for the database connection

// Get all tasks
exports.getAllTasks = (req, res) => {
    const { status, sort } = req.query;
    let sql = "SELECT * FROM tasks";
    const params = [];

    if (status) {
        sql += " WHERE status = ?";
        params.push(status);
    }

    if (sort === 'progress') {
        sql += " ORDER BY progress";
    } else if (sort === 'id') {
        sql += " ORDER BY id";
    }

    db.all(sql, params, (err, rows) => {
        if (err) {
            res.status(400).send(err.message);
            return;
        }
        res.json(rows);
    });
};

// Get a single task
exports.getTask = (req, res) => {
    const sql = "SELECT * FROM tasks WHERE id = ?";
    const params = [req.params.id];

    db.get(sql, params, (err, row) => {
        if (err) {
            res.status(400).send(err.message);
            return;
        }
        if (row) {
            res.json(row);
        } else {
            res.status(404).send('Task not found');
        }
    });
};

// Create a new task
exports.createTask = (req, res) => {
    const { title, description, status, progress } = req.body;
    const sql = `INSERT INTO tasks (title, description, status, progress) VALUES (?, ?, ?, ?)`;

    db.run(sql, [title, description, status, progress], function(err) {
        if (err) {
            res.status(400).send(err.message);
            return;
        }
        res.status(201).send(`A new task has been created with ID ${this.lastID}`);
    });
};

// Update an existing task
exports.updateTask = (req, res) => {
    const { title, description, status, progress } = req.body;
    const sql = `UPDATE tasks SET title = ?, description = ?, status = ?, progress = ? WHERE id = ?`;

    db.run(sql, [title, description, status, progress, req.params.id], function(err) {
        if (err) {
            res.status(400).send(err.message);
            return;
        }
        if (this.changes === 0) {
            res.status(404).send('Task not found');
        } else {
            res.status(200).send(`Task updated successfully`);
        }
    });
};

// Delete a task
exports.deleteTask = (req, res) => {
    const sql = "DELETE FROM tasks WHERE id = ?";
    db.run(sql, [req.params.id], function(err) {
        if (err) {
            res.status(400).send(err.message);
            return;
        }
        if (this.changes === 0) {
            res.status(404).send('Task not found');
        } else {
            res.status(204).send(''); // No content to send back
        }
    });
};
