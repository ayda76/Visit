import { useQuery } from 'react-query';
import { applicationsAPI, providersAPI, authAPI } from '../../api';
import Spinner from '../../components/common/Spinner';
import { Link } from 'react-router-dom';
import { FileCheck, Users, Stethoscope, Clock } from 'lucide-react';

export default function AdminDashboard() {
  const { data: apps }      = useQuery('admin-apps',      () => applicationsAPI.list(),       { select: d => d.data?.results || d.data || [] });
  const { data: providers } = useQuery('admin-providers', () => providersAPI.list(),          { select: d => d.data?.results || d.data || [] });
  const { data: accounts }  = useQuery('admin-accounts',  () => authAPI.accountList(),        { select: d => d.data?.results || d.data || [] });

  const pending = (apps || []).filter(a => a.status === 'pending').length;

  const stats = [
    { label: 'Pending Applications', value: pending,              icon: <Clock size={22} />,       color: 'var(--amber)',  bg: '#fef9e7', link: '/admin/applications' },
    { label: 'Total Providers',      value: providers?.length||0, icon: <Stethoscope size={22} />, color: 'var(--teal)',   bg: 'var(--teal-pale)', link: '/admin/providers' },
    { label: 'Total Users',          value: accounts?.length||0,  icon: <Users size={22} />,       color: 'var(--violet)', bg: 'var(--violet-pale)', link: '/admin/patients' },
    { label: 'Total Applications',   value: apps?.length||0,      icon: <FileCheck size={22} />,   color: 'var(--slate)',  bg: 'var(--fog)', link: '/admin/applications' },
  ];

  return (
    <div style={{ padding: '40px 32px' }}>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 28, color: 'var(--ink)' }}>Admin Dashboard</h1>
        <p style={{ color: 'var(--steel)', marginTop: 4 }}>Overview of the platform</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(220px,1fr))', gap: 16, marginBottom: 40 }}>
        {stats.map(s => (
          <Link key={s.label} to={s.link} style={{ background: 'var(--white)', border: '1px solid var(--fog)', borderRadius: 'var(--r-lg)', padding: 22, display: 'flex', alignItems: 'center', gap: 14, transition: 'box-shadow var(--t),transform var(--t)' }}
            onMouseEnter={e => { e.currentTarget.style.boxShadow='var(--sh-md)'; e.currentTarget.style.transform='translateY(-2px)'; }}
            onMouseLeave={e => { e.currentTarget.style.boxShadow=''; e.currentTarget.style.transform=''; }}>
            <div style={{ width: 48, height: 48, borderRadius: 'var(--r-sm)', background: s.bg, color: s.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{s.icon}</div>
            <div>
              <p style={{ fontSize: 28, fontWeight: 700, fontFamily: 'var(--font-d)', color: 'var(--ink)' }}>{s.value}</p>
              <p style={{ fontSize: 13, color: 'var(--steel)' }}>{s.label}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Recent pending apps */}
      <div>
        <h2 style={{ fontSize: 20, marginBottom: 16 }}>Recent Pending Applications</h2>
        {(apps || []).filter(a => a.status === 'pending').slice(0,5).length === 0 ? (
          <p style={{ color: 'var(--steel)', fontSize: 14 }}>No pending applications.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {(apps || []).filter(a => a.status === 'pending').slice(0,5).map(a => (
              <div key={a.id} style={{ background: 'var(--white)', border: '1px solid var(--fog)', borderRadius: 'var(--r-md)', padding: '14px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
                <div>
                  <p style={{ fontWeight: 600, fontSize: 15 }}>{a.account_name || `Application #${a.id}`}</p>
                  <p style={{ fontSize: 13, color: 'var(--steel)', textTransform: 'capitalize' }}>{a.role_requested} · {a.submitted_at ? new Date(a.submitted_at).toLocaleDateString() : ''}</p>
                </div>
                <span style={{ padding: '4px 12px', borderRadius: 99, fontSize: 12, fontWeight: 600, background: '#fef9e7', color: '#92400e' }}>Pending</span>
              </div>
            ))}
          </div>
        )}
        {pending > 0 && <Link to="/admin/applications" style={{ display: 'inline-block', marginTop: 12, fontSize: 14, color: 'var(--teal-dk)', fontWeight: 500 }}>View all applications →</Link>}
      </div>
    </div>
  );
}
