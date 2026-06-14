import { useState } from 'react';
import { useQuery } from 'react-query';
import { appointmentsAPI } from '../../api';
import Spinner from '../../components/common/Spinner';
import { format } from 'date-fns';
import { Calendar, Clock, User } from 'lucide-react';

export default function ProviderAppointments() {
  const [filter, setFilter] = useState('active');

  const { data: appointments, isLoading } = useQuery(
    ['provider-appts', filter],
    () => appointmentsAPI.list({ is_canceled: filter === 'cancelled' }),
    { select: d => d.data?.results || d.data || [] },
  );

  const tabStyle = (t) => ({
    padding: '10px 20px', background: 'none', border: 'none', fontSize: 14, fontWeight: 500,
    color: filter === t ? 'var(--teal-dk)' : 'var(--steel)',
    borderBottom: `2px solid ${filter === t ? 'var(--teal)' : 'transparent'}`,
    marginBottom: -2, cursor: 'pointer', fontFamily: 'var(--font-b)', textTransform: 'capitalize',
  });

  return (
    <div style={{ padding: '40px 32px' }}>
      <h1 style={{ fontSize: 28, color: 'var(--ink)', marginBottom: 8 }}>Reserved Slots</h1>
      <p style={{ color: 'var(--steel)', marginBottom: 28 }}>All appointments booked by patients</p>

      <div style={{ display: 'flex', gap: 4, borderBottom: '2px solid var(--fog)', marginBottom: 24 }}>
        {['active','cancelled'].map(t => (
          <button key={t} style={tabStyle(t)} onClick={() => setFilter(t)}>{t}</button>
        ))}
      </div>

      {isLoading ? <Spinner /> : !appointments?.length ? (
        <div style={{ background: 'var(--white)', border: '1px dashed var(--fog)', borderRadius: 'var(--r-lg)', padding: 60, textAlign: 'center', color: 'var(--steel)' }}>
          <Calendar size={40} style={{ color: 'var(--mist)', marginBottom: 12 }} />
          <p>No {filter} appointments</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {appointments.map(a => (
            <div key={a.id} style={{ display: 'flex', alignItems: 'center', gap: 16, background: 'var(--white)', border: '1px solid var(--fog)', borderRadius: 'var(--r-lg)', padding: '18px 22px', transition: 'box-shadow var(--t)' }}>
              {/* Date badge */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', background: 'var(--ink)', color: '#fff', borderRadius: 'var(--r-sm)', padding: '10px 12px', minWidth: 56, textAlign: 'center', flexShrink: 0 }}>
                <strong style={{ fontSize: 20, fontFamily: 'var(--font-d)' }}>{a.date ? format(new Date(a.date), 'd') : '—'}</strong>
                <span style={{ fontSize: 11, color: 'rgba(255,255,255,.65)' }}>{a.date ? format(new Date(a.date), 'MMM') : ''}</span>
                <span style={{ fontSize: 10, color: 'rgba(255,255,255,.5)' }}>{a.date ? format(new Date(a.date), 'yyyy') : ''}</span>
              </div>

              {/* Patient info */}
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <User size={14} style={{ color: 'var(--teal)' }} />
                  <p style={{ fontSize: 15, fontWeight: 600, color: 'var(--ink)' }}>{a.patient_name || `Patient #${a.patient}`}</p>
                </div>
                <div style={{ display: 'flex', gap: 12, marginTop: 6, flexWrap: 'wrap' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 13, color: 'var(--steel)' }}>
                    <Clock size={13} />{a.start_time?.slice(0,5)} – {a.end_time?.slice(0,5)}
                  </span>
                </div>
              </div>

              {/* Status */}
              <div style={{ flexShrink: 0 }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', padding: '4px 12px', borderRadius: 99, fontSize: 12, fontWeight: 600, background: a.is_canceled ? '#fef2f2' : '#ecfdf5', color: a.is_canceled ? '#991b1b' : '#065f46' }}>
                  {a.is_canceled ? 'Cancelled' : 'Active'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
