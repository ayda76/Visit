import { useParams } from 'react-router-dom';
import { useQuery } from 'react-query';
import { centersAPI } from '../api';
import DoctorCard from '../components/doctors/DoctorCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { MapPin, Phone, Mail, Globe, Building2 } from 'lucide-react';
import styles from './CenterDetailPage.module.css';

export default function CenterDetailPage() {
  const { id } = useParams();

  const { data: center, isLoading } = useQuery(
    ['center', id],
    () => centersAPI.detail(id),
    { select: d => d.data },
  );

  const { data: doctors } = useQuery(
    ['center-doctors', id],
    () => centersAPI.doctors(id),
    { select: d => d.data?.results || d.data || [], enabled: !!id },
  );

  if (isLoading) return <LoadingSpinner fullPage />;
  if (!center) return <div style={{ padding: 40, textAlign: 'center' }}>Center not found.</div>;

  return (
    <div className={styles.page}>
      <div className={styles.hero}>
        <div className={styles.heroInner}>
          <div className={styles.heroIcon}><Building2 size={36} /></div>
          <div>
            <h1>{center.name}</h1>
            {center.address && <p className={styles.address}><MapPin size={14} />{center.address}</p>}
          </div>
        </div>
      </div>

      <div className={styles.body}>
        <div className={styles.main}>
          {center.description && (
            <section className={styles.section}>
              <h2>About</h2>
              <p>{center.description}</p>
            </section>
          )}

          {doctors?.length > 0 && (
            <section className={styles.section}>
              <h2>Our Doctors</h2>
              <div className={styles.doctorGrid}>
                {doctors.map(d => <DoctorCard key={d.id} doctor={d} />)}
              </div>
            </section>
          )}
        </div>

        <aside className={styles.sidebar}>
          <div className={styles.infoCard}>
            <h3>Contact Information</h3>
            {center.phone && (
              <div className={styles.infoRow}><Phone size={14} /><span>{center.phone}</span></div>
            )}
            {center.email && (
              <div className={styles.infoRow}><Mail size={14} /><span>{center.email}</span></div>
            )}
            {center.website && (
              <div className={styles.infoRow}><Globe size={14} /><a href={center.website} target="_blank" rel="noopener noreferrer">{center.website}</a></div>
            )}
            {center.address && (
              <div className={styles.infoRow}><MapPin size={14} /><span>{center.address}</span></div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
