import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { useAuth } from '../../context/AuthContext';

const INITIAL_STATE = { name: '', email: '', password: '' };

export function useAuthForm(mutation, mutationName) {
  const [form, setForm] = useState(INITIAL_STATE);
  const { login } = useAuth();
  const navigate = useNavigate();

  const [execute, { loading, error }] = useMutation(mutation, {
    onCompleted(data) {
      const result = data[mutationName];
      login(result.token);
      navigate('/dashboard');
    },
  });

  const setField = useCallback((field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  }, []);

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      execute({ variables: form });
    },
    [form, execute]
  );

  return { form, setField, handleSubmit, loading, error };
}
