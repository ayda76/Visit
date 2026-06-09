import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Btn from '../components/common/Btn';
import toast from 'react-hot-toast';
import { Stethoscope, Eye, EyeOff } from 'lucide-react';
import s from './AuthPage.module.css';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm]   = useState({ username: '', password: '' });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(form);
      toast.success('Welcome back!');
      navigate('/');
    } catch (err) {
      toast.error(err?.response?.data?.error || err?.response?.data?.detail || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={s.page}>
      <div className={s.card}>
        <div className={s.logo}><Stethoscope size={20} />Visit</div>
        <h1>Sign In</h1>
        <p className={s.sub}>Welcome back — book your next appointment.</p>
        <form className={s.form} onSubmit={handleSubmit}>
          <div className={s.field}>
            <label>Username</label>
            <input type="text" value={form.username} onChange={set('username')} placeholder="Your username" required />
          </div>
          <div className={s.field}>
            <label>Password</label>
            <div className={s.pwWrap}>
              <input type={showPw ? 'text' : 'password'} value={form.password} onChange={set('password')} placeholder="Your password" required />
              <button type="button" onClick={() => setShowPw(v => !v)}>{showPw ? <EyeOff size={16} /> : <Eye size={16} />}</button>
            </div>
          </div>
          <Btn variant="teal" size="lg" full loading={loading} type="submit">Sign In</Btn>
        </form>
        <p className={s.switch}>Don't have an account? <Link to="/register">Register</Link></p>
      </div>
    </div>
  );
}
