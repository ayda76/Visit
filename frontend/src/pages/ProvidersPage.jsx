import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useQuery } from 'react-query';
import { providersAPI, expertizeAPI } from '../api';
import Spinner from '../components/common/Spinner';
import Stars from '../components/common/Stars';
import Btn from '../components/common/Btn';
import { Search, X, SlidersHorizontal, MapPin, Calendar } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import s from './ProvidersPage.module.css';

export default function ProvidersPage() {
  const { user } = useAuth();
  const [sp, setSp] = useSearchParams();
  const [search, setSearch]     = useState(sp.get('search') || '');
  const [expertize, setExpertize] = useState(sp.get('expertize') || '');
  const [page, setPage]         = useState(1);

  const { data: expertizes } = useQuery('expertizes', expertizeAPI.list, {
    select: d => d.data?.results || d.data || [],
  });

  const params = { page };
  if (search)    params.search    = search;
  if (expertize) params.expertize = expertize;

  const { data, isLoading, isFetching } = useQuery(
    ['providers', params],
    () => providersAPI.list(params),
    { keepPreviousData: true, select: d => d.data },
  );

  const providers  = data?.results || data || [];
  const count      = data?.count   || providers.length;
  const totalPages = data?.count ? Math.ceil(data.count / (data.page_size || 12)) : 1;

  useEffect(() => {
    const p = {};
    if (search)    p.search    = search;
    if (expertize) p.expertize = expertize;
    setSp(p); setPage(1);
  }, [search, expertize]);

  return (
    <div className={s.page}>
      <div className={s.header}>
        <div className={s.hInner}>
          <h1>Doctors & Medical Centers</h1>
          <p>{count} providers available</p>
        </div>
      </div>

      <div className={s.body}>
        <aside className={s.sidebar}>
          <h3><SlidersHorizontal size={15} /> Filters</h3>

          <div className={s.fGroup}>
            <label>Specialty</label>
            <select value={expertize} onChange={e => setExpertize(e.target.value)} className={s.sel}>
              <option value="">All Specialties</option>
              {(expertizes || []).map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
            </select>
          </div>

          {(search || expertize) && (
            <button className={s.clearBtn} onClick={() => { setSearch(''); setExpertize(''); }}>
              <X size={13} /> Clear filters
            </button>
          )}
        </aside>

        <div className={s.results}>
          <div className={s.searchBar}>
            <Search size={15} className={s.searchIco} />
            <input
              value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search by name or specialty..."
            />
            {search && <button onClick={() => setSearch('')}><X size={14} /></button>}
          </div>

          {isLoading ? <Spinner full /> : providers.length === 0 ? (
            <div className={s.empty}>
              <p>No providers found</p>
              <span>Try adjusting your search or filters</span>
            </div>
          ) : (
            <>
              <div className={`${s.grid} ${isFetching ? s.dim : ''}`}>
                {providers.map(p => <ProviderCard key={p.id} provider={p} isLoggedIn={!!user} />)}
              </div>
              {totalPages > 1 && (
                <div className={s.pagination}>
                  <Btn variant="outline" size="sm" disabled={page === 1} onClick={() => setPage(p => p - 1)}>Previous</Btn>
                  <span>{page} / {totalPages}</span>
                  <Btn variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}>Next</Btn>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function ProviderCard({ provider, isLoggedIn }) {
  return (
    <div className={s.card}>
      <div className={s.cardTop}>
        <div className={s.avatar}>{(provider.name || provider.doctor_name || 'P')[0]}</div>
        <div className={s.info}>
          <h3>{provider.name || provider.doctor_name}</h3>
          <p className={s.spec}>{provider.expertize_name || provider.center_name || provider.type}</p>
          {provider.location && <p className={s.loc}><MapPin size={11} />{provider.location}</p>}
        </div>
      </div>
      {provider.average_rating != null && (
        <div className={s.rating}>
          <Stars value={provider.average_rating} size={13} />
          <span>{parseFloat(provider.average_rating).toFixed(1)}</span>
          {provider.review_count != null && <span className={s.rc}>({provider.review_count})</span>}
        </div>
      )}
      <div className={s.actions}>
        <Link to={`/providers/${provider.id}`} style={{ flex: 1 }}>
          <Btn variant="outline" size="sm" full>View Profile</Btn>
        </Link>
        {isLoggedIn
          ? <Link to={`/book/${provider.id}`} style={{ flex: 1 }}>
              <Btn variant="teal" size="sm" full icon={<Calendar size={13} />}>Book</Btn>
            </Link>
          : <Link to="/login" style={{ flex: 1 }}>
              <Btn variant="teal" size="sm" full icon={<Calendar size={13} />}>Book</Btn>
            </Link>
        }
      </div>
    </div>
  );
}
