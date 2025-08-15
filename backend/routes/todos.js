/**
 * To-Do Router
 *
 * Base Path (mounted in server.js):
 *   - /api/todos
 *
 * Endpoints:
 *   - GET    /           : Get all todos
 *   - POST   /           : Create a new todo
 *   - PUT    /:id        : Update a todo by ID
 *   - DELETE /:id        : Delete a todo by ID
 */

const express = require('express');
const router = express.Router();
const {
  getTodos,
  createTodo,
  updateTodo,
  deleteTodo,
} = require('../controllers/todosController');

// GET /api/todos → List all todos
router.get('/', getTodos);

// POST /api/todos → Add a new todo
router.post('/', createTodo);

// PUT /api/todos/:id → Update an existing todo
router.put('/:id', updateTodo);

// DELETE /api/todos/:id → Remove a todo
router.delete('/:id', deleteTodo);

module.exports = router;
