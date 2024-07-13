const express = require('express');
const bodyParser = require('body-parser');
const taskController = require('./controllers/taskController');
const rateLimit = require('express-rate-limit');
const logRequest = require('./middleware/requestLogger');

const app = express();
const PORT = 3000;

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100
});
app.use(bodyParser.json(), limiter);
app.use(logRequest);

app.get('/tasks', taskController.getAllTasks);
app.get('/tasks/:id', taskController.getTask);
app.post('/tasks', taskController.createTask);
app.put('/tasks/:id', taskController.updateTask);
app.delete('/tasks/:id', taskController.deleteTask);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
