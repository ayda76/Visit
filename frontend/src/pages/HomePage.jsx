import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useQuery } from 'react-query';
import { providersAPI, expertizeAPI } from '../api';
import Btn from '../components/common/Btn';
import Stars from '../components/common/Stars';
import Spinner from '../components/common/Spinner';
import { Search, Calendar, Shield, Star, ChevronRight } from 'lucide-react';
import s from './HomePage.module.css';

export default function HomePage() {
  const navigate = useNavigate();
  const [q, setQ] = useState('');

  const { data: providers } = useQuery('providers-home', () => providersAPI.list({ page_size: 6 }), {
    select: d => d.data?.results || d.data || [],
  });
  const { data: expertizes } = useQuery('expertizes', expertizeAPI.list, {
    select: d => d.data?.results || d.data || [],
  });

  return (
    <div>
      {/* Hero */}
      <section className={s.hero}>
        <div className={s.heroIn}>
          <p className={s.pill}>Trusted Medical Platform</p>
          <h1 className={s.title}>Find & Book the<br /><span className={s.ac}>right doctor</span> for you</h1>
          <p className={s.sub}>Browse verified doctors and medical centers. Book in seconds.</p>
          <form className={s.search} onSubmit={e => { e.preventDefault(); navigate(`/providers?search=${q}`); }}>
            <Search size={18} style={{ color: 'var(--steel)', flexShrink: 0 }} />
            <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search by name or specialty..." />
            <Btn variant="teal" size="md" type="submit">Search</Btn>
          </form>
        </div>
      </section>

      {/* Specialties */}
      {expertizes?.length > 0 && (
        <section className={s.sec}>
          <div className={s.secIn}>
            <div className={s.head}><h2>Browse by Specialty</h2>
              <Link to="/providers" className={s.all}>See all <ChevronRight size={14} /></Link>
            </div>
            <div className={s.tags}>
              {expertizes.slice(0, 10).map(e => (
                <button key={e.id} className={s.tag} onClick={() => navigate(`/providers?expertize=${e.id}`)}>{e.name}</button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Top providers */}
      <section className={s.sec} style={{ background: 'var(--ink)' }}>
        <div className={s.secIn}>
          <div className={s.head}>
            <h2 style={{ color: '#fff' }}>Top Providers</h2>
            <Link to="/providers" className={s.all} style={{ color: 'var(--teal)' }}>See all <ChevronRight size={14} /></Link>
          </div>
          {!providers ? <Spinner /> : (
            <div className={s.grid}>
              {providers.map(p => (
                <Link key={p.id} to={`/providers/${p.id}`} className={s.card}>
                  <div className={s.av}>{(p.name || 'P')[0]}</div>
                  <div>
                    <h3>{p.name}</h3>
                    <p style={{ fontSize: 13, color: 'var(--teal)', marginTop: 2 }}>{p.expertize_name || p.type}</p>
                    {p.average_rating != null && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 6 }}>
                        <Stars value={p.average_rating} size={12} />
                        <span style={{ fontSize: 12, color: 'var(--amber)' }}>{parseFloat(p.average_rating).toFixed(1)}</span>
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Why */}
      <section className={s.sec}>
        <div className={s.secIn}>
          <h2 style={{ textAlign: 'center', marginBottom: 36 }}>Why Visit?</h2>
          <div className={s.feats}>
            {[
              { icon: <Shield size={22} />, t: 'Verified Providers', d: 'Every doctor and center is vetted and verified.' },
              { icon: <Calendar size={22} />, t: 'Easy Booking', d: 'Pick a slot and confirm in under a minute.' },
              { icon: <Star size={22} />, t: 'Real Reviews', d: 'Read honest patient reviews before you book.' },
            ].map(f => (
              <div key={f.t} className={s.feat}>
                <div className={s.fIco}>{f.icon}</div>
                <h4>{f.t}</h4>
                <p>{f.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
