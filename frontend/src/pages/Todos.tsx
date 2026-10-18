import { useEffect, useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { api, type Todo } from '../api/client';
import { useAuth } from '../auth/AuthContext';

export default function Todos() {
  const { username, logout } = useAuth();
  const navigate = useNavigate();
  const [todos, setTodos] = useState<Todo[]>([]);
  const [title, setTitle] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .getTodos()
      .then(setTodos)
      .catch(() => setError('Could not load todos. Is the backend running?'));
  }, []);

  async function handleAdd(e: FormEvent) {
    e.preventDefault();
    if (!title.trim()) {
      return;
    }
    try {
      const created = await api.addTodo(title.trim());
      setTodos((prev) => [...prev, created]);
      setTitle('');
    } catch {
      setError('Could not add todo.');
    }
  }

  async function handleToggle(todo: Todo) {
    try {
      await api.updateTodo(todo.id, todo.title, !todo.isDone);
      setTodos((prev) =>
        prev.map((t) => (t.id === todo.id ? { ...t, isDone: !t.isDone } : t))
      );
    } catch {
      setError('Could not update todo.');
    }
  }

  async function handleDelete(id: number) {
    try {
      await api.deleteTodo(id);
      setTodos((prev) => prev.filter((t) => t.id !== id));
    } catch {
      setError('Could not delete todo.');
    }
  }

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <div className="card wide">
      <div className="header-row">
        <h1>{username ? `${username}'s todos` : 'Todos'}</h1>
        <button className="secondary" onClick={handleLogout}>
          Sign out
        </button>
      </div>
      <form className="row" onSubmit={handleAdd}>
        <input
          placeholder="New todo..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <button type="submit">Add</button>
      </form>
      {error && <p className="error">{error}</p>}
      <ul className="todo-list">
        {todos.map((todo) => (
          <li key={todo.id} className={todo.isDone ? 'done' : ''}>
            <input
              type="checkbox"
              checked={todo.isDone}
              onChange={() => handleToggle(todo)}
              aria-label={`Mark "${todo.title}" as ${todo.isDone ? 'not done' : 'done'}`}
            />
            <span>{todo.title}</span>
            <button className="danger" onClick={() => handleDelete(todo.id)}>
              Delete
            </button>
          </li>
        ))}
      </ul>
      {todos.length === 0 && <p className="muted">No todos yet — add one above.</p>}
    </div>
  );
}
