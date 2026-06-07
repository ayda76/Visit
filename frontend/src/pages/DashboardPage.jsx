import { useQuery } from 'react-query';
import { useAuth } from '../context/AuthContext';
import { appointmentsAPI } from '../api';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Button from '../components/common/Button';
import { Link } from 'react-router-dom';
import { Calendar, Clock, CheckCircle, XCircle, Plus, ChevronRight } from 'lucide-react';
import { format } from 'date-fns';
import styles from './DashboardPage.module.css';

const STATUS_COLORS = {
  pending:   { bg: '#fef3c7', color: '#92400e', icon: <Clock size={12} /> },
  confirmed: { bg: '#d1fae5', color: '#065f46', icon: <CheckCircle size={12} /> },
  cancelled: { bg: '#fee2e2', color: '#991b1b', icon: <XCircle size={12} /> },
  completed: { bg: '#ede9fe', color: '#4c1d95', icon: <CheckCircle size={12} /> },
};

function AppointmentRow({ appt }) {
  const st = STATUS_COLORS[appt.status] || STATUS_COLORS.pending;
  return (
    <div className={styles.apptRow}>
      <div className={styles.apptDate}>
        <strong>{appt.appointment_date ? format(new Date(appt.appointment_date), 'd MMM') : '—'}</strong>
        <span>{appt.appointment_time || ''}</span>
      </div>
      <div className={styles.apptInfo}>
        <p>Dr. {appt.doctor_name || appt.doctor}</p>
        <span>{appt.specialty || ''}</span>
      </div>
      <div className={styles.apptStatus} style={{ background: st.bg, color: st.color }}>
        {st.icon} {appt.status}
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { user } = useAuth();

  const { data: upcoming, isLoading: upcomingLoading } = useQuery(
    'upcoming-appts',
    appointmentsAPI.upcoming,
    { select: d => d.data?.results || d.data || [] },
  );

  const { data: history } = useQuery(
    'history-appts',
    appointmentsAPI.history,
    { select: d => d.data?.results || d.data || [] },
  );

  const stats = [
    { label: 'Total Appointments', value: ((upcoming?.length || 0) + (history?.length || 0)), icon: <Calendar size={20} /> },
    { label: 'Upcoming',           value: upcoming?.length || 0,  icon: <Clock size={20} /> },
    { label: 'Completed',          value: history?.filter(a => a.status === 'completed').length || 0, icon: <CheckCircle size={20} /> },
    { label: 'Cancelled',          value: history?.filter(a => a.status === 'cancelled').length || 0, icon: <XCircle size={20} /> },
  ];

  return (
    <div className={styles.page}>
      <div className={styles.inner}>
        {/* Header */}
        <div className={styles.header}>
          <div>
            <h1>Welcome back, {user?.first_name || user?.username} 👋</h1>
            <p>Here's your health overview</p>
          </div>
          <Link to="/doctors">
            <Button variant="teal" icon={<Plus size={16} />}>Book Appointment</Button>
          </Link>
        </div>

        {/* Stats */}
        <div className={styles.statsGrid}>
          {stats.map(s => (
            <div key={s.label} className={styles.statCard}>
              <div className={styles.statIcon}>{s.icon}</div>
              <div>
                <p className={styles.statValue}>{s.value}</p>
                <p className={styles.statLabel}>{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Upcoming */}
        <div className={styles.section}>
          <div className={styles.sectionHead}>
            <h2>Upcoming Appointments</h2>
            <Link to="/appointments">
              <Button variant="ghost" size="sm" icon={<ChevronRight size={14} />} iconPosition="right">
                View All
              </Button>
            </Link>
          </div>
          {upcomingLoading ? (
            <LoadingSpinner />
          ) : !upcoming?.length ? (
            <div className={styles.empty}>
              <p>No upcoming appointments</p>
              <Link to="/doctors"><Button variant="teal" size="sm">Find a Doctor</Button></Link>
            </div>
          ) : (
            <div className={styles.apptList}>
              {upcoming.slice(0, 5).map(a => <AppointmentRow key={a.id} appt={a} />)}
            </div>
          )}
        </div>

        {/* Recent history */}
        {history?.length > 0 && (
          <div className={styles.section}>
            <h2>Past Appointments</h2>
            <div className={styles.apptList}>
              {history.slice(0, 3).map(a => <AppointmentRow key={a.id} appt={a} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
