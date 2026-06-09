import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { providersAPI, scheduleAPI, reviewsAPI } from '../api';
import { useAuth } from '../context/AuthContext';
import Spinner from '../components/common/Spinner';
import Stars from '../components/common/Stars';
import Btn from '../components/common/Btn';
import toast from 'react-hot-toast';
import { format, parseISO, startOfWeek, addDays, isSameDay } from 'date-fns';
import { Calendar, Clock, MapPin, Star, ChevronLeft, ChevronRight, MessageSquare, Award } from 'lucide-react';
import s from './ProviderPage.module.css';

export default function ProviderPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const qc = useQueryClient();
  const [weekStart, setWeekStart] = useState(startOfWeek(new Date(), { weekStartsOn: 1 }));
  const [selectedDay, setSelectedDay] = useState(null);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });
  const [showReviewForm, setShowReviewForm] = useState(false);

  const { data: provider, isLoading } = useQuery(
    ['provider', id], () => providersAPI.detail(id), { select: d => d.data },
  );

  const { data: slots } = useQuery(
    ['slots', id], () => providersAPI.slots(id), { select: d => d.data },
  );

  const { data: reviews } = useQuery(
    ['reviews', id], () => reviewsAPI.list({ provider: id }), {
      select: d => d.data?.results || d.data || [],
    },
  );

  const submitReview = useMutation(
    (data) => reviewsAPI.create(data),
    {
      onSuccess: () => {
        toast.success('Review submitted!');
        setShowReviewForm(false);
        setReviewForm({ rating: 5, comment: '' });
        qc.invalidateQueries(['reviews', id]);
      },
      onError: () => toast.error('Could not submit review'),
    },
  );

  if (isLoading) return <Spinner full />;
  if (!provider) return <div style={{ padding: 40, textAlign: 'center' }}>Provider not found.</div>;

  // Build week days
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  // Group slots by date
  const slotsByDate = {};
  if (Array.isArray(slots)) {
    slots.forEach(slot => {
      const dateKey = slot.date || slot.work_day_date || slot.day;
      if (dateKey) {
        if (!slotsByDate[dateKey]) slotsByDate[dateKey] = [];
        slotsByDate[dateKey].push(slot);
      }
    });
  }

  const selectedDayStr = selectedDay ? format(selectedDay, 'yyyy-MM-dd') : null;
  const daySlots = selectedDayStr ? (slotsByDate[selectedDayStr] || []) : [];

  return (
    <div className={s.page}>
      {/* Hero */}
      <div className={s.hero}>
        <div className={s.heroInner}>
          <div className={s.avatar}>{(provider.name || provider.doctor_name || 'P')[0]}</div>
          <div className={s.heroInfo}>
            <h1>{provider.name || provider.doctor_name}</h1>
            <p className={s.spec}>{provider.expertize_name || provider.type}</p>
            <div className={s.badges}>
              {provider.location && <span className={s.badge}><MapPin size={12} />{provider.location}</span>}
              {provider.is_verified && <span className={`${s.badge} ${s.verified}`}><Award size={12} />Verified</span>}
            </div>
            {provider.average_rating != null && (
              <div className={s.ratingRow}>
                <Stars value={provider.average_rating} />
                <span className={s.rNum}>{parseFloat(provider.average_rating).toFixed(1)}</span>
                <span className={s.rCount}>({provider.review_count || 0} reviews)</span>
              </div>
            )}
          </div>
          {user && (
            <Link to={`/book/${provider.id}`}>
              <Btn variant="teal" size="lg" icon={<Calendar size={16} />}>Book Appointment</Btn>
            </Link>
          )}
          {!user && (
            <Link to="/login">
              <Btn variant="teal" size="lg" icon={<Calendar size={16} />}>Sign in to Book</Btn>
            </Link>
          )}
        </div>
      </div>

      <div className={s.body}>
        <div className={s.main}>
          {/* Bio */}
          {provider.bio && (
            <section className={s.sec}>
              <h2>About</h2>
              <p>{provider.bio}</p>
            </section>
          )}

          {/* Weekly calendar */}
          <section className={s.sec}>
            <h2><Calendar size={18} style={{ display: 'inline', marginRight: 8 }} />Availability</h2>
            <div className={s.calNav}>
              <button className={s.calBtn} onClick={() => setWeekStart(d => addDays(d, -7))}>
                <ChevronLeft size={16} />
              </button>
              <span>{format(weekStart, 'MMM d')} — {format(addDays(weekStart, 6), 'MMM d, yyyy')}</span>
              <button className={s.calBtn} onClick={() => setWeekStart(d => addDays(d, 7))}>
                <ChevronRight size={16} />
              </button>
            </div>

            <div className={s.calGrid}>
              {weekDays.map(day => {
                const key = format(day, 'yyyy-MM-dd');
                const dayHasSlots = slotsByDate[key]?.length > 0;
                const isSelected  = selectedDay && isSameDay(day, selectedDay);
                const isPast      = day < new Date().setHours(0,0,0,0);
                return (
                  <button
                    key={key}
                    className={`${s.calDay} ${isSelected ? s.calSelected : ''} ${dayHasSlots ? s.calHasSlots : ''} ${isPast ? s.calPast : ''}`}
                    onClick={() => !isPast && setSelectedDay(isSameDay(day, selectedDay) ? null : day)}
                    disabled={isPast}
                  >
                    <span className={s.dayName}>{format(day, 'EEE')}</span>
                    <span className={s.dayNum}>{format(day, 'd')}</span>
                    {dayHasSlots && <span className={s.dot} />}
                  </button>
                );
              })}
            </div>

            {/* Day slots */}
            {selectedDay && (
              <div className={s.daySlots}>
                <h4>{format(selectedDay, 'EEEE, MMMM d')}</h4>
                {daySlots.length === 0 ? (
                  <p className={s.noSlots}>No slots available this day.</p>
                ) : (
                  <div className={s.slotsGrid}>
                    {daySlots.map(slot => (
                      <div key={slot.id} className={`${s.slot} ${slot.is_booked ? s.slotBooked : s.slotFree}`}>
                        <Clock size={12} />
                        {slot.start_time || slot.time}
                        <span className={slot.is_booked ? s.bookedLabel : s.freeLabel}>
                          {slot.is_booked ? 'Booked' : 'Free'}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
                {user && daySlots.some(sl => !sl.is_booked) && (
                  <Link to={`/book/${provider.id}?date=${format(selectedDay, 'yyyy-MM-dd')}`}>
                    <Btn variant="teal" size="sm" style={{ marginTop: 12 }}>Book for this day</Btn>
                  </Link>
                )}
              </div>
            )}
          </section>

          {/* Reviews */}
          <section className={s.sec}>
            <div className={s.secHead}>
              <h2><MessageSquare size={18} style={{ display: 'inline', marginRight: 8 }} />Reviews</h2>
              {user && !showReviewForm && (
                <Btn variant="outline" size="sm" icon={<Star size={13} />} onClick={() => setShowReviewForm(true)}>
                  Write a Review
                </Btn>
              )}
            </div>

            {showReviewForm && (
              <div className={s.reviewForm}>
                <h4>Your Review</h4>
                <div className={s.ratingPicker}>
                  {[1,2,3,4,5].map(n => (
                    <button key={n} onClick={() => setReviewForm(f => ({ ...f, rating: n }))}>
                      <Star size={24}
                        fill={n <= reviewForm.rating ? '#f0a800' : 'none'}
                        stroke={n <= reviewForm.rating ? '#f0a800' : '#c8d4e3'}
                        strokeWidth={1.5}
                      />
                    </button>
                  ))}
                </div>
                <textarea
                  placeholder="Share your experience..."
                  value={reviewForm.comment}
                  onChange={e => setReviewForm(f => ({ ...f, comment: e.target.value }))}
                  rows={3}
                  className={s.textarea}
                />
                <div style={{ display: 'flex', gap: 8 }}>
                  <Btn variant="teal" size="sm" loading={submitReview.isLoading}
                    onClick={() => submitReview.mutate({ provider: id, ...reviewForm })}>
                    Submit
                  </Btn>
                  <Btn variant="ghost" size="sm" onClick={() => setShowReviewForm(false)}>Cancel</Btn>
                </div>
              </div>
            )}

            {!reviews?.length ? (
              <p className={s.noReviews}>No reviews yet. Be the first!</p>
            ) : (
              <div className={s.reviewList}>
                {reviews.map(r => (
                  <div key={r.id} className={s.review}>
                    <div className={s.reviewTop}>
                      <div className={s.rAvatar}>{(r.user_name || r.patient_name || 'P')[0]}</div>
                      <div>
                        <p className={s.rName}>{r.user_name || r.patient_name || 'Anonymous'}</p>
                        <Stars value={r.rating} size={13} />
                      </div>
                      <span className={s.rDate}>
                        {r.created_at ? format(parseISO(r.created_at), 'MMM d, yyyy') : ''}
                      </span>
                    </div>
                    {r.comment && <p className={s.rText}>{r.comment}</p>}
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>

        {/* Sidebar */}
        <aside className={s.sidebar}>
          <div className={s.infoCard}>
            <h3>Details</h3>
            {provider.expertize_name && <div className={s.iRow}><span>Specialty</span><strong>{provider.expertize_name}</strong></div>}
            {provider.sub_expertize_name && <div className={s.iRow}><span>Sub-specialty</span><strong>{provider.sub_expertize_name}</strong></div>}
            {provider.center_name && <div className={s.iRow}><span>Center</span><strong>{provider.center_name}</strong></div>}
            {provider.location && <div className={s.iRow}><span>Location</span><strong>{provider.location}</strong></div>}
            {provider.phone && <div className={s.iRow}><span>Phone</span><strong>{provider.phone}</strong></div>}
            {provider.consultation_fee && <div className={s.iRow}><span>Fee</span><strong>€{provider.consultation_fee}</strong></div>}
          </div>
        </aside>
      </div>
    </div>
  );
}
