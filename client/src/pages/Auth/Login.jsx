import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { LOGIN } from '../../graphql/mutations';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/common/Button';
import styles from './Auth.module.scss';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const { login } = useAuth();
  const navigate = useNavigate();

  const [loginMutation, { loading, error }] = useMutation(LOGIN, {
    onCompleted({ login: data }) {
      login(data.token);
      navigate('/dashboard');
    },
  });

  function handleSubmit(e) {
    e.preventDefault();
    loginMutation({ variables: form });
  }

  return (
    <div className={styles.page}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <h1>Welcome Back</h1>
        {error && <p className={styles.error}>{error.message}</p>}

        <div className={styles.field}>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            required
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
        </div>

        <Button className={styles.submit} disabled={loading}>
          {loading ? 'Logging in...' : 'Log In'}
        </Button>

        <p className={styles.link}>
          Don&apos;t have an account? <Link to="/register">Sign up</Link>
        </p>
      </form>
    </div>
  );
}
