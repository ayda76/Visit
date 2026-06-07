import { Link } from 'react-router-dom';
import { Star, MapPin, Clock, Calendar } from 'lucide-react';
import Button from '../common/Button';
import styles from './DoctorCard.module.css';

export default function DoctorCard({ doctor }) {
  const rating = parseFloat(doctor.average_rating || 0).toFixed(1);

  return (
    <div className={styles.card}>
      <div className={styles.top}>
        <div className={styles.avatar}>
          {doctor.profile_image ? (
            <img src={doctor.profile_image} alt={`Dr. ${doctor.full_name}`} />
          ) : (
            <span>{(doctor.full_name || 'D').charAt(0)}</span>
          )}
        </div>
        <div className={styles.info}>
          <h3>Dr. {doctor.full_name}</h3>
          <p className={styles.specialty}>{doctor.specialty_name || doctor.specialty}</p>
          {doctor.medical_center_name && (
            <p className={styles.center}>
              <MapPin size={12} />
              {doctor.medical_center_name}
            </p>
          )}
        </div>
      </div>

      <div className={styles.meta}>
        <div className={styles.stat}>
          <Star size={14} fill="currentColor" className={styles.star} />
          <span>{rating}</span>
          <span className={styles.muted}>({doctor.review_count || 0})</span>
        </div>
        {doctor.experience_years && (
          <div className={styles.stat}>
            <Clock size={14} />
            <span>{doctor.experience_years}y exp</span>
          </div>
        )}
        {doctor.consultation_fee && (
          <div className={styles.stat}>
            <span className={styles.fee}>€{doctor.consultation_fee}</span>
          </div>
        )}
      </div>

      {doctor.bio && (
        <p className={styles.bio}>{doctor.bio.slice(0, 100)}{doctor.bio.length > 100 ? '…' : ''}</p>
      )}

      <div className={styles.actions}>
        <Link to={`/doctors/${doctor.id}`} style={{ flex: 1 }}>
          <Button variant="outline" size="sm" fullWidth>View Profile</Button>
        </Link>
        <Link to={`/book/${doctor.id}`} style={{ flex: 1 }}>
          <Button variant="teal" size="sm" fullWidth icon={<Calendar size={14} />}>
            Book Now
          </Button>
        </Link>
      </div>
    </div>
  );
}
