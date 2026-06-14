// MyAppointments.jsx
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { appointmentsAPI } from '../api';
import Spinner from '../components/common/Spinner';
import Btn from '../components/common/Btn';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import { Calendar, Clock, CheckCircle, XCircle } from 'lucide-react';

const ST = {
  false: { bg: '#ecfdf5', color: '#065f46', label: 'Active' },
  true:  { bg: '#fef2f2', color: '#991b1b', label: 'Cancelled' },
};

export default function MyAppointments() {
  const qc = useQueryClient();
  const [tab, setTab] = useState('active');
  const { data: appointments, isLoading } = useQuery(
    ['my-appts', tab],
    () => appointmentsAPI.list({ is_canceled: tab === 'cancelled' }),
    { select: d => d.data?.results || d.data || [] },
  );
  const cancel = useMutation(id => appointmentsAPI.cancel(id), {
    onSuccess: () => { toast.success('Appointment cancelled.'); qc.invalidateQueries('my-appts'); },
    onError: () => toast.error('Could not cancel.'),
  });

  return (
    <div style={{ padding: '48px 24px', minHeight: '80vh' }}>
      <div style={{ maxWidth: 800, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 24 }}>
        <h1 style={{ fontSize: 28, color: 'var(--ink)' }}>My Appointments</h1>
        <div style={{ display: 'flex', gap: 4, borderBottom: '2px solid var(--fog)' }}>
          {['active','cancelled'].map(t => (
            <button key={t} onClick={() => setTab(t)} style={{ padding: '10px 20px', background: 'none', border: 'none', fontSize: 14, fontWeight: 500, color: tab === t ? 'var(--teal-dk)' : 'var(--steel)', borderBottom: `2px solid ${tab === t ? 'var(--teal)' : 'transparent'}`, marginBottom: -2, cursor: 'pointer', fontFamily: 'var(--font-b)', textTransform: 'capitalize' }}>
              {t}
            </button>
          ))}
        </div>
        {isLoading ? <Spinner full /> : !appointments?.length ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, padding: '60px 0', color: 'var(--steel)' }}>
            <Calendar size={44} style={{ color: 'var(--mist)' }} />
            <p>No {tab} appointments</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {appointments.map(a => {
              const st = ST[String(a.is_canceled)] || ST.false;
              return (
                <div key={a.id} style={{ display: 'flex', alignItems: 'center', gap: 16, background: 'var(--white)', border: '1px solid var(--fog)', borderRadius: 'var(--r-lg)', padding: '18px 22px', transition: 'box-shadow var(--t)' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', background: 'var(--ink)', color: '#fff', borderRadius: 'var(--r-sm)', padding: '10px 12px', minWidth: 52, textAlign: 'center', flexShrink: 0 }}>
                    <strong style={{ fontSize: 20, fontFamily: 'var(--font-d)' }}>{a.date ? format(new Date(a.date), 'd') : '—'}</strong>
                    <span style={{ fontSize: 11, color: 'rgba(255,255,255,.65)' }}>{a.date ? format(new Date(a.date), 'MMM') : ''}</span>
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: 15, fontWeight: 600 }}>{a.provider_name || `Appointment #${a.id}`}</p>
                    <div style={{ display: 'flex', gap: 10, marginTop: 4, flexWrap: 'wrap' }}>
                      {a.start_time && <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: 'var(--steel)' }}><Clock size={12} />{a.start_time.slice(0,5)} – {a.end_time?.slice(0,5)}</span>}
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 10, flexShrink: 0 }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '4px 10px', borderRadius: 99, fontSize: 12, fontWeight: 600, background: st.bg, color: st.color }}>{st.label}</span>
                    {!a.is_canceled && <Btn variant="danger" size="sm" loading={cancel.isLoading} onClick={() => window.confirm('Cancel this appointment?') && cancel.mutate(a.id)}>Cancel</Btn>}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
