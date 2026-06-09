import { Link } from 'react-router-dom';
import Btn from '../components/common/Btn';
import { Home } from 'lucide-react';
import s from './NotFound.module.css';

export default function NotFound() {
  return (
    <div className={s.page}>
      <h1>404</h1>
      <h2>Page not found</h2>
      <p>The page you're looking for doesn't exist.</p>
      <Link to="/"><Btn variant="teal" icon={<Home size={15} />}>Back to Home</Btn></Link>
    </div>
  );
}
