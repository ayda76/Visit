import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from 'react-query';
import { doctorsAPI, centersAPI } from '../api';
import DoctorCard from '../components/doctors/DoctorCard';
import Button from '../components/common/Button';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { Search, MapPin, ChevronRight, Stethoscope, Building2, Star, Shield } from 'lucide-react';
import styles from './HomePage.module.css';

const SPECIALTIES = [
  { name: 'Cardiology', icon: '🫀', color: '#fee2e2' },
  { name: 'Dermatology', icon: '🩺', color: '#fef3c7' },
  { name: 'Neurology', icon: '🧠', color: '#ede9fe' },
  { name: 'Orthopedics', icon: '🦴', color: '#dcfce7' },
  { name: 'Pediatrics', icon: '👶', color: '#dbeafe' },
  { name: 'Ophthalmology', icon: '👁️', color: '#fce7f3' },
];

export default function HomePage() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');

  const { data: topDoctors, isLoading } = useQuery(
    'top-doctors',
    doctorsAPI.topRated,
    { select: d => d.data?.results || d.data || [] },
  );

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) navigate(`/doctors?search=${encodeURIComponent(query)}`);
    else navigate('/doctors');
  };

  return (
    <div className={styles.page}>
      {/* ── Hero ── */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <span className={styles.pill}>Trusted Healthcare Platform</span>
          <h1 className={styles.heroTitle}>
            Find the right<br/>
            <span className={styles.accent}>doctor</span> for you
          </h1>
          <p className={styles.heroSub}>
            Book appointments with top-rated specialists and medical centers — all in one place.
          </p>

          <form className={styles.searchBar} onSubmit={handleSearch}>
            <div className={styles.searchInput}>
              <Search size={18} className={styles.searchIcon} />
              <input
                type="text"
                placeholder="Search doctors, specialties..."
                value={query}
                onChange={e => setQuery(e.target.value)}
              />
            </div>
            <Button variant="teal" size="lg" type="submit">Search</Button>
          </form>
        </div>

        <div className={styles.heroVisual}>
          <div className={styles.heroCard}>
            <div className={styles.hcAvatar}>JD</div>
            <div>
              <p className={styles.hcName}>Dr. Jana Doe</p>
              <p className={styles.hcSpec}>Cardiologist · 4.9 ★</p>
            </div>
          </div>
          <div className={`${styles.heroCard} ${styles.heroCard2}`}>
            <div className={styles.hcIcon}>✓</div>
            <div>
              <p className={styles.hcName}>Appointment Confirmed</p>
              <p className={styles.hcSpec}>Tomorrow at 10:00 AM</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className={styles.stats}>
        <div className={styles.statsInner}>
          {[
            { n: '500+', label: 'Verified Doctors' },
            { n: '50+',  label: 'Medical Centers' },
            { n: '98%',  label: 'Satisfaction Rate' },
            { n: '24/7', label: 'Support Available' },
          ].map(s => (
            <div key={s.label} className={styles.stat}>
              <strong>{s.n}</strong>
              <span>{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── Specialties ── */}
      <section className={styles.section}>
        <div className={styles.sectionInner}>
          <div className={styles.sectionHead}>
            <h2>Browse by Specialty</h2>
            <Button variant="ghost" size="sm" icon={<ChevronRight size={14} />} iconPosition="right"
              onClick={() => navigate('/doctors')}>
              All Specialties
            </Button>
          </div>
          <div className={styles.specialtyGrid}>
            {SPECIALTIES.map(s => (
              <button
                key={s.name}
                className={styles.specialtyCard}
                style={{ '--card-bg': s.color }}
                onClick={() => navigate(`/doctors?specialty=${s.name}`)}
              >
                <span className={styles.specialtyIcon}>{s.icon}</span>
                <span>{s.name}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── Top Doctors ── */}
      <section className={styles.section} style={{ background: 'var(--navy)', color: 'var(--cream)' }}>
        <div className={styles.sectionInner}>
          <div className={styles.sectionHead}>
            <h2 style={{ color: 'var(--cream)' }}>Top Rated Doctors</h2>
            <Button variant="ghost" size="sm" style={{ color: 'var(--teal)' }}
              icon={<ChevronRight size={14} />} iconPosition="right"
              onClick={() => navigate('/doctors')}>
              See All
            </Button>
          </div>
          {isLoading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '48px 0' }}>
              <LoadingSpinner />
            </div>
          ) : (
            <div className={styles.doctorGrid}>
              {(topDoctors || []).slice(0, 3).map(d => (
                <DoctorCard key={d.id} doctor={d} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── Why Visit ── */}
      <section className={styles.section}>
        <div className={styles.sectionInner}>
          <h2 style={{ textAlign: 'center', marginBottom: 40 }}>Why Choose Visit?</h2>
          <div className={styles.featuresGrid}>
            {[
              { icon: <Star size={24} />, title: 'Verified Professionals', desc: 'Every doctor is verified and vetted before joining our platform.' },
              { icon: <Shield size={24} />, title: 'Secure & Private', desc: 'Your health data is encrypted and never shared without consent.' },
              { icon: <Stethoscope size={24} />, title: 'All Specialties', desc: 'From general practice to rare specialties — we have you covered.' },
              { icon: <Building2 size={24} />, title: 'Top Medical Centers', desc: 'Access top hospitals and clinics across the country.' },
            ].map(f => (
              <div key={f.title} className={styles.feature}>
                <div className={styles.featureIcon}>{f.icon}</div>
                <h4>{f.title}</h4>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
