import { useNavigate } from 'react-router-dom';
import Button from '../../components/common/Button';
import styles from './NotFound.module.scss';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className={styles.page}>
      <h1>404</h1>
      <p>The page you&apos;re looking for doesn&apos;t exist.</p>
      <Button onClick={() => navigate('/')}>Back to Home</Button>
    </div>
  );
}
