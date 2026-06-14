import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { applicationsAPI } from '../api';
import Btn from '../components/common/Btn';
import Field from '../components/common/Field';
import toast from 'react-hot-toast';
import { Stethoscope, Building2, User } from 'lucide-react';
import s from './auth.module.css';

const ROLES = [
  { value:'doctor_pending',  icon:'🩺', label:'Doctor',         desc:'Individual medical practitioner' },
  { value:'center_pending',  icon:'🏥', label:'Medical Center', desc:'Clinic, hospital or health center' },
];

export default function ProviderSignupPage() {
  const { register, user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(user ? 2 : 1); // skip step 1 if already logged in
  const [role, setRole] = useState('doctor_pending');
  const [reg, setReg] = useState({ username:'', email:'', firstname:'', lastname:'', password:'', pw2:'' });
  const [app, setApp] = useState({ documents: null });
  const [loading, setLoading] = useState(false);
  const setR = k => e => setReg(f => ({ ...f, [k]: e.target.value }));

  // Step 1: Register account with pending role
  const handleRegister = async (e) => {
    e.preventDefault();
    if (reg.password !== reg.pw2) { toast.error('Passwords do not match'); return; }
    setLoading(true);
    try {
      await register({
        username: reg.username, email: reg.email,
        firstname: reg.firstname, lastname: reg.lastname,
        password: reg.password,
        role,   // "doctor_pending" or "center_pending"
      });
      toast.success('Account created! Now submit your application.');
      setStep(2);
    } catch (err) {
      const d = err?.response?.data;
      toast.error(typeof d === 'object' ? Object.values(d).flat().join(' ') : 'Registration failed');
    } finally { setLoading(false); }
  };

  // Step 2: Submit ProviderApplication with documents
  const handleApplication = async (e) => {
    e.preventDefault();
    if (!app.documents) { toast.error('Please upload your documents'); return; }
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append('documents', app.documents);
      fd.append('role_requested', (user?.role || role).replace('_pending',''));
      await applicationsAPI.create(fd);
      toast.success('Application submitted! We will review it shortly.');
      navigate('/pending');
    } catch (err) {
      toast.error(err?.response?.data?.detail || 'Submission failed');
    } finally { setLoading(false); }
  };

  return (
    <div className={s.page}>
      <div className={s.card} style={{ maxWidth: 520 }}>
        <div className={s.logo}><Stethoscope size={20}/>Visit — Provider Registration</div>

        {/* Step indicator */}
        <div style={{ display:'flex', gap:8, marginBottom:24 }}>
          {['Create Account','Submit Application'].map((l,i)=>(
            <div key={i} style={{ flex:1, padding:'8px', borderRadius:'var(--r-sm)', textAlign:'center',
              background: step===i+1 ? 'var(--teal-pale)' : 'var(--fog)',
              color: step===i+1 ? 'var(--teal-dk)' : 'var(--steel)',
              fontSize:13, fontWeight:600 }}>
              {i+1}. {l}
            </div>
          ))}
        </div>

        {step === 1 && (
          <>
            <h1>Join as a Provider</h1>
            <p className={s.sub}>Select your role and create your account.</p>
            <div className={s.roleGrid} style={{ marginBottom:20 }}>
              {ROLES.map(r=>(
                <button key={r.value} type="button"
                  className={`${s.roleCard} ${role===r.value?s.sel:''}`}
                  onClick={()=>setRole(r.value)}>
                  <div className={s.icon}>{r.icon}</div>
                  <p>{r.label}</p>
                  <span>{r.desc}</span>
                </button>
              ))}
            </div>
            <form className={s.form} onSubmit={handleRegister}>
              <div className={s.row}>
                <Field label="First Name"><input value={reg.firstname} onChange={setR('firstname')} placeholder="First name"/></Field>
                <Field label="Last Name"><input value={reg.lastname} onChange={setR('lastname')} placeholder="Last name"/></Field>
              </div>
              <Field label="Username"><input value={reg.username} onChange={setR('username')} placeholder="Choose username" required/></Field>
              <Field label="Email"><input type="email" value={reg.email} onChange={setR('email')} placeholder="your@email.com" required/></Field>
              <Field label="Password"><input type="password" value={reg.password} onChange={setR('password')} placeholder="Min 8 characters" required/></Field>
              <Field label="Confirm Password"><input type="password" value={reg.pw2} onChange={setR('pw2')} placeholder="Repeat password" required/></Field>
              <Btn variant="teal" size="lg" full loading={loading} type="submit">Continue →</Btn>
            </form>
            <p className={s.switch}>Already have an account? <Link to="/login">Sign In</Link></p>
          </>
        )}

        {step === 2 && (
          <>
            <h1>Submit Application</h1>
            <p className={s.sub}>Upload your credentials and supporting documents for review by our admin team.</p>
            <form className={s.form} onSubmit={handleApplication}>
              <Field label="Supporting Documents (PDF, images)">
                <input type="file" accept=".pdf,.jpg,.jpeg,.png"
                  onChange={e => setApp(a => ({ ...a, documents: e.target.files[0] }))}
                  required
                  style={{ padding:'10px 0', border:'none', background:'transparent' }}
                />
              </Field>
              <div style={{ padding:'14px', background:'var(--fog)', borderRadius:'var(--r-sm)', fontSize:13, color:'var(--slate)', lineHeight:1.6 }}>
                📋 Please include: medical license, ID, and any relevant certifications. We will review within 2–3 business days.
              </div>
              <Btn variant="teal" size="lg" full loading={loading} type="submit">Submit Application</Btn>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
