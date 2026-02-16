import { Link, useSearchParams } from 'react-router-dom';
import { LOGIN } from '../../graphql/mutations';
import { useAuthForm } from './useAuthForm';
import Button from '../../components/common/Button';
import OAuthButtons from '../../components/common/OAuthButtons';
import styles from './Auth.module.scss';

const OAUTH_ERRORS = {
  oauth_failed: 'Social login failed. Please try again or use email.',
};

export default function Login() {
  const { form, setField, handleSubmit, loading, error } = useAuthForm(LOGIN, 'login');
  const [params] = useSearchParams();
  const oauthError = params.get('error');

  return (
    <div className={styles.page}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <h1>Welcome Back</h1>
        {(error || oauthError) && (
          <p className={styles.error} role="alert">
            {error?.message || OAUTH_ERRORS[oauthError] || 'Login failed'}
          </p>
        )}

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
            value={form.password}
            onChange={(e) => setField('password', e.target.value)}
          />
        </div>

        <Button type="submit" className={styles.submit} disabled={loading}>
          {loading ? 'Logging in...' : 'Log In'}
        </Button>

        <OAuthButtons />

        <p className={styles.link}>
          Don&apos;t have an account? <Link to="/register">Sign up</Link>
        </p>
      </form>
    </div>
  );
}
