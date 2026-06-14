import { Link } from 'react-router-dom';
import Btn from '../components/common/Btn';
import { Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div style={{ minHeight: '70vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 24px', textAlign: 'center', gap: 12 }}>
      <h1 style={{ fontSize: 88, color: 'var(--fog)', lineHeight: 1, fontFamily: 'var(--font-d)' }}>404</h1>
      <h2 style={{ fontSize: 24, color: 'var(--ink)' }}>Page not found</h2>
      <p style={{ fontSize: 15, color: 'var(--steel)', marginBottom: 8 }}>The page you're looking for doesn't exist.</p>
      <Link to="/"><Btn variant="teal" icon={<Home size={15} />}>Back to Home</Btn></Link>
    </div>
  );
}
