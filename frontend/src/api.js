import axios from 'axios';

/**
 * Returns the base URL for API requests.
 * - Uses REACT_APP_API_BASE when provided (Create React App).
 * - Falls back to a relative "/api" path (works with CRA proxy in dev).
 */
const getBaseURL = () => {
  const envBase = process.env.REACT_APP_API_BASE;
  if (envBase) return envBase;
  return '/api';
};

/**
 * Shared Axios instance for all API calls.
 * - Centralizes baseURL and timeout.
 * - You can add interceptors here later if needed.
 */
const api = axios.create({
  baseURL: getBaseURL(),
  timeout: 10000, // 10s timeout for slow networks
});

/** Fetch all todos */
export const fetchTodos = () =>
  api.get('/todos').then((res) => res.data);

/** Add a new todo */
export const addTodo = (text) =>
  api.post('/todos', { text }).then((res) => res.data);

/**
 * Update an existing todo by ID
 * @param {string|number} id - todo id
 * @param {object} updateData - fields to update (e.g., { text }, { completed })
 */
export const updateTodo = (id, updateData) =>
  api.put(`/todos/${id}`, updateData).then((res) => res.data);

/** Delete a todo by ID */
export const deleteTodo = (id) =>
  api.delete(`/todos/${id}`).then((res) => res.data);

export default api;
