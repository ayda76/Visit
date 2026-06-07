import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { notificationsAPI } from '../../api';
import { Bell, X } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import styles from './NotificationBell.module.css';

export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const qc = useQueryClient();

  const { data: countData } = useQuery(
    'notif-count',
    notificationsAPI.unreadCount,
    { refetchInterval: 30000, select: d => d.data },
  );

  const { data: notifs } = useQuery(
    'notifications',
    notificationsAPI.list,
    { enabled: open, select: d => d.data },
  );

  const markAll = useMutation(notificationsAPI.markAllRead, {
    onSuccess: () => {
      qc.invalidateQueries('notif-count');
      qc.invalidateQueries('notifications');
    },
  });

  const count = countData?.count || 0;

  return (
    <div className={styles.wrap}>
      <button className={styles.bellBtn} onClick={() => setOpen(v => !v)} aria-label="Notifications">
        <Bell size={18} />
        {count > 0 && <span className={styles.badge}>{count > 9 ? '9+' : count}</span>}
      </button>

      {open && (
        <>
          <div className={styles.backdrop} onClick={() => setOpen(false)} />
          <div className={styles.panel}>
            <div className={styles.header}>
              <h4>Notifications</h4>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                {count > 0 && (
                  <button className={styles.markAll} onClick={() => markAll.mutate()}>
                    Mark all read
                  </button>
                )}
                <button className={styles.close} onClick={() => setOpen(false)}><X size={14} /></button>
              </div>
            </div>
            <div className={styles.list}>
              {!notifs?.results?.length ? (
                <p className={styles.empty}>No notifications</p>
              ) : (
                notifs.results.map(n => (
                  <div key={n.id} className={`${styles.item} ${!n.is_read ? styles.unread : ''}`}>
                    <p className={styles.msg}>{n.message}</p>
                    <span className={styles.time}>
                      {formatDistanceToNow(new Date(n.created_at), { addSuffix: true })}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
