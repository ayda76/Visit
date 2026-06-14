import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Btn from '../components/common/Btn';
import Field from '../components/common/Field';
import toast from 'react-hot-toast';
import { Stethoscope, Eye, EyeOff } from 'lucide-react';
import s from './auth.module.css';

export default function LoginPage() {
  const { login, isAdmin, isProvider, isPending } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', password: '' });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(form);
      // redirect based on role (auth context already updated)
      // we re-read from the hook after fetchMe completes
      toast.success('Welcome back!');
      // navigate based on role after state settles
      setTimeout(() => {
        const role = localStorage.getItem('role_cache') || '';
      }, 0);
    } catch (err) {
      toast.error(err?.response?.data?.error || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  // After login, AuthContext updates; redirect via effect isn't needed because
  // the Guard in App.jsx will redirect automatically on re-render.
  // We just need to go somewhere after login completes.
  const { user } = useAuth();
  if (user) {
    if (user.role === 'admin')                           navigate('/admin', { replace: true });
    else if (['doctor','center_manager'].includes(user.role)) navigate('/provider/dashboard', { replace: true });
    else if (['doctor_pending','center_pending'].includes(user.role)) navigate('/pending', { replace: true });
    else navigate('/', { replace: true });
  }

  return (
    <div className={s.page}>
      <div className={s.card}>
        <div className={s.logo}><Stethoscope size={20}/>Visit</div>
        <h1>Sign In</h1>
        <p className={s.sub}>Welcome back — your appointments are waiting.</p>
        <form className={s.form} onSubmit={handleSubmit}>
          <Field label="Username">
            <input type="text" value={form.username} onChange={set('username')} placeholder="Your username" required />
          </Field>
          <Field label="Password">
            <div className={s.pwWrap}>
              <input type={showPw ? 'text' : 'password'} value={form.password} onChange={set('password')} placeholder="Your password" required />
              <button type="button" className={s.eye} onClick={() => setShowPw(v => !v)}>
                {showPw ? <EyeOff size={16}/> : <Eye size={16}/>}
              </button>
            </div>
          </Field>
          <Btn variant="teal" size="lg" full loading={loading} type="submit">Sign In</Btn>
        </form>
        <p className={s.switch}>No account? <Link to="/register">Register as patient</Link> · <Link to="/provider-signup">Join as provider</Link></p>
      </div>
    </div>
  );
}
