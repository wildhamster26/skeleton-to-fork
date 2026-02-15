import styles from './Button.module.scss';

export default function Button({ children, variant = 'primary', size = 'md', type = 'button', ...props }) {
  return (
    <button type={type} className={`${styles.btn} ${styles[variant]} ${styles[size]}`} {...props}>
      {children}
    </button>
  );
}
