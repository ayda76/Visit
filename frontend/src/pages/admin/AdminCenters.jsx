import { useQuery } from 'react-query';
import { centersAPI } from '../../api';
import Spinner from '../../components/common/Spinner';
import { Building2, Phone, MapPin } from 'lucide-react';

export default function AdminCenters() {
  const { data: centers, isLoading } = useQuery(
    'admin-centers', () => centersAPI.list(),
    { select: d => d.data?.results || d.data || [] },
  );

  return (
    <div style={{ padding: '40px 32px' }}>
      <h1 style={{ fontSize: 28, color: 'var(--ink)', marginBottom: 6 }}>Medical Centers</h1>
      <p style={{ color: 'var(--steel)', marginBottom: 28 }}>{centers?.length || 0} centers registered</p>
      {isLoading ? <Spinner /> : !centers?.length ? (
        <div style={{ background: 'var(--white)', border: '1px dashed var(--fog)', borderRadius: 'var(--r-lg)', padding: 60, textAlign: 'center', color: 'var(--steel)' }}>
          <Building2 size={40} style={{ color: 'var(--mist)', marginBottom: 12 }} />
          <p>No centers yet.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))', gap: 16 }}>
          {centers.map(c => (
            <div key={c.id} style={{ background: 'var(--white)', border: '1px solid var(--fog)', borderRadius: 'var(--r-lg)', padding: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                <div style={{ width: 44, height: 44, borderRadius: 'var(--r-sm)', background: 'var(--teal-pale)', color: 'var(--teal)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><Building2 size={20} /></div>
                <div>
                  <h3 style={{ fontSize: 15, fontWeight: 600, color: 'var(--ink)', fontFamily: 'var(--font-b)' }}>{c.name || `Center #${c.id}`}</h3>
                  <p style={{ fontSize: 12, color: 'var(--steel)' }}>ID: #{c.id}</p>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {c.address && <p style={{ display: 'flex', alignItems: 'flex-start', gap: 6, fontSize: 13, color: 'var(--slate)' }}><MapPin size={13} style={{ flexShrink: 0, marginTop: 2 }} />{c.address}</p>}
                {c.phone1 && <p style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--slate)' }}><Phone size={13} />{c.phone1}</p>}
                {c.organizationID && <p style={{ fontSize: 12, color: 'var(--steel)' }}>Org ID: {c.organizationID}</p>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
