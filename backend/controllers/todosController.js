/**
 * To-Do Controller (in-memory store)
 *
 * Code Map:
 *   - getTodos     : GET    /api/todos
 *   - createTodo   : POST   /api/todos
 *   - updateTodo   : PUT    /api/todos/:id
 *   - deleteTodo   : DELETE /api/todos/:id
 *
 * HTTP Status Codes:
 *   - 200 OK            : Success
 *   - 201 Created       : Resource created
 *   - 204 No Content    : Deleted successfully
 *   - 400 Bad Request   : Validation errors
 *   - 404 Not Found     : Todo not found
 *   - 500 Server Error  : Unhandled exceptions
 */

/* ---------------- In-memory store (for assignment) ---------------- */
let todos = [{ id: '001', text: 'Welcome to Not Forget To-Do!', completed: false }];
let nextId = 2;

const getNextId = () => String(nextId++).padStart(3, '0'); // produces '002', '003', ...

/* ---------------- GET /api/todos ---------------- */
/** List all todos */
exports.getTodos = (req, res) => {
  try {
    res.json(todos); // 200
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to get todos!' });
  }
};

/* ---------------- POST /api/todos ---------------- */
/** Create a new todo (body: { text }) */
exports.createTodo = (req, res) => {
  try {
    const { text } = req.body || {};
    const trimmed = typeof text === 'string' ? text.trim() : '';

    if (!trimmed) {
      return res.status(400).json({ error: 'Text is required!' });
    }

    const todo = { id: getNextId(), text: trimmed, completed: false };
    // newest first
    todos.unshift(todo);

    res.status(201).json(todo);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create to-do!' });
  }
};

/* ---------------- PUT /api/todos/:id ---------------- */
/**
 * Update a todo by ID
 * - Accepts { text?, completed? }
 * - Empty string for text is not allowed
 */
exports.updateTodo = (req, res) => {
  try {
    const id = String(req.params.id);
    const target = todos.find((todo) => todo.id === id);

    if (!target) {
      return res.status(404).json({ error: 'Todo not found!' });
    }

    const { text, completed } = req.body || {};

    // Update text (if provided)
    if (typeof text !== 'undefined') {
      const trimmed = typeof text === 'string' ? text.trim() : '';
      if (!trimmed) {
        return res.status(400).json({ error: 'Text cannot be empty!' });
      }
      target.text = trimmed;
    }

    // Update completed (if provided)
    if (typeof completed !== 'undefined') {
      if (typeof completed !== 'boolean') {
        return res.status(400).json({ error: 'Completed must be a boolean!' });
      }
      target.completed = completed;
    }

    res.json(target); // 200
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update to-do!' });
  }
};

/* ---------------- DELETE /api/todos/:id ---------------- */
/** Delete a todo by ID */
exports.deleteTodo = (req, res) => {
  try {
    const id = String(req.params.id);
    const idx = todos.findIndex((t) => t.id === id);

    if (idx === -1) {
      return res.status(404).json({ error: 'Todo not found!' });
    }

    todos.splice(idx, 1);
    res.status(204).send(); // No Content
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete to-do!' });
  }
};
