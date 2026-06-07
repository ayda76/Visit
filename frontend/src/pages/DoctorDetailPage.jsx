import { useParams, Link } from 'react-router-dom';
import { useQuery } from 'react-query';
import { doctorsAPI, reviewsAPI } from '../api';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Button from '../components/common/Button';
import { Star, MapPin, Clock, Calendar, Award, MessageSquare } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import styles from './DoctorDetailPage.module.css';

function StarRating({ value }) {
  return (
    <div style={{ display: 'flex', gap: 2 }}>
      {[1,2,3,4,5].map(i => (
        <Star key={i} size={14}
          fill={i <= value ? 'currentColor' : 'none'}
          style={{ color: '#c9a84c' }}
        />
      ))}
    </div>
  );
}

export default function DoctorDetailPage() {
  const { id } = useParams();

  const { data: doctor, isLoading } = useQuery(
    ['doctor', id],
    () => doctorsAPI.detail(id),
    { select: d => d.data },
  );

  const { data: reviews } = useQuery(
    ['reviews', id],
    () => reviewsAPI.forDoctor(id),
    { select: d => d.data?.results || d.data || [] },
  );

  if (isLoading) return <LoadingSpinner fullPage />;
  if (!doctor) return <div style={{ padding: 40, textAlign: 'center' }}>Doctor not found.</div>;

  const rating = parseFloat(doctor.average_rating || 0).toFixed(1);

  return (
    <div className={styles.page}>
      {/* Profile header */}
      <div className={styles.heroBg}>
        <div className={styles.heroInner}>
          <div className={styles.avatar}>
            {doctor.profile_image
              ? <img src={doctor.profile_image} alt={`Dr. ${doctor.full_name}`} />
              : <span>{(doctor.full_name || 'D').charAt(0)}</span>
            }
          </div>
          <div className={styles.heroInfo}>
            <h1>Dr. {doctor.full_name}</h1>
            <p className={styles.specialty}>{doctor.specialty_name || doctor.specialty}</p>
            <div className={styles.heroBadges}>
              {doctor.medical_center_name && (
                <span className={styles.badge}><MapPin size={12} />{doctor.medical_center_name}</span>
              )}
              {doctor.experience_years && (
                <span className={styles.badge}><Clock size={12} />{doctor.experience_years} years experience</span>
              )}
              {doctor.is_verified && (
                <span className={`${styles.badge} ${styles.verified}`}><Award size={12} />Verified</span>
              )}
            </div>
            <div className={styles.ratingRow}>
              <StarRating value={Math.round(doctor.average_rating || 0)} />
              <span className={styles.ratingNum}>{rating}</span>
              <span className={styles.ratingCount}>({doctor.review_count || 0} reviews)</span>
            </div>
          </div>
          <div className={styles.bookBox}>
            {doctor.consultation_fee && (
              <p className={styles.fee}>Consultation fee<br /><strong>€{doctor.consultation_fee}</strong></p>
            )}
            <Link to={`/book/${doctor.id}`}>
              <Button variant="teal" size="lg" fullWidth icon={<Calendar size={16} />}>
                Book Appointment
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className={styles.body}>
        <div className={styles.main}>
          {/* About */}
          {doctor.bio && (
            <section className={styles.section}>
              <h2>About</h2>
              <p>{doctor.bio}</p>
            </section>
          )}

          {/* Education */}
          {doctor.education && (
            <section className={styles.section}>
              <h2>Education & Qualifications</h2>
              <p>{doctor.education}</p>
            </section>
          )}

          {/* Reviews */}
          <section className={styles.section}>
            <h2><MessageSquare size={18} style={{ display:'inline', marginRight:8 }} />Patient Reviews</h2>
            {!reviews?.length ? (
              <p className={styles.noReviews}>No reviews yet.</p>
            ) : (
              <div className={styles.reviewsList}>
                {reviews.map(r => (
                  <div key={r.id} className={styles.review}>
                    <div className={styles.reviewHeader}>
                      <div className={styles.reviewAvatar}>{(r.patient_name || 'P').charAt(0)}</div>
                      <div>
                        <p className={styles.reviewName}>{r.patient_name || 'Anonymous'}</p>
                        <StarRating value={r.rating} />
                      </div>
                      <span className={styles.reviewDate}>
                        {formatDistanceToNow(new Date(r.created_at), { addSuffix: true })}
                      </span>
                    </div>
                    {r.comment && <p className={styles.reviewText}>{r.comment}</p>}
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>

        {/* Sidebar */}
        <aside className={styles.sidebar}>
          <div className={styles.infoCard}>
            <h3>Information</h3>
            {doctor.specialty_name && <div className={styles.infoRow}><span>Specialty</span><strong>{doctor.specialty_name}</strong></div>}
            {doctor.experience_years && <div className={styles.infoRow}><span>Experience</span><strong>{doctor.experience_years} years</strong></div>}
            {doctor.consultation_fee && <div className={styles.infoRow}><span>Fee</span><strong>€{doctor.consultation_fee}</strong></div>}
            {doctor.languages && <div className={styles.infoRow}><span>Languages</span><strong>{Array.isArray(doctor.languages) ? doctor.languages.join(', ') : doctor.languages}</strong></div>}
            {doctor.phone && <div className={styles.infoRow}><span>Phone</span><strong>{doctor.phone}</strong></div>}
          </div>
        </aside>
      </div>
    </div>
  );
}
