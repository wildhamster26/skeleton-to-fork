import styles from './Footer.module.scss';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <p>&copy; {new Date().getFullYear()} AppSkeleton. All rights reserved.</p>
      </div>
    </footer>
  );
}
