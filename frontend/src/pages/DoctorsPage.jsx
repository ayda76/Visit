import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from 'react-query';
import { doctorsAPI } from '../api';
import DoctorCard from '../components/doctors/DoctorCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import styles from './DoctorsPage.module.css';

export default function DoctorsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch]       = useState(searchParams.get('search') || '');
  const [specialty, setSpecialty] = useState(searchParams.get('specialty') || '');
  const [ordering, setOrdering]   = useState('-average_rating');
  const [page, setPage]           = useState(1);

  const { data: specialties } = useQuery('specialties', doctorsAPI.specialties, {
    select: d => d.data?.results || d.data || [],
  });

  const params = { page, ordering };
  if (search)   params.search = search;
  if (specialty) params.specialty = specialty;

  const { data, isLoading, isFetching } = useQuery(
    ['doctors', params],
    () => doctorsAPI.list(params),
    { keepPreviousData: true, select: d => d.data },
  );

  const doctors = data?.results || [];
  const count   = data?.count || 0;
  const totalPages = Math.ceil(count / (data?.page_size || 12));

  const clearFilters = () => {
    setSearch(''); setSpecialty(''); setPage(1);
    setSearchParams({});
  };

  useEffect(() => {
    const sp = {};
    if (search)   sp.search = search;
    if (specialty) sp.specialty = specialty;
    setSearchParams(sp);
    setPage(1);
  }, [search, specialty]);

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div className={styles.headerInner}>
          <h1>Find a Doctor</h1>
          <p>{count} doctors available</p>
        </div>
      </div>

      <div className={styles.body}>
        {/* Filters */}
        <aside className={styles.sidebar}>
          <div className={styles.filterSection}>
            <h3><SlidersHorizontal size={15} /> Filters</h3>

            <div className={styles.filterGroup}>
              <label>Specialty</label>
              <select value={specialty} onChange={e => setSpecialty(e.target.value)} className={styles.select}>
                <option value="">All Specialties</option>
                {(specialties || []).map(s => (
                  <option key={s.id || s.name} value={s.name || s.id}>{s.name}</option>
                ))}
              </select>
            </div>

            <div className={styles.filterGroup}>
              <label>Sort By</label>
              <select value={ordering} onChange={e => setOrdering(e.target.value)} className={styles.select}>
                <option value="-average_rating">Highest Rated</option>
                <option value="average_rating">Lowest Rated</option>
                <option value="-experience_years">Most Experienced</option>
                <option value="consultation_fee">Lowest Fee</option>
                <option value="-consultation_fee">Highest Fee</option>
              </select>
            </div>

            {(search || specialty) && (
              <button className={styles.clearBtn} onClick={clearFilters}>
                <X size={14} /> Clear Filters
              </button>
            )}
          </div>
        </aside>

        {/* Results */}
        <main className={styles.results}>
          {/* Search bar */}
          <div className={styles.searchRow}>
            <div className={styles.searchBox}>
              <Search size={16} className={styles.searchIcon} />
              <input
                type="text"
                placeholder="Search by name or specialty..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
              {search && (
                <button className={styles.clearSearch} onClick={() => setSearch('')}>
                  <X size={14} />
                </button>
              )}
            </div>
          </div>

          {isLoading ? (
            <LoadingSpinner fullPage />
          ) : doctors.length === 0 ? (
            <div className={styles.empty}>
              <p>No doctors found</p>
              <span>Try adjusting your search or filters</span>
            </div>
          ) : (
            <>
              <div className={`${styles.grid} ${isFetching ? styles.dimmed : ''}`}>
                {doctors.map(d => <DoctorCard key={d.id} doctor={d} />)}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className={styles.pagination}>
                  <button
                    className={styles.pageBtn}
                    disabled={page === 1}
                    onClick={() => setPage(p => p - 1)}
                  >Previous</button>
                  <span>{page} / {totalPages}</span>
                  <button
                    className={styles.pageBtn}
                    disabled={page === totalPages}
                    onClick={() => setPage(p => p + 1)}
                  >Next</button>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}
