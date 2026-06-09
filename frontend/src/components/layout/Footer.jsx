import { Link } from 'react-router-dom';
import { Stethoscope } from 'lucide-react';
import s from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={s.footer}>
      <div className={s.inner}>
        <Link to="/" className={s.logo}><Stethoscope size={16} />Visit</Link>
        <nav className={s.links}>
          <Link to="/providers">Doctors & Centers</Link>
          <Link to="/login">Sign In</Link>
          <Link to="/register">Register</Link>
        </nav>
        <p className={s.copy}>© {new Date().getFullYear()} Visit. All rights reserved.</p>
      </div>
    </footer>
  );
}
