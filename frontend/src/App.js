import { useEffect, useState, useCallback } from 'react';
import './style/styles.css';
import AddTodo from './components/AddTodo';
import TodoList from './components/TodoList';
import { fetchTodos, addTodo, updateTodo, deleteTodo } from './api';
import logo from './images/NotForgetToDo_logo.png';
import editIcon from './images/edit.png';

// Sticky note color and rotation helpers
const NOTE_COLORS = ['#fff9c4', '#ffe0e0', '#d7f9f1', '#e3ecff', '#fdebd3'];
const pickColor = (id) => NOTE_COLORS[Math.abs(id) % NOTE_COLORS.length];
const pickRotation = (id) => `${(Math.abs(id * 37) % 7) - 3}deg`;
const withNoteStyle = (t) => ({
  ...t,
  noteColor: pickColor(t.id),
  noteRotation: pickRotation(t.id),
});

export default function App() {
  // State for all todos
  const [todos, setTodos] = useState([]);
  // State for loading indicator when adding a todo
  const [loading, setLoading] = useState(false);
  // Error message for the input panel (left side)
  const [error, setError] = useState('');
  // Error message for the todo list panel (right side)
  const [listError, setListError] = useState('');

  // Progress calculation
  const total = todos.length;
  const completed = todos.filter((t) => t.completed).length;
  const percent = total ? Math.round((completed / total) * 100) : 0;

  // Extract a human-readable error message from API response or error object
  const getErrMsg = (err, fallback) =>
    err?.response?.data?.error?.message || err?.message || fallback || 'Something went wrong.';

  // Fetch initial todos from the API
  useEffect(() => {
    let active = true;
    fetchTodos()
      .then((data) => {
        if (active) setTodos(data.map(withNoteStyle));
      })
      .catch(() => {
        if (active) setError('Failed to load todos!');
      });
    return () => {
      active = false;
    };
  }, []);

  // Add a new todo
  const doAdd = useCallback(async (text) => {
    try {
      setLoading(true);
      setError('');
      const created = await addTodo(text);
      const styled = withNoteStyle(created);
      setTodos((prev) => [styled, ...prev]);
    } catch (err) {
      setError(getErrMsg(err, 'Failed to add to-do!'));
    } finally {
      setLoading(false);
    }
  }, []);

  // Toggle completion status of a todo
  const doToggle = useCallback(async (todo) => {
    setListError('');
    try {
      const updated = await updateTodo(todo.id, { completed: !todo.completed });
      setTodos((curr) =>
        curr.map((t) =>
          t.id === updated.id ? withNoteStyle(updated) : t
        )
      );
    } catch (err) {
      setListError(getErrMsg(err, 'Failed to update to-do.'));
    }
  }, []);

  // Delete a todo
  const doDelete = useCallback(async (todo) => {
    setListError('');
    try {
      await deleteTodo(todo.id);
      setTodos((currTodo) =>
        currTodo.filter((todoItem) => todoItem.id !== todo.id)
      );
    } catch (err) {
      setListError(getErrMsg(err, 'Failed to delete to-do.'));
    }
  }, []);

  // Update the text of an existing todo
  const doUpdate = useCallback(async (todo, newText) => {
    const trimmed = (newText ?? '').trim();
    if (!trimmed || trimmed === todo.text) return;

    setListError('');
    try {
      const updated = await updateTodo(todo.id, { text: trimmed });
      setTodos((currTodo) =>
        currTodo.map((t) =>
          t.id === updated.id ? { ...t, text: updated.text } : t
        )
      );
    } catch (err) {
      setListError(getErrMsg(err, 'Failed to rename to-do.'));
    }
  }, []);

  return (
    <div className="page">
      {/* Logo section */}
      <div className="logo-top">
        <img src={logo} alt="Not Forget To Do Logo" className="logo-image" />
      </div>

      <div className="app">
        {/* Header */}
        <div className="header">
          <h1>Today, not someday.</h1>
          <div className="tagline">
            Get one thing done, no matter how small.
          </div>
        </div>

        {/* Progress bar */}
        <div className="progress">
          <div className="progress__top">
            <span className="progress__text">
              Completed: <strong>{completed}</strong> / <strong>{total}</strong>
            </span>
            <span className="progress__percent">{percent}%</span>
          </div>
          <div className="progress__bar">
            <div
              className="progress__fill"
              style={{ width: `${percent}%` }}
            />
          </div>
        </div>

        {/* Two-column layout: Input panel + Todo board */}
        <div className="grid-two">
          {/* Input panel */}
          <section className="panel panel--input">
            <div className="panel__header">Add a to-do</div>
            <div className="panel__body">
              <AddTodo onAdd={doAdd} loading={loading} />
              {error && <div className="error">{error}</div>}
            </div>
          </section>

          {/* Todo board */}
          <section className="panel panel--board">
            <div className="panel__header">My To-Do Board</div>
            <div className="panel__body">
              <TodoList
                todos={todos}
                onToggle={doToggle}
                onUpdate={doUpdate}
                onDelete={doDelete}
                listError={listError}
                onDismissError={() => setListError('')}
              />
            </div>
          </section>
        </div>

        {/* Footer instructions */}
        <div className="footer">
          <strong>How to Use:</strong>
          &nbsp;Press Enter to add · Double-click text (or click <img src={editIcon} alt="Edit" className="edit-icon" />) to edit ·
          Click the circle bubble
          <input type="checkbox" className="footer-bubble" disabled />
          to mark as done · Click
          <button className="icon-btn del footer-x" disabled>✕</button>
          to delete
        </div>
      </div>
    </div>
  );
}
