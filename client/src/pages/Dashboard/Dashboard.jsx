import { useAuth } from '../../context/AuthContext';
import Card from '../../components/common/Card';
import styles from './Dashboard.module.scss';

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <div className={styles.page}>
      <h1>Dashboard</h1>
      <p className={styles.greeting}>Welcome back, {user?.name}!</p>

      <div className={styles.grid}>
        <Card>
          <h3>Profile</h3>
          <p>{user?.email}</p>
          <p className={styles.meta}>Member since account creation</p>
        </Card>

        <Card>
          <h3>Subscription</h3>
          <p className={styles.status}>
            {user?.subscription?.status === 'active'
              ? `Active — ${user.subscription.plan}`
              : 'No active plan'}
          </p>
        </Card>

        <Card>
          <h3>Quick Actions</h3>
          <p className={styles.meta}>
            {/* Placeholder for app-specific actions */}
            Configure your app-specific dashboard widgets here.
          </p>
        </Card>
      </div>
    </div>
  );
}
