import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { REGISTER } from '../../graphql/mutations';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/common/Button';
import styles from './Auth.module.scss';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const { login } = useAuth();
  const navigate = useNavigate();

  const [registerMutation, { loading, error }] = useMutation(REGISTER, {
    onCompleted({ register: data }) {
      login(data.token);
      navigate('/dashboard');
    },
  });

  function handleSubmit(e) {
    e.preventDefault();
    registerMutation({ variables: form });
  }

  return (
    <div className={styles.page}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <h1>Create Account</h1>
        {error && <p className={styles.error}>{error.message}</p>}

        <div className={styles.field}>
          <label htmlFor="name">Name</label>
          <input
            id="name"
            type="text"
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </div>

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
            minLength={8}
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
        </div>

        <Button className={styles.submit} disabled={loading}>
          {loading ? 'Creating account...' : 'Create Account'}
        </Button>

        <p className={styles.link}>
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </form>
    </div>
  );
}
