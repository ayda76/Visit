import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Stethoscope, Menu, X, ChevronDown, LogOut, User, Calendar } from 'lucide-react';
import s from './Navbar.module.css';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropOpen, setDropOpen] = useState(false);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', h);
    return () => window.removeEventListener('scroll', h);
  }, []);

  const handleLogout = () => { logout(); navigate('/'); setDropOpen(false); };

  return (
    <header className={`${s.bar} ${scrolled ? s.scrolled : ''}`}>
      <div className={s.inner}>
        <Link to="/" className={s.logo}>
          <Stethoscope size={20} strokeWidth={1.8} />
          Visit
        </Link>

        <nav className={s.nav}>
          <NavLink to="/providers" className={({ isActive }) => `${s.link} ${isActive ? s.active : ''}`}>
            Doctors & Centers
          </NavLink>
        </nav>

        <div className={s.right}>
          {user ? (
            <div className={s.userWrap}>
              <button className={s.userBtn} onClick={() => setDropOpen(v => !v)}>
                <span className={s.avatar}>{(user.first_name || user.username || 'U')[0].toUpperCase()}</span>
                <span className={s.userName}>{user.first_name || user.username}</span>
                <ChevronDown size={13} className={dropOpen ? s.rotated : ''} />
              </button>
              {dropOpen && (
                <>
                  <div className={s.backdrop} onClick={() => setDropOpen(false)} />
                  <div className={s.drop}>
                    <Link to="/appointments" className={s.dropItem} onClick={() => setDropOpen(false)}>
                      <Calendar size={14} /> My Appointments
                    </Link>
                    <Link to="/profile" className={s.dropItem} onClick={() => setDropOpen(false)}>
                      <User size={14} /> Profile
                    </Link>
                    <hr className={s.hr} />
                    <button className={`${s.dropItem} ${s.danger}`} onClick={handleLogout}>
                      <LogOut size={14} /> Sign Out
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <>
              <Link to="/login" className={s.loginBtn}>Sign In</Link>
              <Link to="/register" className={s.regBtn}>Get Started</Link>
            </>
          )}
        </div>

        <button className={s.burger} onClick={() => setMobileOpen(v => !v)}>
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {mobileOpen && (
        <div className={s.mobile}>
          <NavLink to="/providers" onClick={() => setMobileOpen(false)} className={s.mLink}>Doctors & Centers</NavLink>
          {user ? (
            <>
              <NavLink to="/appointments" onClick={() => setMobileOpen(false)} className={s.mLink}>My Appointments</NavLink>
              <NavLink to="/profile" onClick={() => setMobileOpen(false)} className={s.mLink}>Profile</NavLink>
              <button className={`${s.mLink} ${s.danger}`} onClick={handleLogout}>Sign Out</button>
            </>
          ) : (
            <>
              <NavLink to="/login" onClick={() => setMobileOpen(false)} className={s.mLink}>Sign In</NavLink>
              <NavLink to="/register" onClick={() => setMobileOpen(false)} className={s.mLink}>Register</NavLink>
            </>
          )}
        </div>
      )}
    </header>
  );
}
