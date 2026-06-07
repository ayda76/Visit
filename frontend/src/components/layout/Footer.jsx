import { Link } from 'react-router-dom';
import { Stethoscope, Heart } from 'lucide-react';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.brand}>
          <Link to="/" className={styles.logo}>
            <Stethoscope size={18} strokeWidth={1.8} />
            <span>Visit</span>
          </Link>
          <p>Connecting patients with trusted healthcare professionals.</p>
        </div>
        <nav className={styles.links}>
          <div>
            <h4>Services</h4>
            <Link to="/doctors">Find a Doctor</Link>
            <Link to="/centers">Medical Centers</Link>
          </div>
          <div>
            <h4>Account</h4>
            <Link to="/login">Sign In</Link>
            <Link to="/register">Register</Link>
            <Link to="/dashboard">Dashboard</Link>
          </div>
        </nav>
      </div>
      <div className={styles.bottom}>
        <span>© {new Date().getFullYear()} Visit. All rights reserved.</span>
        <span className={styles.credit}>Made with <Heart size={12} fill="currentColor" /> for better healthcare</span>
      </div>
    </footer>
  );
}
