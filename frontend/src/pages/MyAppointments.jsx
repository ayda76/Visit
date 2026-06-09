import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { appointmentsAPI } from '../api';
import Spinner from '../components/common/Spinner';
import Btn from '../components/common/Btn';
import toast from 'react-hot-toast';
import { format, parseISO } from 'date-fns';
import { Calendar, Clock, XCircle, CheckCircle } from 'lucide-react';
import s from './MyAppointments.module.css';

const STATUS = {
  pending:   { bg: '#fef9e7', color: '#92400e', icon: <Clock size={12} /> },
  confirmed: { bg: '#ecfdf5', color: '#065f46', icon: <CheckCircle size={12} /> },
  cancelled: { bg: '#fef2f2', color: '#991b1b', icon: <XCircle size={12} /> },
  completed: { bg: '#f5f3ff', color: '#4c1d95', icon: <CheckCircle size={12} /> },
};

export default function MyAppointments() {
  const qc = useQueryClient();
  const [tab, setTab] = useState('upcoming');

  const { data: appointments, isLoading } = useQuery(
    ['appointments', tab],
    () => appointmentsAPI.list({ status: tab === 'upcoming' ? 'pending,confirmed' : 'completed,cancelled' }),
    { select: d => d.data?.results || d.data || [] },
  );

  const cancelMutation = useMutation(
    (id) => appointmentsAPI.cancel(id),
    {
      onSuccess: () => { toast.success('Appointment cancelled.'); qc.invalidateQueries('appointments'); },
      onError:   () => toast.error('Could not cancel appointment.'),
    },
  );

  return (
    <div className={s.page}>
      <div className={s.inner}>
        <h1>My Appointments</h1>

        <div className={s.tabs}>
          <button className={`${s.tab} ${tab === 'upcoming' ? s.active : ''}`} onClick={() => setTab('upcoming')}>Upcoming</button>
          <button className={`${s.tab} ${tab === 'history' ? s.active : ''}`} onClick={() => setTab('history')}>History</button>
        </div>

        {isLoading ? <Spinner full /> : !appointments?.length ? (
          <div className={s.empty}>
            <Calendar size={44} style={{ color: 'var(--mist)' }} />
            <p>No {tab === 'upcoming' ? 'upcoming' : 'past'} appointments</p>
          </div>
        ) : (
          <div className={s.list}>
            {appointments.map(appt => {
              const st = STATUS[appt.status] || STATUS.pending;
              return (
                <div key={appt.id} className={s.card}>
                  <div className={s.dateBadge}>
                    {appt.date && <>
                      <strong>{format(parseISO(appt.date), 'd')}</strong>
                      <span>{format(parseISO(appt.date), 'MMM')}</span>
                    </>}
                  </div>
                  <div className={s.info}>
                    <h3>{appt.provider_name || appt.doctor_name || `Appointment #${appt.id}`}</h3>
                    <p>{appt.expertize_name || appt.specialty}</p>
                    <div className={s.meta}>
                      {appt.time && <span><Clock size={12} />{appt.time}</span>}
                      {appt.reason && <span className={s.reason}>"{appt.reason}"</span>}
                    </div>
                  </div>
                  <div className={s.right}>
                    <span className={s.status} style={{ background: st.bg, color: st.color }}>
                      {st.icon}{appt.status}
                    </span>
                    {(appt.status === 'pending' || appt.status === 'confirmed') && (
                      <Btn
                        variant="danger" size="sm"
                        loading={cancelMutation.isLoading}
                        onClick={() => window.confirm('Cancel this appointment?') && cancelMutation.mutate(appt.id)}
                      >
                        Cancel
                      </Btn>
                    )}
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
