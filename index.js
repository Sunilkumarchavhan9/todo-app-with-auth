
import express from 'express';
import cors from 'cors';
import { getAllTodo, createTodo, updateTodo, deleteTodo, searchId } from './todo.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

// Serve the HTML file on the root path
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// The search route must come before the general todos route to avoid conflicts
app.get("/todos/search", searchId);

app.get("/todos", getAllTodo);

app.post("/todos", createTodo);

app.put("/todos/:id", updateTodo);

app.delete("/todos/:id", deleteTodo);

// Use environment port or default to 3001
const PORT = process.env.PORT || 3001;
// Listen on all interfaces for Replit, but this will work locally too
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
