import { Link } from 'react-router-dom';
import Button from '../../components/common/Button';
import styles from './NotFound.module.scss';

export default function NotFound() {
  return (
    <div className={styles.page}>
      <h1>404</h1>
      <p>The page you&apos;re looking for doesn&apos;t exist.</p>
      <Link to="/">
        <Button>Back to Home</Button>
      </Link>
    </div>
  );
}
