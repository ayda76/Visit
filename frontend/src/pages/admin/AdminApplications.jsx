import { useQuery, useMutation, useQueryClient } from 'react-query';
import { applicationsAPI } from '../../api';
import Spinner from '../../components/common/Spinner';
import Btn from '../../components/common/Btn';
import toast from 'react-hot-toast';
import { CheckCircle, XCircle, FileText, ExternalLink } from 'lucide-react';

const STATUS_STYLE = {
  pending:  { bg: '#fef9e7', color: '#92400e' },
  accepted: { bg: '#ecfdf5', color: '#065f46' },
  rejected: { bg: '#fef2f2', color: '#991b1b' },
};

export default function AdminApplications() {
  const qc = useQueryClient();

  const { data: apps, isLoading } = useQuery(
    'admin-apps',
    () => applicationsAPI.list(),
    { select: d => d.data?.results || d.data || [] },
  );

  const reviewMutation = useMutation(
    ({ id, decision }) => applicationsAPI.review(id, { decision }),
    {
      onSuccess: (_, vars) => {
        toast.success(`Application ${vars.decision === 'approve' ? 'approved' : 'rejected'}!`);
        qc.invalidateQueries('admin-apps');
      },
      onError: err => toast.error(err?.response?.data?.error || 'Action failed'),
    },
  );

  return (
    <div style={{ padding: '40px 32px' }}>
      <h1 style={{ fontSize: 28, color: 'var(--ink)', marginBottom: 6 }}>Provider Applications</h1>
      <p style={{ color: 'var(--steel)', marginBottom: 28 }}>Review and approve or reject provider applications</p>

      {isLoading ? <Spinner /> : !apps?.length ? (
        <div style={{ background: 'var(--white)', border: '1px dashed var(--fog)', borderRadius: 'var(--r-lg)', padding: 60, textAlign: 'center', color: 'var(--steel)' }}>
          <FileText size={40} style={{ color: 'var(--mist)', marginBottom: 12 }} />
          <p>No applications yet.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {apps.map(app => {
            const st = STATUS_STYLE[app.status] || STATUS_STYLE.pending;
            return (
              <div key={app.id} style={{ background: 'var(--white)', border: '1px solid var(--fog)', borderRadius: 'var(--r-lg)', padding: '20px 24px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                      <h3 style={{ fontSize: 16, color: 'var(--ink)', fontFamily: 'var(--font-b)', fontWeight: 600 }}>
                        {app.account_name || `Application #${app.id}`}
                      </h3>
                      <span style={{ padding: '3px 10px', borderRadius: 99, fontSize: 12, fontWeight: 600, background: st.bg, color: st.color, textTransform: 'capitalize' }}>
                        {app.status}
                      </span>
                    </div>
                    <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', fontSize: 14 }}>
                      <span style={{ color: 'var(--steel)' }}>Role: <strong style={{ color: 'var(--ink)', textTransform: 'capitalize' }}>{app.role_requested}</strong></span>
                      <span style={{ color: 'var(--steel)' }}>Submitted: <strong style={{ color: 'var(--ink)' }}>{app.submitted_at ? new Date(app.submitted_at).toLocaleDateString() : '—'}</strong></span>
                      {app.approved_at && <span style={{ color: 'var(--steel)' }}>Reviewed: <strong style={{ color: 'var(--ink)' }}>{new Date(app.approved_at).toLocaleDateString()}</strong></span>}
                    </div>
                    {app.documents && (
                      <a href={app.documents} target="_blank" rel="noopener noreferrer"
                        style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 13, color: 'var(--teal-dk)', marginTop: 8, fontWeight: 500 }}>
                        <ExternalLink size={13} /> View Documents
                      </a>
                    )}
                  </div>

                  {app.status === 'pending' && (
                    <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                      <Btn variant="teal" size="sm" icon={<CheckCircle size={14} />}
                        loading={reviewMutation.isLoading}
                        onClick={() => reviewMutation.mutate({ id: app.id, decision: 'approve' })}>
                        Approve
                      </Btn>
                      <Btn variant="danger" size="sm" icon={<XCircle size={14} />}
                        loading={reviewMutation.isLoading}
                        onClick={() => reviewMutation.mutate({ id: app.id, decision: 'reject' })}>
                        Reject
                      </Btn>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
