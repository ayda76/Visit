import { Link } from 'react-router-dom';
import Button from '../components/common/Button';
import { Home } from 'lucide-react';
import styles from './NotFoundPage.module.css';

export default function NotFoundPage() {
  return (
    <div className={styles.page}>
      <h1 className={styles.code}>404</h1>
      <h2>Page not found</h2>
      <p>The page you're looking for doesn't exist or has been moved.</p>
      <Link to="/">
        <Button variant="teal" icon={<Home size={16} />}>Back to Home</Button>
      </Link>
    </div>
  );
}
