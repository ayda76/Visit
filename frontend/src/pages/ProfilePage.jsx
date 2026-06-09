import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../api';
import Btn from '../components/common/Btn';
import toast from 'react-hot-toast';
import { User, Lock } from 'lucide-react';
import s from './ProfilePage.module.css';

export default function ProfilePage() {
  const { user, fetchMe } = useAuth();
  const [tab, setTab]   = useState('profile');
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    first_name: user?.first_name || '', last_name: user?.last_name || '',
    email: user?.email || '', phone: user?.phone || '',
  });
  const [pw, setPw] = useState({ old_password: '', new_password: '', confirm: '' });
  const set   = k => e => setForm(f  => ({ ...f,  [k]: e.target.value }));
  const setPwF= k => e => setPw(f   => ({ ...f,  [k]: e.target.value }));

  const saveProfile = async (e) => {
    e.preventDefault(); setSaving(true);
    try {
      await authAPI.updateMe(form); await fetchMe();
      toast.success('Profile updated!');
    } catch { toast.error('Could not update profile'); }
    finally { setSaving(false); }
  };

  const savePw = async (e) => {
    e.preventDefault();
    if (pw.new_password !== pw.confirm) { toast.error('Passwords do not match'); return; }
    setSaving(true);
    try {
      await authAPI.changePassword({ old_password: pw.old_password, new_password: pw.new_password });
      toast.success('Password changed!');
      setPw({ old_password: '', new_password: '', confirm: '' });
    } catch (err) { toast.error(err?.response?.data?.detail || 'Failed to change password'); }
    finally { setSaving(false); }
  };

  return (
    <div className={s.page}>
      <div className={s.inner}>
        <div className={s.header}>
          <div className={s.avatar}>{(user?.first_name || user?.username || 'U')[0].toUpperCase()}</div>
          <div>
            <h1>{user?.first_name} {user?.last_name}</h1>
            <p>@{user?.username} · {user?.email}</p>
          </div>
        </div>

        <div className={s.tabs}>
          <button className={`${s.tab} ${tab === 'profile'  ? s.active : ''}`} onClick={() => setTab('profile')}>
            <User size={14} /> Profile
          </button>
          <button className={`${s.tab} ${tab === 'password' ? s.active : ''}`} onClick={() => setTab('password')}>
            <Lock size={14} /> Password
          </button>
        </div>

        {tab === 'profile' && (
          <form className={s.form} onSubmit={saveProfile}>
            <div className={s.row}>
              <div className={s.field}><label>First Name</label><input value={form.first_name} onChange={set('first_name')} /></div>
              <div className={s.field}><label>Last Name</label><input value={form.last_name} onChange={set('last_name')} /></div>
            </div>
            <div className={s.field}><label>Email</label><input type="email" value={form.email} onChange={set('email')} /></div>
            <div className={s.field}><label>Phone</label><input type="tel" value={form.phone} onChange={set('phone')} placeholder="+49..." /></div>
            <Btn variant="teal" loading={saving} type="submit">Save Changes</Btn>
          </form>
        )}

        {tab === 'password' && (
          <form className={s.form} onSubmit={savePw}>
            <div className={s.field}><label>Current Password</label><input type="password" value={pw.old_password} onChange={setPwF('old_password')} required /></div>
            <div className={s.field}><label>New Password</label><input type="password" value={pw.new_password} onChange={setPwF('new_password')} required /></div>
            <div className={s.field}><label>Confirm New Password</label><input type="password" value={pw.confirm} onChange={setPwF('confirm')} required /></div>
            <Btn variant="teal" loading={saving} type="submit">Change Password</Btn>
          </form>
        )}
      </div>
    </div>
  );
}
