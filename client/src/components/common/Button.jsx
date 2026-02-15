import styles from './Button.module.scss';

export default function Button({ children, variant = 'primary', size = 'md', ...props }) {
  return (
    <button className={`${styles.btn} ${styles[variant]} ${styles[size]}`} {...props}>
      {children}
    </button>
  );
}
