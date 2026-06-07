import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import NotificationBell from '../common/NotificationBell';
import styles from './Navbar.module.css';
import { Menu, X, Stethoscope, ChevronDown, LogOut, User, Calendar } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [dropOpen, setDropOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
    setDropOpen(false);
  };

  return (
    <header className={`${styles.header} ${scrolled ? styles.scrolled : ''}`}>
      <div className={styles.inner}>
        {/* Logo */}
        <Link to="/" className={styles.logo}>
          <Stethoscope size={22} strokeWidth={1.8} />
          <span>Visit</span>
        </Link>

        {/* Desktop nav */}
        <nav className={styles.nav}>
          <NavLink to="/doctors" className={({ isActive }) => isActive ? `${styles.link} ${styles.active}` : styles.link}>
            Doctors
          </NavLink>
          <NavLink to="/centers" className={({ isActive }) => isActive ? `${styles.link} ${styles.active}` : styles.link}>
            Medical Centers
          </NavLink>
        </nav>

        {/* Auth actions */}
        <div className={styles.actions}>
          {user ? (
            <>
              <NotificationBell />
              <div className={styles.userMenu}>
                <button className={styles.userBtn} onClick={() => setDropOpen(v => !v)}>
                  <div className={styles.avatar}>
                    {user.first_name?.[0] || user.username?.[0] || 'U'}
                  </div>
                  <span className={styles.userName}>{user.first_name || user.username}</span>
                  <ChevronDown size={14} className={dropOpen ? styles.chevronUp : ''} />
                </button>
                {dropOpen && (
                  <div className={styles.dropdown}>
                    <Link to="/dashboard" className={styles.dropItem} onClick={() => setDropOpen(false)}>
                      <Calendar size={15} /> Dashboard
                    </Link>
                    <Link to="/appointments" className={styles.dropItem} onClick={() => setDropOpen(false)}>
                      <Calendar size={15} /> My Appointments
                    </Link>
                    <Link to="/profile" className={styles.dropItem} onClick={() => setDropOpen(false)}>
                      <User size={15} /> Profile
                    </Link>
                    <hr className={styles.divider} />
                    <button className={`${styles.dropItem} ${styles.danger}`} onClick={handleLogout}>
                      <LogOut size={15} /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className={styles.loginBtn}>Sign In</Link>
              <Link to="/register" className={styles.registerBtn}>Get Started</Link>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button className={styles.burger} onClick={() => setMenuOpen(v => !v)} aria-label="Menu">
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className={styles.mobileMenu}>
          <NavLink to="/doctors" onClick={() => setMenuOpen(false)} className={styles.mobileLink}>Doctors</NavLink>
          <NavLink to="/centers" onClick={() => setMenuOpen(false)} className={styles.mobileLink}>Medical Centers</NavLink>
          {user ? (
            <>
              <NavLink to="/dashboard" onClick={() => setMenuOpen(false)} className={styles.mobileLink}>Dashboard</NavLink>
              <NavLink to="/appointments" onClick={() => setMenuOpen(false)} className={styles.mobileLink}>Appointments</NavLink>
              <NavLink to="/profile" onClick={() => setMenuOpen(false)} className={styles.mobileLink}>Profile</NavLink>
              <button className={`${styles.mobileLink} ${styles.danger}`} onClick={handleLogout}>Sign Out</button>
            </>
          ) : (
            <>
              <NavLink to="/login" onClick={() => setMenuOpen(false)} className={styles.mobileLink}>Sign In</NavLink>
              <NavLink to="/register" onClick={() => setMenuOpen(false)} className={styles.mobileLink}>Register</NavLink>
            </>
          )}
        </div>
      )}
    </header>
  );
}
