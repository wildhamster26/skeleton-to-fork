import { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { useQuery } from '@apollo/client';
import { ME } from '../graphql/queries';
import { client } from '../apollo/client';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => {
    try {
      return localStorage.getItem('token');
    } catch {
      return null;
    }
  });

  const { data, loading, error } = useQuery(ME, {
    skip: !token,
  });

  // If ME query fails (expired/invalid token), clear it
  const user = error ? null : (data?.me ?? null);

  const login = useCallback((newToken) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    setToken(null);
    client.resetStore().catch(() => {});
  }, []);

  const value = useMemo(
    () => ({ user, token, loading, login, logout, isAuthenticated: !!token && !error }),
    [user, token, loading, login, logout, error]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
