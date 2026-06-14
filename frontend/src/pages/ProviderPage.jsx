import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { providersAPI, reviewsAPI } from '../api';
import { useAuth } from '../context/AuthContext';
import Spinner from '../components/common/Spinner';
import Stars from '../components/common/Stars';
import Btn from '../components/common/Btn';
import toast from 'react-hot-toast';
import { format, addDays, startOfToday } from 'date-fns';
import { Calendar, Clock, MapPin, Star, ChevronLeft, ChevronRight, MessageSquare, Award } from 'lucide-react';
import s from './ProviderPage.module.css';

const DAYS = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];

export default function ProviderPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const qc = useQueryClient();
  const [startDate, setStartDate] = useState(startOfToday());
  const [selectedDay, setSelectedDay] = useState(null); // index 0-6 into slotsData
  const [showReview, setShowReview] = useState(false);
  const [rv, setRv] = useState({ rating: 5, comment: '' });

  const { data: provider, isLoading } = useQuery(['provider', id], () => providersAPI.detail(id), { select: d => d.data });

  // Slots API returns: [ { date, weekday, slots: [{start, end, reserved}] } ]
  const { data: slotsData, isLoading: slotsLoading } = useQuery(
    ['slots', id, format(startDate, 'yyyy-MM-dd')],
    () => providersAPI.slots(id, format(startDate, 'yyyy-MM-dd')),
    { select: d => d.data, enabled: !!id },
  );

  const { data: reviews } = useQuery(
    ['reviews', id], () => reviewsAPI.list({ provider_related: id }),
    { select: d => d.data?.results || d.data || [] },
  );

  const submitReview = useMutation(
    (data) => reviewsAPI.create(data),
    {
      onSuccess: () => { toast.success('Review submitted!'); setShowReview(false); setRv({ rating: 5, comment: '' }); qc.invalidateQueries(['reviews', id]); },
      onError: () => toast.error('Could not submit review'),
    },
  );

  if (isLoading) return <Spinner full />;
  if (!provider) return <div style={{ padding: 40, textAlign: 'center' }}>Provider not found.</div>;

  // slotsData is array of 7 days
  const weekDays = Array.isArray(slotsData) ? slotsData : [];
  const selectedDayData = selectedDay !== null ? weekDays[selectedDay] : null;
  const daySlots = selectedDayData?.slots || [];

  return (
    <div>
      {/* Hero */}
      <div className={s.hero}>
        <div className={s.hIn}>
          <div className={s.av}>{(provider.name || 'P')[0]}</div>
          <div className={s.hInfo}>
            <h1>{provider.name}</h1>
            <p className={s.spec}>{provider.expertize_name}</p>
            <div className={s.badges}>
              {provider.location && <span className={s.badge}><MapPin size={12} />{provider.location}</span>}
              {provider.is_active && <span className={`${s.badge} ${s.ver}`}><Award size={12} />Active</span>}
            </div>
            {provider.average_rating != null && (
              <div className={s.rrow}>
                <Stars value={provider.average_rating} />
                <span className={s.rn}>{parseFloat(provider.average_rating).toFixed(1)}</span>
                <span className={s.rc}>({provider.review_count || 0} reviews)</span>
              </div>
            )}
          </div>
          <div>
            {user?.role === 'patient'
              ? <Link to={`/book/${provider.id}`}><Btn variant="teal" size="lg" icon={<Calendar size={16} />}>Book Appointment</Btn></Link>
              : !user && <Link to="/login"><Btn variant="teal" size="lg">Sign in to Book</Btn></Link>
            }
          </div>
        </div>
      </div>

      <div className={s.body}>
        <div className={s.main}>
          {/* Availability calendar */}
          <section className={s.sec}>
            <h2><Calendar size={17} style={{ display: 'inline', marginRight: 8 }} />Weekly Availability</h2>

            {/* Week navigation */}
            <div className={s.wNav}>
              <button className={s.wBtn} onClick={() => { setStartDate(d => addDays(d, -7)); setSelectedDay(null); }}><ChevronLeft size={16} /></button>
              <span>{format(startDate, 'MMM d')} — {format(addDays(startDate, 6), 'MMM d, yyyy')}</span>
              <button className={s.wBtn} onClick={() => { setStartDate(d => addDays(d, 7)); setSelectedDay(null); }}><ChevronRight size={16} /></button>
            </div>

            {slotsLoading ? <Spinner size={24} /> : (
              <div className={s.calGrid}>
                {weekDays.map((day, idx) => {
                  const freeCount = day.slots?.filter(sl => !sl.reserved).length || 0;
                  const isPast = new Date(day.date) < startOfToday();
                  return (
                    <button key={day.date}
                      className={`${s.calDay} ${selectedDay === idx ? s.calSel : ''} ${freeCount > 0 ? s.calHas : ''} ${isPast ? s.calPast : ''}`}
                      onClick={() => !isPast && setSelectedDay(selectedDay === idx ? null : idx)}
                      disabled={isPast}
                    >
                      <span className={s.dName}>{DAYS[day.weekday]}</span>
                      <span className={s.dNum}>{format(new Date(day.date), 'd')}</span>
                      {freeCount > 0 && <span className={s.dDot} />}
                      {freeCount > 0 && <span className={s.dCnt}>{freeCount} free</span>}
                    </button>
                  );
                })}
              </div>
            )}

            {/* Slots for selected day */}
            {selectedDayData && (
              <div className={s.dayBox}>
                <h4>{format(new Date(selectedDayData.date), 'EEEE, MMMM d')}</h4>
                {daySlots.length === 0
                  ? <p className={s.noSlots}>No slots configured for this day.</p>
                  : <div className={s.sGrid}>
                    {daySlots.map((sl, i) => (
                      <div key={i} className={`${s.slot} ${sl.reserved ? s.slotRes : s.slotFree}`}>
                        <Clock size={11} />
                        {sl.start.slice(0, 5)} – {sl.end.slice(0, 5)}
                        <span className={sl.reserved ? s.lRes : s.lFree}>{sl.reserved ? 'Booked' : 'Free'}</span>
                      </div>
                    ))}
                  </div>
                }
                {user?.role === 'patient' && daySlots.some(sl => !sl.reserved) && (
                  <Link to={`/book/${provider.id}?date=${selectedDayData.date}`}>
                    <Btn variant="teal" size="sm" style={{ marginTop: 12 }}>Book for this day</Btn>
                  </Link>
                )}
              </div>
            )}
          </section>

          {/* Reviews */}
          <section className={s.sec}>
            <div className={s.secH}>
              <h2><MessageSquare size={17} style={{ display: 'inline', marginRight: 8 }} />Reviews</h2>
              {user?.role === 'patient' && !showReview && (
                <Btn variant="outline" size="sm" icon={<Star size={13} />} onClick={() => setShowReview(true)}>Write Review</Btn>
              )}
            </div>
            {showReview && (
              <div className={s.rvForm}>
                <div style={{ display: 'flex', gap: 4 }}>
                  {[1,2,3,4,5].map(n => (
                    <button key={n} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 2 }} onClick={() => setRv(r => ({ ...r, rating: n }))}>
                      <Star size={24} fill={n <= rv.rating ? '#f0a800' : 'none'} stroke={n <= rv.rating ? '#f0a800' : '#c8d4e3'} strokeWidth={1.5} />
                    </button>
                  ))}
                </div>
                <textarea placeholder="Share your experience..." value={rv.comment} onChange={e => setRv(r => ({ ...r, comment: e.target.value }))} rows={3} />
                <div style={{ display: 'flex', gap: 8 }}>
                  <Btn variant="teal" size="sm" loading={submitReview.isLoading}
                    onClick={() => submitReview.mutate({ provider_related: id, rating: rv.rating, comment: rv.comment })}>Submit</Btn>
                  <Btn variant="ghost" size="sm" onClick={() => setShowReview(false)}>Cancel</Btn>
                </div>
              </div>
            )}
            {!reviews?.length ? <p style={{ color: 'var(--steel)', fontSize: 14 }}>No reviews yet.</p> : (
              <div className={s.rvList}>
                {reviews.map(r => (
                  <div key={r.id} className={s.rv}>
                    <div className={s.rvTop}>
                      <div className={s.rvAv}>{(r.patient_name || 'P')[0]}</div>
                      <div><p className={s.rvName}>{r.patient_name || 'Anonymous'}</p><Stars value={r.rating} size={13} /></div>
                      <span className={s.rvDate}>{r.created_at ? format(new Date(r.created_at), 'MMM d, yyyy') : ''}</span>
                    </div>
                    {r.comment && <p className={s.rvTxt}>{r.comment}</p>}
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>

        {/* Sidebar */}
        <aside className={s.side}>
          <div className={s.iCard}>
            <h3>Details</h3>
            {provider.expertize_name && <div className={s.iRow}><span>Specialty</span><strong>{provider.expertize_name}</strong></div>}
            {provider.Center_related && <div className={s.iRow}><span>Center</span><strong>{provider.Center_related}</strong></div>}
          </div>
        </aside>
      </div>
    </div>
  );
}
