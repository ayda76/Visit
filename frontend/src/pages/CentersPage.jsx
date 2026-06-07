import { useState } from 'react';
import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';
import { centersAPI } from '../api';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Button from '../components/common/Button';
import { Search, MapPin, Phone, X, Building2, ChevronRight } from 'lucide-react';
import styles from './CentersPage.module.css';

function CenterCard({ center }) {
  return (
    <div className={styles.card}>
      <div className={styles.cardIcon}>
        <Building2 size={28} />
      </div>
      <div className={styles.cardBody}>
        <h3>{center.name}</h3>
        {center.address && (
          <p className={styles.address}><MapPin size={13} />{center.address}</p>
        )}
        {center.phone && (
          <p className={styles.phone}><Phone size={13} />{center.phone}</p>
        )}
        {center.description && (
          <p className={styles.desc}>{center.description.slice(0, 120)}{center.description.length > 120 ? '…' : ''}</p>
        )}
        <div className={styles.cardFooter}>
          {center.doctor_count !== undefined && (
            <span className={styles.badge}>{center.doctor_count} doctors</span>
          )}
          <Link to={`/centers/${center.id}`}>
            <Button variant="outline" size="sm" icon={<ChevronRight size={13} />} iconPosition="right">
              View Center
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function CentersPage() {
  const [search, setSearch] = useState('');

  const params = {};
  if (search) params.search = search;

  const { data, isLoading } = useQuery(
    ['centers', search],
    () => centersAPI.list(params),
    { keepPreviousData: true, select: d => d.data },
  );

  const centers = data?.results || data || [];

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div className={styles.headerInner}>
          <h1>Medical Centers</h1>
          <p>{centers.length} centers available</p>
        </div>
      </div>

      <div className={styles.body}>
        <div className={styles.searchRow}>
          <div className={styles.searchBox}>
            <Search size={16} />
            <input
              type="text"
              placeholder="Search medical centers..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            {search && (
              <button className={styles.clearBtn} onClick={() => setSearch('')}>
                <X size={14} />
              </button>
            )}
          </div>
        </div>

        {isLoading ? (
          <LoadingSpinner fullPage />
        ) : !centers.length ? (
          <div className={styles.empty}>
            <Building2 size={40} style={{ color: 'var(--gray-200)' }} />
            <p>No medical centers found</p>
          </div>
        ) : (
          <div className={styles.grid}>
            {centers.map(c => <CenterCard key={c.id} center={c} />)}
          </div>
        )}
      </div>
    </div>
  );
}
