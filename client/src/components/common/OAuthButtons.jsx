import styles from './OAuthButtons.module.scss';

const API_URL = import.meta.env.VITE_API_URL || '';

const PROVIDERS = [
  { id: 'google', label: 'Google' },
  { id: 'facebook', label: 'Facebook' },
  { id: 'apple', label: 'Apple' },
];

export default function OAuthButtons() {
  return (
    <div className={styles.oauth}>
      <div className={styles.divider}>
        <span>or continue with</span>
      </div>
      <div className={styles.buttons}>
        {PROVIDERS.map(({ id, label }) => (
          <a key={id} href={`${API_URL}/auth/${id}`} className={`${styles.btn} ${styles[id]}`}>
            {label}
          </a>
        ))}
      </div>
    </div>
  );
}
