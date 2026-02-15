import { Link } from 'react-router-dom';
import { REGISTER } from '../../graphql/mutations';
import { useAuthForm } from './useAuthForm';
import Button from '../../components/common/Button';
import styles from './Auth.module.scss';

export default function Register() {
  const { form, setField, handleSubmit, loading, error } = useAuthForm(REGISTER, 'register');

  return (
    <div className={styles.page}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <h1>Create Account</h1>
        {error && <p className={styles.error} role="alert">{error.message}</p>}

        <div className={styles.field}>
          <label htmlFor="name">Name</label>
          <input
            id="name"
            type="text"
            required
            value={form.name}
            onChange={(e) => setField('name', e.target.value)}
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            required
            value={form.email}
            onChange={(e) => setField('email', e.target.value)}
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
            onChange={(e) => setField('password', e.target.value)}
          />
        </div>

        <Button type="submit" className={styles.submit} disabled={loading}>
          {loading ? 'Creating account...' : 'Create Account'}
        </Button>

        <p className={styles.link}>
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </form>
    </div>
  );
}
