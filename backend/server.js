/**
 * To-Do API Server (Express, In-Memory) + React Static Server
 *
 * Overview:
 * - Provides a RESTful API for managing to-do items (CRUD, in-memory storage).
 * - Serves the React frontend build in production mode.
 *
 * File Structure:
 * - server.js         : App bootstrap, middleware setup, static serving, 404 & error handlers
 * - routes/todos.js   : To-do router (CRUD endpoints using in-memory data)
 *
 * Modes:
 * - Development:
 *     "/"      → Returns a simple JSON index message
 *     "/api"   → Handles API requests
 * - Production:
 *     "/"      → Serves React build files
 *     "/api"   → Handles API requests
 *
 * Base API URL:
 * - /api
 *
 * Endpoints (mounted from routes/todos.js):
 * - GET    /api/todos       → Retrieve all to-do items
 * - POST   /api/todos       → Create a new to-do item
 * - PUT    /api/todos/:id   → Update a to-do item (text or completed status)
 * - DELETE /api/todos/:id   → Delete a to-do item
 *
 * HTTP Status Codes:
 * - 200 OK           → Successful request
 * - 201 Created      → Resource successfully created
 * - 400 Bad Request  → Validation error
 * - 404 Not Found    → Resource not found
 * - 500 Server Error → Unexpected server error
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

// Simple index (development only)
if (process.env.NODE_ENV !== 'production') {
  app.get('/', (req, res) => {
    res.json({ message: 'Welcome to the To-Do API! ( for Development)' });
  });
}

/* ---------------- React Static Serving ----------------
 * - Only when running in production (after `npm run build` in frontend)
 */
if (process.env.NODE_ENV === 'production') {
  const buildPath = path.join(__dirname, '..', 'frontend', 'build');
  app.use(express.static(buildPath));

  // Any non-API route → React index.html
 app.get(/^\/(?!api).*/, (req, res) => {
    res.sendFile(path.join(buildPath, 'index.html'));
  });
}

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
