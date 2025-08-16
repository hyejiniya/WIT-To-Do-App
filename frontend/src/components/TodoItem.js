/**
 * TodoItem (inline edit with textarea)
 * - Enter: save
 * - Shift+Enter: newline
 * - Esc: cancel
 * - Uses noteColor / noteRotation only
 */

import { useState } from 'react';
import editIcon from '../images/edit.png';

export default function TodoItem({ todo, onToggle, onUpdate, onDelete }) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(todo.text);

  // Start editing
  const doEdit = () => {
    if (todo.completed) return;  // Do not edit completed items
    setValue(todo.text);
    setEditing(true);
  };

  // Cancel editing
  const cancelEdit = () => {
    setEditing(false);
    setValue(todo.text);
  };

  // Commit changes
  const commitEdit = () => {
    const trimmed = (value ?? '').trim();
    setEditing(false);
    if (trimmed && trimmed !== todo.text) {
      onUpdate?.(todo, trimmed);
    }
  };

  // Keyboard shortcuts for editing
  const onKeyDown = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      commitEdit();
    }
    if (event.key === 'Escape') {
      event.preventDefault();
      cancelEdit();
    }
  };

  return (
    <div
      className={`note ${todo.completed ? 'completed' : ''}`}
      style={{
        backgroundColor: todo.noteColor,
        transform: `rotate(${todo.noteRotation})`
      }}
    >
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => onToggle?.(todo)}
      />

      <div className="text" onDoubleClick={doEdit}>
        {editing ? (
          <textarea
            autoFocus
            className="edit__textarea"
            value={value}
            onChange={(err) => setValue(err.target.value)}
            onBlur={commitEdit}
            onKeyDown={onKeyDown}
            placeholder="Edit your to-do"
            rows={4}
          />
        ) : (
          todo.text
        )}
      </div>

      <div className="task-buttons">
        <button
          className="icon-btn"
          onClick={doEdit}
          disabled={todo.completed}
          title={todo.completed ? 'Click the circle bubble to revert, then edit' : 'Edit'}
        >
          <img src={editIcon} alt="Edit" className="edit-icon" />
        </button>

        <button
          className="icon-btn del"
          onClick={() => onDelete?.(todo)}
          title="Delete"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
