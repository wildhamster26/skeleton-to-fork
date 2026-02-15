import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children, adminOnly = false }) {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
        Loading...
      </div>
    );
  }

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (adminOnly && user?.role !== 'admin') return <Navigate to="/dashboard" replace />;

  return children;
}
