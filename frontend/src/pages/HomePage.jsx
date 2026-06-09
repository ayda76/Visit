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
    <div className={s.page}>
      {/* Hero */}
      <section className={s.hero}>
        <div className={s.heroInner}>
          <p className={s.pill}>Trusted Medical Platform</p>
          <h1 className={s.title}>Find & Book the<br /><span className={s.accent}>right doctor</span> for you</h1>
          <p className={s.sub}>Browse verified doctors and medical centers. Book appointments in seconds.</p>
          <form className={s.search} onSubmit={e => { e.preventDefault(); navigate(`/providers?search=${q}`); }}>
            <Search size={18} className={s.searchIco} />
            <input
              value={q} onChange={e => setQ(e.target.value)}
              placeholder="Search by name, specialty, center..."
            />
            <Btn variant="teal" size="md" type="submit">Search</Btn>
          </form>
        </div>
      </section>

      {/* Specialties */}
      {expertizes?.length > 0 && (
        <section className={s.section}>
          <div className={s.sInner}>
            <div className={s.sHead}>
              <h2>Browse by Specialty</h2>
              <Link to="/providers" className={s.seeAll}>See all <ChevronRight size={14} /></Link>
            </div>
            <div className={s.tagGrid}>
              {expertizes.slice(0, 10).map(e => (
                <button key={e.id} className={s.tag}
                  onClick={() => navigate(`/providers?expertize=${e.id}`)}>
                  {e.name}
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Top providers */}
      <section className={s.section} style={{ background: 'var(--ink)' }}>
        <div className={s.sInner}>
          <div className={s.sHead}>
            <h2 style={{ color: 'var(--white)' }}>Top Providers</h2>
            <Link to="/providers" className={s.seeAll} style={{ color: 'var(--teal)' }}>
              See all <ChevronRight size={14} />
            </Link>
          </div>
          {!providers ? <Spinner /> : (
            <div className={s.cards}>
              {providers.map(p => <ProviderCard key={p.id} provider={p} />)}
            </div>
          )}
        </div>
      </section>

      {/* Why */}
      <section className={s.section}>
        <div className={s.sInner}>
          <h2 style={{ textAlign: 'center', marginBottom: 36 }}>Why Visit?</h2>
          <div className={s.features}>
            {[
              { icon: <Shield size={22} />, title: 'Verified Providers', desc: 'Every doctor and center is vetted and verified.' },
              { icon: <Calendar size={22} />, title: 'Easy Booking', desc: 'Pick a slot and confirm in under a minute.' },
              { icon: <Star size={22} />, title: 'Real Reviews', desc: 'Read honest patient reviews before you book.' },
            ].map(f => (
              <div key={f.title} className={s.feature}>
                <div className={s.fIcon}>{f.icon}</div>
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

function ProviderCard({ provider }) {
  return (
    <Link to={`/providers/${provider.id}`} className={s.card}>
      <div className={s.cardAvatar}>{(provider.name || provider.doctor_name || 'P')[0]}</div>
      <div className={s.cardInfo}>
        <h3>{provider.name || provider.doctor_name}</h3>
        <p className={s.cardSpec}>{provider.expertize_name || provider.type}</p>
        {provider.average_rating != null && (
          <div className={s.cardRating}>
            <Stars value={provider.average_rating} size={13} />
            <span>{parseFloat(provider.average_rating).toFixed(1)}</span>
          </div>
        )}
      </div>
    </Link>
  );
}
