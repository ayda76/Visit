import { useState } from 'react';
import { useParams, useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useQuery, useMutation } from 'react-query';
import { providersAPI, scheduleAPI, appointmentsAPI } from '../api';
import Spinner from '../components/common/Spinner';
import Btn from '../components/common/Btn';
import toast from 'react-hot-toast';
import { format, addDays, startOfToday, isSameDay } from 'date-fns';
import { Calendar, Clock, ChevronLeft } from 'lucide-react';
import s from './BookPage.module.css';

export default function BookPage() {
  const { providerId } = useParams();
  const navigate = useNavigate();
  const [sp] = useSearchParams();
  const initDate = sp.get('date') ? new Date(sp.get('date')) : startOfToday();

  const [selectedDate, setSelectedDate] = useState(initDate);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [reason, setReason] = useState('');

  const days = Array.from({ length: 14 }, (_, i) => addDays(startOfToday(), i));

  const { data: provider } = useQuery(
    ['provider', providerId], () => providersAPI.detail(providerId), { select: d => d.data },
  );

  const { data: allSlots } = useQuery(
    ['slots', providerId], () => providersAPI.slots(providerId), { select: d => d.data },
  );

  // Group and filter slots for selected date
  const selectedDateStr = format(selectedDate, 'yyyy-MM-dd');
  const daySlots = Array.isArray(allSlots)
    ? allSlots.filter(sl => {
        const d = sl.date || sl.work_day_date || sl.day;
        return d === selectedDateStr && !sl.is_booked;
      })
    : [];

  const bookMutation = useMutation(
    () => appointmentsAPI.create({
      provider: providerId,
      work_hour: selectedSlot?.id,
      date: selectedDateStr,
      reason,
    }),
    {
      onSuccess: () => {
        toast.success('Appointment booked!');
        navigate('/appointments');
      },
      onError: (err) => {
        toast.error(err?.response?.data?.detail || 'Booking failed. Please try again.');
      },
    },
  );

  return (
    <div className={s.page}>
      <div className={s.inner}>
        <button className={s.back} onClick={() => navigate(-1)}>
          <ChevronLeft size={16} /> Back
        </button>

        <h1 className={s.title}>Book Appointment</h1>

        {provider && (
          <div className={s.providerBar}>
            <div className={s.pAvatar}>{(provider.name || provider.doctor_name || 'P')[0]}</div>
            <div>
              <p className={s.pName}>{provider.name || provider.doctor_name}</p>
              <p className={s.pSpec}>{provider.expertize_name || provider.type}</p>
            </div>
          </div>
        )}

        <div className={s.grid}>
          <div className={s.left}>
            {/* Date picker */}
            <div className={s.card}>
              <h3><Calendar size={16} /> Select Date</h3>
              <div className={s.dayScroll}>
                {days.map(day => {
                  const key = format(day, 'yyyy-MM-dd');
                  const hasSlots = Array.isArray(allSlots) && allSlots.some(sl => {
                    const d = sl.date || sl.work_day_date || sl.day;
                    return d === key && !sl.is_booked;
                  });
                  return (
                    <button
                      key={key}
                      className={`${s.dayBtn} ${isSameDay(day, selectedDate) ? s.daySelected : ''} ${hasSlots ? s.dayHas : ''}`}
                      onClick={() => { setSelectedDate(day); setSelectedSlot(null); }}
                    >
                      <span className={s.dName}>{format(day, 'EEE')}</span>
                      <span className={s.dNum}>{format(day, 'd')}</span>
                      <span className={s.dMon}>{format(day, 'MMM')}</span>
                      {hasSlots && <span className={s.dDot} />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Slots */}
            <div className={s.card}>
              <h3><Clock size={16} /> Available Times — {format(selectedDate, 'EEE, MMM d')}</h3>
              {daySlots.length === 0 ? (
                <p className={s.noSlots}>No available slots for this date.</p>
              ) : (
                <div className={s.slotsGrid}>
                  {daySlots.map(slot => (
                    <button
                      key={slot.id}
                      className={`${s.slotBtn} ${selectedSlot?.id === slot.id ? s.slotSel : ''}`}
                      onClick={() => setSelectedSlot(slot)}
                    >
                      {slot.start_time || slot.time}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Summary card */}
          <div className={s.right}>
            <div className={s.summary}>
              <h3>Summary</h3>
              <div className={s.sRow}><span>Provider</span><strong>{provider?.name || provider?.doctor_name || '—'}</strong></div>
              <div className={s.sRow}><span>Date</span><strong>{format(selectedDate, 'EEE, MMM d yyyy')}</strong></div>
              <div className={s.sRow}><span>Time</span><strong>{selectedSlot ? (selectedSlot.start_time || selectedSlot.time) : '—'}</strong></div>
              {provider?.consultation_fee && (
                <div className={s.sRow}><span>Fee</span><strong>€{provider.consultation_fee}</strong></div>
              )}
              <div className={s.reasonField}>
                <label>Reason (optional)</label>
                <textarea
                  value={reason}
                  onChange={e => setReason(e.target.value)}
                  placeholder="Describe your concern..."
                  rows={3}
                  className={s.textarea}
                />
              </div>
              <Btn
                variant="teal" size="lg" full
                loading={bookMutation.isLoading}
                disabled={!selectedSlot}
                onClick={() => bookMutation.mutate()}
              >
                Confirm Booking
              </Btn>
              <p className={s.note}>You can cancel up to 24 hours before your appointment.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
