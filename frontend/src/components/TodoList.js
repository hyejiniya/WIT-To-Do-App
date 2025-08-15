import TodoItem from './TodoItem';

/**
 * TodoList
 * - Shows an error banner for list actions (toggle/delete/edit) via `listError`.
 * - Renders an empty-state message if there are no todos.
 * - Otherwise renders a grid of sticky-note items.
 * - Forwards item-level handlers (toggle/update/delete) to each TodoItem.
 */
export default function TodoList({
  todos,
  onToggle,
  onUpdate,
  onDelete,
  listError,
  onDismissError
}) {
  // Empty state
  if (!todos.length) {
    return (
      <div className="empty">
        Let’s write down just one small task to finish today!
      </div>
    );
  }

  // List of notes with a dismissible error banner
  return (
    <div>
      {/* Error banner for list-area actions */}
      {typeof listError === 'string' && listError && (
        <div className="alert alert--error" role="alert">
          <span className="alert__text">{listError}</span>
          <button
            type="button"
            className="alert__close"
            onClick={onDismissError}
            title="Dismiss"
          >
            ×
          </button>
        </div>
      )}

      <div className="note-board">
        {todos.map((todo) => (
          <TodoItem
            key={todo.id}
            todo={todo}
            onToggle={onToggle}
            onUpdate={onUpdate}
            onDelete={onDelete}
          />
        ))}
      </div>
    </div>
  );
}
