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
  const [search, setSearch] = useState(sp.get('search') || '');
  const [expertize, setExpertize] = useState(sp.get('expertize') || '');
  const [page, setPage] = useState(1);

  const { data: expertizes } = useQuery('expertizes', expertizeAPI.list, { select: d => d.data?.results || d.data || [] });

  const params = { page };
  if (search) params.search = search;
  if (expertize) params.expertize = expertize;

  const { data, isLoading, isFetching } = useQuery(
    ['providers', params], () => providersAPI.list(params),
    { keepPreviousData: true, select: d => d.data },
  );

  const providers = data?.results || data || [];
  const count = data?.count || providers.length;
  const totalPages = data?.count ? Math.ceil(data.count / (data.page_size || 5)) : 1;

  useEffect(() => {
    const p = {};
    if (search) p.search = search;
    if (expertize) p.expertize = expertize;
    setSp(p); setPage(1);
  }, [search, expertize]);

  return (
    <div>
      <div className={s.hdr}><div className={s.hIn}><h1>Doctors & Medical Centers</h1><p>{count} providers available</p></div></div>
      <div className={s.body}>
        <aside className={s.side}>
          <h3><SlidersHorizontal size={14} /> Filters</h3>
          <div className={s.fg}><label>Specialty</label>
            <select value={expertize} onChange={e => setExpertize(e.target.value)}>
              <option value="">All Specialties</option>
              {(expertizes || []).map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
            </select>
          </div>
          {(search || expertize) && (
            <button className={s.clr} onClick={() => { setSearch(''); setExpertize(''); }}>
              <X size={13} /> Clear
            </button>
          )}
        </aside>

        <div className={s.res}>
          <div className={s.sb}>
            <Search size={15} style={{ color: 'var(--mist)', flexShrink: 0 }} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name or specialty..." />
            {search && <button onClick={() => setSearch('')} style={{ background: 'none', border: 'none', color: 'var(--mist)', cursor: 'pointer', display: 'flex' }}><X size={14} /></button>}
          </div>
          {isLoading ? <Spinner full /> : providers.length === 0 ? (
            <div className={s.empty}><p>No providers found</p><span>Try adjusting your search</span></div>
          ) : (
            <>
              <div className={`${s.grid} ${isFetching ? s.dim : ''}`}>
                {providers.map(p => <ProvCard key={p.id} p={p} isLoggedIn={!!user && user.role === 'patient'} />)}
              </div>
              {totalPages > 1 && (
                <div className={s.pg}>
                  <Btn variant="outline" size="sm" disabled={page === 1} onClick={() => setPage(v => v - 1)}>Previous</Btn>
                  <span>{page} / {totalPages}</span>
                  <Btn variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage(v => v + 1)}>Next</Btn>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function ProvCard({ p, isLoggedIn }) {
  return (
    <div className={s.card}>
      <div className={s.ct}>
        <div className={s.av}>{(p.name || 'P')[0]}</div>
        <div>
          <h3>{p.name}</h3>
          <p className={s.sp}>{p.expertize_name || p.type}</p>
          {p.location && <p className={s.loc}><MapPin size={11} />{p.location}</p>}
        </div>
      </div>
      {p.average_rating != null && (
        <div className={s.rat}><Stars value={p.average_rating} size={13} /><span>{parseFloat(p.average_rating).toFixed(1)}</span>{p.review_count != null && <span className={s.rc}>({p.review_count})</span>}</div>
      )}
      <div className={s.acts}>
        <Link to={`/providers/${p.id}`} style={{ flex: 1 }}><Btn variant="outline" size="sm" full>View Profile</Btn></Link>
        <Link to={isLoggedIn ? `/book/${p.id}` : '/login'} style={{ flex: 1 }}>
          <Btn variant="teal" size="sm" full icon={<Calendar size={13} />}>Book</Btn>
        </Link>
      </div>
    </div>
  );
}
