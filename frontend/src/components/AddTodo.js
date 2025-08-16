/**
 * AddTodo
 * - Controlled input for creating a new to-do.
 * - Classic flow: wait for onAdd (parent will call API), then clear input.
 * - Button is disabled while loading or when the input is empty.
 */

import { useState } from 'react';

export default function AddTodo({ onAdd, loading }) {
  const [text, setText] = useState('');

  // Only allow submit when there's input text and not loading
  const allowSubmit = text.trim().length > 0 && !loading;

  const doSubmit = (e) => {
    e.preventDefault();

    if (!allowSubmit) return;

    onAdd(text.trim());  // parent handles API call
    setText('');         // clear the input after request is triggered
  };

  return (
    <form className="add-to-do" onSubmit={doSubmit}>
      <input
        placeholder="Write a to-do"
        value={text}
        onChange={(err) => setText(err.target.value)}
      />
      <button className="add-btn" type="submit" disabled={!allowSubmit}>
        Add
      </button>
    </form>
  );
}
