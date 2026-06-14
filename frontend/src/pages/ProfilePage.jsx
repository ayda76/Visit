import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../api';
import Btn from '../components/common/Btn';
import Field from '../components/common/Field';
import toast from 'react-hot-toast';
import { User, Lock } from 'lucide-react';

export default function ProfilePage() {
  const { user, fetchMe } = useAuth();
  const [tab, setTab] = useState('profile');
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ firstname: user?.firstname || '', lastname: user?.lastname || '', email: user?.email || '', phone: user?.phone || '' });
  const [pw, setPw] = useState({ old_password: '', new_password: '', confirm: '' });
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));
  const setPwF = k => e => setPw(f => ({ ...f, [k]: e.target.value }));

  const saveProfile = async (e) => {
    e.preventDefault(); setSaving(true);
    try { await authAPI.updateMe(form); await fetchMe(); toast.success('Profile updated!'); }
    catch { toast.error('Could not update profile'); }
    finally { setSaving(false); }
  };

  const savePw = async (e) => {
    e.preventDefault();
    if (pw.new_password !== pw.confirm) { toast.error('Passwords do not match'); return; }
    setSaving(true);
    try { await authAPI.changePassword({ old_password: pw.old_password, new_password: pw.new_password }); toast.success('Password changed!'); setPw({ old_password: '', new_password: '', confirm: '' }); }
    catch (err) { toast.error(err?.response?.data?.detail || 'Failed'); }
    finally { setSaving(false); }
  };

  const tabStyle = (t) => ({ padding: '9px 18px', background: 'none', border: 'none', fontSize: 14, fontWeight: 500, color: tab === t ? 'var(--teal-dk)' : 'var(--steel)', borderBottom: `2px solid ${tab === t ? 'var(--teal)' : 'transparent'}`, marginBottom: -2, cursor: 'pointer', fontFamily: 'var(--font-b)', display: 'flex', alignItems: 'center', gap: 6 });

  return (
    <div style={{ padding: '48px 24px', minHeight: '80vh' }}>
      <div style={{ maxWidth: 580, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 28 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          <div style={{ width: 68, height: 68, borderRadius: '50%', background: 'linear-gradient(135deg,var(--teal-pale),var(--teal))', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, fontWeight: 700, fontFamily: 'var(--font-d)', flexShrink: 0 }}>
            {(user?.firstname || user?.username || 'U')[0].toUpperCase()}
          </div>
          <div>
            <h1 style={{ fontSize: 24, color: 'var(--ink)' }}>{user?.firstname} {user?.lastname}</h1>
            <p style={{ fontSize: 14, color: 'var(--steel)', marginTop: 4 }}>@{user?.username} · {user?.role}</p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 4, borderBottom: '2px solid var(--fog)' }}>
          <button style={tabStyle('profile')} onClick={() => setTab('profile')}><User size={14} />Profile</button>
          <button style={tabStyle('password')} onClick={() => setTab('password')}><Lock size={14} />Password</button>
        </div>
        {tab === 'profile' && (
          <form style={{ background: 'var(--white)', border: '1px solid var(--fog)', borderRadius: 'var(--r-lg)', padding: 28, display: 'flex', flexDirection: 'column', gap: 16 }} onSubmit={saveProfile}>
            <div style={{ display: 'flex', gap: 12 }}>
              <Field label="First Name"><input value={form.firstname} onChange={set('firstname')} /></Field>
              <Field label="Last Name"><input value={form.lastname} onChange={set('lastname')} /></Field>
            </div>
            <Field label="Email"><input type="email" value={form.email} onChange={set('email')} /></Field>
            <Field label="Phone"><input type="tel" value={form.phone || ''} onChange={set('phone')} placeholder="+49..." /></Field>
            <Btn variant="teal" loading={saving} type="submit">Save Changes</Btn>
          </form>
        )}
        {tab === 'password' && (
          <form style={{ background: 'var(--white)', border: '1px solid var(--fog)', borderRadius: 'var(--r-lg)', padding: 28, display: 'flex', flexDirection: 'column', gap: 16 }} onSubmit={savePw}>
            <Field label="Current Password"><input type="password" value={pw.old_password} onChange={setPwF('old_password')} required /></Field>
            <Field label="New Password"><input type="password" value={pw.new_password} onChange={setPwF('new_password')} required /></Field>
            <Field label="Confirm New Password"><input type="password" value={pw.confirm} onChange={setPwF('confirm')} required /></Field>
            <Btn variant="teal" loading={saving} type="submit">Change Password</Btn>
          </form>
        )}
      </div>
    </div>
  );
}
