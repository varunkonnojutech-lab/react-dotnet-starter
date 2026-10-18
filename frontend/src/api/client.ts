// Base URL of the .NET backend. Update to match the port printed by `dotnet run`.
const API_BASE = 'https://localhost:7301/api';

export interface Todo {
  id: number;
  title: string;
  isDone: boolean;
}

function authHeaders(): HeadersInit {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders(),
      ...(options.headers ?? {})
    }
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Request failed with status ${res.status}`);
  }

  if (res.status === 204) {
    return undefined as T;
  }

  return (await res.json()) as T;
}

export const api = {
  register: (username: string, password: string) =>
    request<{ token: string }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ username, password })
    }),

  login: (username: string, password: string) =>
    request<{ token: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password })
    }),

  getTodos: () => request<Todo[]>('/todos'),

  addTodo: (title: string) =>
    request<Todo>('/todos', {
      method: 'POST',
      body: JSON.stringify({ title })
    }),

  updateTodo: (id: number, title: string, isDone: boolean) =>
    request<void>(`/todos/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ title, isDone })
    }),

  deleteTodo: (id: number) => request<void>(`/todos/${id}`, { method: 'DELETE' })
};
