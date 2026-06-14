import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Btn from '../components/common/Btn';
import Field from '../components/common/Field';
import toast from 'react-hot-toast';
import { Stethoscope } from 'lucide-react';
import s from './auth.module.css';

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username:'', email:'', firstname:'', lastname:'', password:'', pw2:'' });
  const [loading, setLoading] = useState(false);
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.pw2) { toast.error('Passwords do not match'); return; }
    setLoading(true);
    try {
      // role defaults to "patient" on backend
      await register({ username: form.username, email: form.email, firstname: form.firstname, lastname: form.lastname, password: form.password });
      toast.success('Welcome to Visit!');
      navigate('/');
    } catch (err) {
      const d = err?.response?.data;
      toast.error(typeof d === 'object' ? Object.values(d).flat().join(' ') : 'Registration failed');
    } finally { setLoading(false); }
  };

  return (
    <div className={s.page}>
      <div className={s.card}>
        <div className={s.logo}><Stethoscope size={20}/>Visit</div>
        <h1>Create Account</h1>
        <p className={s.sub}>Register as a patient to book appointments.</p>
        <form className={s.form} onSubmit={handleSubmit}>
          <div className={s.row}>
            <Field label="First Name"><input value={form.firstname} onChange={set('firstname')} placeholder="First name"/></Field>
            <Field label="Last Name"><input value={form.lastname} onChange={set('lastname')} placeholder="Last name"/></Field>
          </div>
          <Field label="Username"><input value={form.username} onChange={set('username')} placeholder="Choose username" required/></Field>
          <Field label="Email"><input type="email" value={form.email} onChange={set('email')} placeholder="your@email.com" required/></Field>
          <Field label="Password"><input type="password" value={form.password} onChange={set('password')} placeholder="Min 8 characters" required/></Field>
          <Field label="Confirm Password"><input type="password" value={form.pw2} onChange={set('pw2')} placeholder="Repeat password" required/></Field>
          <Btn variant="teal" size="lg" full loading={loading} type="submit">Create Account</Btn>
        </form>
        <p className={s.switch}>Already have an account? <Link to="/login">Sign In</Link></p>
        <p className={s.switch}>Are you a doctor or center? <Link to="/provider-signup">Join as Provider</Link></p>
      </div>
    </div>
  );
}
