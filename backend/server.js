/**
 * To-Do API Server (Express, in-memory)
 *
 * Code Map:
 *   - server.js                : App bootstrap, middleware, 404 & error handlers
 *   - routes/todos.js         : To-do router (CRUD, in-memory store)
 *
 * Base URL:
 *   - /api
 *
 * Endpoints (mounted in routes/todos.js):
 *   - GET    /api/todos           : List all todos
 *   - POST   /api/todos           : Create a new todo
 *   - PUT    /api/todos/:id       : Update a todo (text/completed)
 *   - DELETE /api/todos/:id       : Delete a todo
 *
 * HTTP Status Codes:
 *   - 200 OK
 *   - 201 Created
 *   - 400 Bad Request    : Validation errors
 *   - 404 Not Found      : Todo not found
 *   - 500 Server Error   : Unhandled exceptions
 */

const express = require('express');
const cors = require('cors');
const path = require('path'); // (optional) useful later for static serving

const app = express();
const PORT = process.env.PORT || 3001;

/* ---------------- Middleware ---------------- */
app.use(cors());
app.use(express.json());

/* ---------------- Routes ---------------- */
const todosRouter = require('./routes/todos');
app.use('/api/todos', todosRouter);

// Simple index
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the To-Do API!' });
});


/* ---------------- 404 Handler ---------------- */
app.use((req, res) => {
  res.status(404).json({ error: { code: 404, message: 'Not Found' } });
});

/* ---------------- Global Error Handler ---------------- */
app.use((err, req, res, next) => {
  console.error(err);
  const status = err?.status || 500;
  res.status(status).json({
    error: { code: status, message: err?.message || 'Internal Server Error' },
  });
});

/* ---------------- Start ---------------- */
app.listen(PORT, () => {
  console.log(`API running on http://localhost:${PORT}`);
});
