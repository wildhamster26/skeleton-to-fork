import { useNavigate } from 'react-router-dom';
import Button from '../../components/common/Button';
import styles from './Landing.module.scss';

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className={styles.landing}>
      <section className={styles.hero}>
        <h1 className={styles.title}>
          Build Your Next App <span>Faster</span>
        </h1>
        <p className={styles.subtitle}>
          A production-ready skeleton with authentication, payments, and admin
          dashboard — so you can focus on what makes your app unique.
        </p>
        <div className={styles.cta}>
          <Button size="lg" onClick={() => navigate('/register')}>
            Get Started Free
          </Button>
          <Button variant="secondary" size="lg" onClick={() => navigate('/payments')}>
            View Pricing
          </Button>
        </div>
      </section>

      <section className={styles.features}>
        <h2>Everything You Need</h2>
        <div className={styles.grid}>
          {FEATURES.map((f) => (
            <div key={f.title} className={styles.feature}>
              <h3>{f.title}</h3>
              <p>{f.description}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

const FEATURES = [
  {
    title: 'Authentication',
    description: 'JWT-based auth with login, register, and protected routes out of the box.',
  },
  {
    title: 'Admin Dashboard',
    description: 'Manage users, view stats, and control your app from a dedicated admin panel.',
  },
  {
    title: 'Payments',
    description: 'Lemon Squeezy integration for subscriptions, checkouts, and webhook handling.',
  },
  {
    title: 'GraphQL API',
    description: 'Apollo Server + Client with type-safe queries, mutations, and caching.',
  },
];
