import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Button from '../common/Button';
import styles from './Header.module.scss';

export default function Header() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  function closeMenu() {
    setMenuOpen(false);
  }

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link to="/" className={styles.logo}>
          AppSkeleton
        </Link>

        <button
          className={`${styles.toggle} ${menuOpen ? styles.open : ''}`}
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Toggle navigation"
          aria-expanded={menuOpen}
        >
          <span />
          <span />
          <span />
        </button>

        <nav className={`${styles.nav} ${menuOpen ? styles.navOpen : ''}`}>
          {isAuthenticated ? (
            <>
              <Link to="/dashboard" onClick={closeMenu}>Dashboard</Link>
              <Link to="/payments" onClick={closeMenu}>Pricing</Link>
              {user?.role === 'admin' && (
                <Link to="/admin" onClick={closeMenu}>Admin</Link>
              )}
              <Button variant="secondary" size="sm" onClick={() => { logout(); closeMenu(); }}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={closeMenu}>Login</Link>
              <Button size="sm" onClick={() => { navigate('/register'); closeMenu(); }}>
                Get Started
              </Button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
