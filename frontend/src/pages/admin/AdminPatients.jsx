import { useQuery } from 'react-query';
import { authAPI } from '../../api';
import Spinner from '../../components/common/Spinner';

export default function AdminPatients() {
  const { data: accounts, isLoading } = useQuery(
    'admin-accounts', () => authAPI.accountList({ role: 'patient' }),
    { select: d => d.data?.results || d.data || [] },
  );

  return (
    <div style={{ padding: '40px 32px' }}>
      <h1 style={{ fontSize: 28, color: 'var(--ink)', marginBottom: 6 }}>Patients</h1>
      <p style={{ color: 'var(--steel)', marginBottom: 28 }}>{accounts?.length || 0} registered patients</p>
      {isLoading ? <Spinner /> : (
        <div style={{ background: 'var(--white)', border: '1px solid var(--fog)', borderRadius: 'var(--r-lg)', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--fog)', background: 'var(--paper)' }}>
                {['Name','Username','Email','Status','Role'].map(h => (
                  <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.05em', color: 'var(--steel)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(accounts || []).map((a, i) => (
                <tr key={a.id} style={{ borderBottom: '1px solid var(--fog)', background: i % 2 === 0 ? 'var(--white)' : 'var(--paper)' }}>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--fog)', color: 'var(--slate)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 13, flexShrink: 0 }}>{(a.firstname || a.user?.username || 'U')[0]?.toUpperCase()}</div>
                      <span style={{ fontWeight: 500 }}>{a.firstname} {a.lastname}</span>
                    </div>
                  </td>
                  <td style={{ padding: '12px 16px', color: 'var(--slate)' }}>@{a.user?.username || '—'}</td>
                  <td style={{ padding: '12px 16px', color: 'var(--slate)' }}>{a.email}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{ padding: '3px 10px', borderRadius: 99, fontSize: 12, fontWeight: 600, background: a.status === 'active' ? '#ecfdf5' : '#fef9e7', color: a.status === 'active' ? '#065f46' : '#92400e', textTransform: 'capitalize' }}>{a.status}</span>
                  </td>
                  <td style={{ padding: '12px 16px', color: 'var(--slate)', textTransform: 'capitalize' }}>{a.role}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
