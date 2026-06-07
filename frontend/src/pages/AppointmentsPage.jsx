import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { appointmentsAPI } from '../api';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Button from '../components/common/Button';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import { Calendar, Clock, CheckCircle, XCircle, Star } from 'lucide-react';
import styles from './AppointmentsPage.module.css';

const TABS = ['upcoming', 'history'];

const STATUS_STYLES = {
  pending:   { bg: '#fef3c7', color: '#92400e' },
  confirmed: { bg: '#d1fae5', color: '#065f46' },
  cancelled: { bg: '#fee2e2', color: '#991b1b' },
  completed: { bg: '#ede9fe', color: '#4c1d95' },
  rejected:  { bg: '#fee2e2', color: '#991b1b' },
};

export default function AppointmentsPage() {
  const [tab, setTab] = useState('upcoming');
  const [reviewModal, setReviewModal] = useState(null);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const qc = useQueryClient();

  const { data: upcoming, isLoading: ul } = useQuery(
    'upcoming-appts', appointmentsAPI.upcoming,
    { select: d => d.data?.results || d.data || [] },
  );

  const { data: history, isLoading: hl } = useQuery(
    'history-appts', appointmentsAPI.history,
    { select: d => d.data?.results || d.data || [] },
  );

  const cancelMutation = useMutation(
    (id) => appointmentsAPI.cancel(id),
    {
      onSuccess: () => {
        toast.success('Appointment cancelled');
        qc.invalidateQueries('upcoming-appts');
        qc.invalidateQueries('history-appts');
      },
      onError: () => toast.error('Could not cancel appointment'),
    },
  );

  const appointments = tab === 'upcoming' ? (upcoming || []) : (history || []);
  const isLoading = tab === 'upcoming' ? ul : hl;

  return (
    <div className={styles.page}>
      <div className={styles.inner}>
        <h1>My Appointments</h1>

        <div className={styles.tabs}>
          {TABS.map(t => (
            <button
              key={t}
              className={`${styles.tab} ${tab === t ? styles.activeTab : ''}`}
              onClick={() => setTab(t)}
            >
              {t === 'upcoming' ? `Upcoming (${upcoming?.length || 0})` : `History (${history?.length || 0})`}
            </button>
          ))}
        </div>

        {isLoading ? (
          <LoadingSpinner fullPage />
        ) : !appointments.length ? (
          <div className={styles.empty}>
            <Calendar size={40} style={{ color: 'var(--gray-200)' }} />
            <p>No {tab} appointments</p>
          </div>
        ) : (
          <div className={styles.list}>
            {appointments.map(appt => {
              const st = STATUS_STYLES[appt.status] || STATUS_STYLES.pending;
              return (
                <div key={appt.id} className={styles.card}>
                  <div className={styles.cardLeft}>
                    <div className={styles.dateBlock}>
                      {appt.appointment_date && (
                        <>
                          <strong>{format(new Date(appt.appointment_date), 'd')}</strong>
                          <span>{format(new Date(appt.appointment_date), 'MMM yyyy')}</span>
                        </>
                      )}
                    </div>
                    <div className={styles.details}>
                      <h3>Dr. {appt.doctor_name || appt.doctor}</h3>
                      <p>{appt.specialty}</p>
                      <div className={styles.meta}>
                        <span><Clock size={12} />{appt.appointment_time || '—'}</span>
                        {appt.medical_center && <span><Calendar size={12} />{appt.medical_center}</span>}
                      </div>
                      {appt.reason && <p className={styles.reason}>"{appt.reason}"</p>}
                    </div>
                  </div>

                  <div className={styles.cardRight}>
                    <span className={styles.status} style={{ background: st.bg, color: st.color }}>
                      {appt.status}
                    </span>
                    <div className={styles.cardActions}>
                      {appt.status === 'pending' || appt.status === 'confirmed' ? (
                        <Button
                          variant="danger"
                          size="sm"
                          loading={cancelMutation.isLoading}
                          onClick={() => {
                            if (window.confirm('Cancel this appointment?')) {
                              cancelMutation.mutate(appt.id);
                            }
                          }}
                        >
                          Cancel
                        </Button>
                      ) : null}
                      {appt.status === 'completed' && (
                        <Button
                          variant="outline"
                          size="sm"
                          icon={<Star size={13} />}
                          onClick={() => setReviewModal(appt)}
                        >
                          Review
                        </Button>
                      )}
                    </div>
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
