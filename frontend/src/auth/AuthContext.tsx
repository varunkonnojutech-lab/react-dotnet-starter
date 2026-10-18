import { createContext, useContext, useState, type ReactNode } from 'react';
import { api } from '../api/client';

interface AuthState {
  token: string | null;
  username: string | null;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'));
  const [username, setUsername] = useState<string | null>(() => localStorage.getItem('username'));

  async function login(username: string, password: string) {
    const res = await api.login(username, password);
    localStorage.setItem('token', res.token);
    localStorage.setItem('username', username);
    setToken(res.token);
    setUsername(username);
  }

  async function register(username: string, password: string) {
    const res = await api.register(username, password);
    localStorage.setItem('token', res.token);
    localStorage.setItem('username', username);
    setToken(res.token);
    setUsername(username);
  }

  function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    setToken(null);
    setUsername(null);
  }

  return (
    <AuthContext.Provider value={{ token, username, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used inside AuthProvider');
  }
  return ctx;
}
