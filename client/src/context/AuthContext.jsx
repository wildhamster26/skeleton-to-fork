import { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { useQuery } from '@apollo/client';
import { ME } from '../graphql/queries';
import { client } from '../apollo/client';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('token'));

  const { data, loading } = useQuery(ME, {
    skip: !token,
    fetchPolicy: 'network-only',
  });

  const user = data?.me ?? null;

  const login = useCallback((newToken) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    setToken(null);
    client.resetStore();
  }, []);

  const value = useMemo(
    () => ({ user, token, loading, login, logout, isAuthenticated: !!token }),
    [user, token, loading, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
