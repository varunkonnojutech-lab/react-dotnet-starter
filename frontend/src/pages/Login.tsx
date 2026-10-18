import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    try {
      await login(username, password);
      navigate('/todos');
    } catch {
      setError('Invalid username or password.');
    }
  }

  return (
    <div className="card">
      <h1>Sign in</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Username
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
            required
          />
        </label>
        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
          />
        </label>
        {error && <p className="error">{error}</p>}
        <button type="submit">Sign in</button>
      </form>
      <p>
        No account? <Link to="/register">Register</Link>
      </p>
    </div>
  );
}
