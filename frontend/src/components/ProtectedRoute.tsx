import { Navigate, type ReactNode } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const { token } = useAuth();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
