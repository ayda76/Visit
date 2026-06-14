import { useQuery } from 'react-query';
import { providersAPI } from '../../api';
import Spinner from '../../components/common/Spinner';
import { Stethoscope } from 'lucide-react';

export default function AdminProviders() {
  const { data: providers, isLoading } = useQuery(
    'admin-providers', () => providersAPI.list({ page_size: 100 }),
    { select: d => d.data?.results || d.data || [] },
  );

  return (
    <div style={{ padding: '40px 32px' }}>
      <h1 style={{ fontSize: 28, color: 'var(--ink)', marginBottom: 6 }}>Providers</h1>
      <p style={{ color: 'var(--steel)', marginBottom: 28 }}>{providers?.length || 0} providers on the platform</p>
      {isLoading ? <Spinner /> : (
        <div style={{ background: 'var(--white)', border: '1px solid var(--fog)', borderRadius: 'var(--r-lg)', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--fog)', background: 'var(--paper)' }}>
                {['Name','Center','Active','ID'].map(h => (
                  <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.05em', color: 'var(--steel)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(providers || []).map((p, i) => (
                <tr key={p.id} style={{ borderBottom: '1px solid var(--fog)', background: i % 2 === 0 ? 'var(--white)' : 'var(--paper)' }}>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--teal-pale)', color: 'var(--teal)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 13, flexShrink: 0 }}>{(p.name || 'P')[0]}</div>
                      <span style={{ fontWeight: 500 }}>{p.name}</span>
                    </div>
                  </td>
                  <td style={{ padding: '12px 16px', color: 'var(--slate)' }}>{p.Center_related || '—'}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{ padding: '3px 10px', borderRadius: 99, fontSize: 12, fontWeight: 600, background: p.is_active ? '#ecfdf5' : '#fef2f2', color: p.is_active ? '#065f46' : '#991b1b' }}>
                      {p.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px', color: 'var(--steel)' }}>#{p.id}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
