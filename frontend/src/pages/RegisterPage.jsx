import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Btn from '../components/common/Btn';
import toast from 'react-hot-toast';
import { Stethoscope } from 'lucide-react';
import s from './AuthPage.module.css';

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', email: '', first_name: '', last_name: '', password: '', password2: '' });
  const [loading, setLoading] = useState(false);
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.password2) { toast.error('Passwords do not match'); return; }
    setLoading(true);
    try {
      await register(form);
      toast.success('Account created! Welcome to Visit.');
      navigate('/');
    } catch (err) {
      const data = err?.response?.data;
      const msg = typeof data === 'object' ? Object.values(data).flat().join(' ') : 'Registration failed';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={s.page}>
      <div className={s.card}>
        <div className={s.logo}><Stethoscope size={20} />Visit</div>
        <h1>Create Account</h1>
        <p className={s.sub}>Join Visit to book appointments with top doctors.</p>
        <form className={s.form} onSubmit={handleSubmit}>
          <div className={s.row}>
            <div className={s.field}><label>First Name</label><input type="text" value={form.first_name} onChange={set('first_name')} placeholder="First name" /></div>
            <div className={s.field}><label>Last Name</label><input type="text" value={form.last_name} onChange={set('last_name')} placeholder="Last name" /></div>
          </div>
          <div className={s.field}><label>Username</label><input type="text" value={form.username} onChange={set('username')} placeholder="Choose a username" required /></div>
          <div className={s.field}><label>Email</label><input type="email" value={form.email} onChange={set('email')} placeholder="your@email.com" required /></div>
          <div className={s.field}><label>Password</label><input type="password" value={form.password} onChange={set('password')} placeholder="Min. 8 characters" required /></div>
          <div className={s.field}><label>Confirm Password</label><input type="password" value={form.password2} onChange={set('password2')} placeholder="Repeat password" required /></div>
          <Btn variant="teal" size="lg" full loading={loading} type="submit">Create Account</Btn>
        </form>
        <p className={s.switch}>Already have an account? <Link to="/login">Sign In</Link></p>
      </div>
    </div>
  );
}
