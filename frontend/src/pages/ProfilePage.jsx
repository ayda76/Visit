import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../api';
import Button from '../components/common/Button';
import toast from 'react-hot-toast';
import { User, Lock, Save } from 'lucide-react';
import styles from './ProfilePage.module.css';

export default function ProfilePage() {
  const { user, fetchProfile } = useAuth();
  const [tab, setTab] = useState('profile');
  const [form, setForm] = useState({
    first_name: user?.first_name || '',
    last_name:  user?.last_name  || '',
    email:      user?.email      || '',
    phone:      user?.phone      || '',
  });
  const [pwForm, setPwForm] = useState({ old_password: '', new_password: '', confirm_password: '' });
  const [saving, setSaving]   = useState(false);
  const [pwSaving, setPwSaving] = useState(false);

  const set    = k => e => setForm(f => ({ ...f, [k]: e.target.value }));
  const setPw  = k => e => setPwForm(f => ({ ...f, [k]: e.target.value }));

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await authAPI.updateProfile(form);
      await fetchProfile();
      toast.success('Profile updated!');
    } catch {
      toast.error('Could not update profile');
    } finally {
      setSaving(false);
    }
  };

  const handlePwChange = async (e) => {
    e.preventDefault();
    if (pwForm.new_password !== pwForm.confirm_password) {
      toast.error('Passwords do not match'); return;
    }
    setPwSaving(true);
    try {
      await authAPI.changePassword({ old_password: pwForm.old_password, new_password: pwForm.new_password });
      toast.success('Password changed successfully!');
      setPwForm({ old_password: '', new_password: '', confirm_password: '' });
    } catch (err) {
      toast.error(err?.response?.data?.detail || 'Password change failed');
    } finally {
      setPwSaving(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.inner}>
        <div className={styles.header}>
          <div className={styles.avatar}>{(user?.first_name || user?.username || 'U').charAt(0).toUpperCase()}</div>
          <div>
            <h1>{user?.first_name} {user?.last_name}</h1>
            <p>@{user?.username} · {user?.email}</p>
          </div>
        </div>

        <div className={styles.tabs}>
          <button className={`${styles.tab} ${tab === 'profile' ? styles.active : ''}`} onClick={() => setTab('profile')}>
            <User size={15} /> Profile
          </button>
          <button className={`${styles.tab} ${tab === 'password' ? styles.active : ''}`} onClick={() => setTab('password')}>
            <Lock size={15} /> Password
          </button>
        </div>

        {tab === 'profile' && (
          <form className={styles.form} onSubmit={handleSave}>
            <div className={styles.row}>
              <div className={styles.field}>
                <label>First Name</label>
                <input type="text" value={form.first_name} onChange={set('first_name')} placeholder="First name" />
              </div>
              <div className={styles.field}>
                <label>Last Name</label>
                <input type="text" value={form.last_name} onChange={set('last_name')} placeholder="Last name" />
              </div>
            </div>
            <div className={styles.field}>
              <label>Email</label>
              <input type="email" value={form.email} onChange={set('email')} placeholder="Email" />
            </div>
            <div className={styles.field}>
              <label>Phone</label>
              <input type="tel" value={form.phone} onChange={set('phone')} placeholder="Phone number" />
            </div>
            <Button variant="teal" size="md" loading={saving} type="submit" icon={<Save size={15} />}>
              Save Changes
            </Button>
          </form>
        )}

        {tab === 'password' && (
          <form className={styles.form} onSubmit={handlePwChange}>
            <div className={styles.field}>
              <label>Current Password</label>
              <input type="password" value={pwForm.old_password} onChange={setPw('old_password')} placeholder="Current password" required />
            </div>
            <div className={styles.field}>
              <label>New Password</label>
              <input type="password" value={pwForm.new_password} onChange={setPw('new_password')} placeholder="New password" required />
            </div>
            <div className={styles.field}>
              <label>Confirm New Password</label>
              <input type="password" value={pwForm.confirm_password} onChange={setPw('confirm_password')} placeholder="Confirm new password" required />
            </div>
            <Button variant="teal" size="md" loading={pwSaving} type="submit" icon={<Lock size={15} />}>
              Change Password
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
