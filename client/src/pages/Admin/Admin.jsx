import { useQuery } from '@apollo/client';
import { ADMIN_STATS } from '../../graphql/queries';
import Card from '../../components/common/Card';
import styles from './Admin.module.scss';

export default function Admin() {
  const { data, loading, error } = useQuery(ADMIN_STATS);

  if (loading) return <div className={styles.page}>Loading...</div>;
  if (error) return <div className={styles.page}>Error: {error.message}</div>;

  const { totalUsers, activeSubscriptions, recentUsers } = data.adminStats;

  return (
    <div className={styles.page}>
      <h1>Admin Dashboard</h1>

      <div className={styles.stats}>
        <Card>
          <p className={styles.statValue}>{totalUsers}</p>
          <p className={styles.statLabel}>Total Users</p>
        </Card>
        <Card>
          <p className={styles.statValue}>{activeSubscriptions}</p>
          <p className={styles.statLabel}>Active Subscriptions</p>
        </Card>
      </div>

      <section className={styles.section}>
        <h2>Recent Users</h2>
        <div className={styles.table}>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Joined</th>
              </tr>
            </thead>
            <tbody>
              {recentUsers.map((u) => (
                <tr key={u.id}>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td>{u.role}</td>
                  <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
