import { useAuth } from '../context/AuthContext';
import { useQuery } from 'react-query';
import { applicationsAPI } from '../api';
import { Clock, CheckCircle, XCircle, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';
import Btn from '../components/common/Btn';

export default function PendingPage() {
  const { user } = useAuth();

  const { data: apps } = useQuery(
    'my-application',
    () => applicationsAPI.list(),
    { select: d => d.data?.results || d.data || [] },
  );

  const app = apps?.[0];
  const status = app?.status || 'pending';

  const statusMap = {
    pending:  { icon: <Clock size={40} style={{ color: 'var(--amber)' }} />, color: 'var(--amber)', title: 'Application Under Review', desc: 'Your application has been submitted and is being reviewed by our admin team. This usually takes 2–3 business days.' },
    accepted: { icon: <CheckCircle size={40} style={{ color: 'var(--teal)' }} />, color: 'var(--teal)', title: 'Application Accepted!', desc: 'Congratulations! Your application has been accepted. Please log out and log back in to access your provider dashboard.' },
    rejected: { icon: <XCircle size={40} style={{ color: 'var(--rose)' }} />, color: 'var(--rose)', title: 'Application Rejected', desc: 'Unfortunately your application was not accepted at this time. Please contact support for more information.' },
  };

  const st = statusMap[status] || statusMap.pending;

  return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 24px' }}>
      <div style={{ maxWidth: 480, width: '100%', background: 'var(--white)', border: '1px solid var(--fog)', borderRadius: 'var(--r-xl)', padding: 40, textAlign: 'center', boxShadow: 'var(--sh-md)', animation: 'fadeUp .35s ease both' }}>
        <div style={{ marginBottom: 20 }}>{st.icon}</div>
        <h1 style={{ fontSize: 24, color: 'var(--ink)', marginBottom: 12 }}>{st.title}</h1>
        <p style={{ fontSize: 15, color: 'var(--slate)', lineHeight: 1.6, marginBottom: 24 }}>{st.desc}</p>

        {app && (
          <div style={{ background: 'var(--fog)', borderRadius: 'var(--r-md)', padding: '16px 20px', marginBottom: 24, textAlign: 'left' }}>
            <p style={{ fontSize: 13, color: 'var(--steel)', marginBottom: 8, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.05em' }}>Application Details</p>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, marginBottom: 6 }}>
              <span style={{ color: 'var(--steel)' }}>Role Requested</span>
              <strong style={{ color: 'var(--ink)', textTransform: 'capitalize' }}>{app.role_requested}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, marginBottom: 6 }}>
              <span style={{ color: 'var(--steel)' }}>Submitted</span>
              <strong style={{ color: 'var(--ink)' }}>{app.submitted_at ? new Date(app.submitted_at).toLocaleDateString() : '—'}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
              <span style={{ color: 'var(--steel)' }}>Status</span>
              <strong style={{ color: st.color, textTransform: 'capitalize' }}>{status}</strong>
            </div>
          </div>
        )}

        {!app && (
          <div style={{ marginBottom: 24 }}>
            <p style={{ fontSize: 14, color: 'var(--steel)', marginBottom: 16 }}>You haven't submitted an application yet.</p>
            <Link to="/provider-signup">
              <Btn variant="teal" icon={<FileText size={15} />}>Submit Application</Btn>
            </Link>
          </div>
        )}

        <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/"><Btn variant="outline" size="sm">Back to Home</Btn></Link>
          {status === 'accepted' && <Link to="/provider/dashboard"><Btn variant="teal" size="sm">Go to Dashboard</Btn></Link>}
        </div>
      </div>
    </div>
  );
}
