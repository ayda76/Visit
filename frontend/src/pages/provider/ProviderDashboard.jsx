import { useQuery } from 'react-query';
import { useAuth } from '../../context/AuthContext';
import { appointmentsAPI, providersAPI } from '../../api';
import Spinner from '../../components/common/Spinner';
import { Link } from 'react-router-dom';
import Btn from '../../components/common/Btn';
import { Calendar, Clock, Users, CalendarDays } from 'lucide-react';
import { format } from 'date-fns';

export default function ProviderDashboard() {
  const { user } = useAuth();

  const { data: appointments, isLoading } = useQuery(
    'provider-appts',
    () => appointmentsAPI.list({ is_canceled: false }),
    { select: d => d.data?.results || d.data || [] },
  );

  const upcoming = appointments?.filter(a => !a.is_canceled) || [];
  const today = upcoming.filter(a => a.date === format(new Date(), 'yyyy-MM-dd'));

  const stats = [
    { label: 'Total Bookings',  value: appointments?.length || 0,  icon: <Calendar size={20} /> },
    { label: "Today's Appointments", value: today.length, icon: <Clock size={20} /> },
    { label: 'Upcoming',        value: upcoming.length,            icon: <CalendarDays size={20} /> },
  ];

  return (
    <div style={{ padding: '40px 32px' }}>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 28, color: 'var(--ink)' }}>Welcome, {user?.firstname || user?.username} 👋</h1>
        <p style={{ color: 'var(--steel)', marginTop: 4 }}>Here's your provider overview</p>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: 16, marginBottom: 36 }}>
        {stats.map(s => (
          <div key={s.label} style={{ background: 'var(--white)', border: '1px solid var(--fog)', borderRadius: 'var(--r-md)', padding: 20, display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 44, height: 44, background: 'var(--teal-pale)', color: 'var(--teal)', borderRadius: 'var(--r-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{s.icon}</div>
            <div>
              <p style={{ fontSize: 26, fontWeight: 700, fontFamily: 'var(--font-d)', color: 'var(--ink)' }}>{s.value}</p>
              <p style={{ fontSize: 13, color: 'var(--steel)' }}>{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Quick links */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 36, flexWrap: 'wrap' }}>
        <Link to="/provider/schedule"><Btn variant="teal" icon={<CalendarDays size={15} />}>Manage Schedule</Btn></Link>
        <Link to="/provider/appointments"><Btn variant="outline" icon={<Users size={15} />}>View Appointments</Btn></Link>
      </div>

      {/* Today's appointments */}
      <div>
        <h2 style={{ fontSize: 20, marginBottom: 16 }}>Today's Appointments</h2>
        {isLoading ? <Spinner /> : !today.length ? (
          <div style={{ background: 'var(--white)', border: '1px dashed var(--fog)', borderRadius: 'var(--r-md)', padding: 40, textAlign: 'center', color: 'var(--steel)', fontSize: 15 }}>
            No appointments today
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {today.map(a => (
              <div key={a.id} style={{ background: 'var(--white)', border: '1px solid var(--fog)', borderRadius: 'var(--r-md)', padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--teal-pale)', color: 'var(--teal)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, flexShrink: 0 }}>
                  {(a.patient_name || 'P')[0]}
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontWeight: 600, fontSize: 15 }}>{a.patient_name || `Patient #${a.patient}`}</p>
                  <p style={{ fontSize: 13, color: 'var(--steel)' }}>{a.start_time?.slice(0,5)} – {a.end_time?.slice(0,5)}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
