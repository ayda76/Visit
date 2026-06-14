import { useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useQuery, useMutation } from 'react-query';
import { providersAPI, appointmentsAPI } from '../api';
import Spinner from '../components/common/Spinner';
import Btn from '../components/common/Btn';
import toast from 'react-hot-toast';
import { format, addDays, startOfToday, isSameDay } from 'date-fns';
import { Calendar, Clock, ChevronLeft } from 'lucide-react';
import s from './BookPage.module.css';

const DAYS = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];

export default function BookPage() {
  const { providerId } = useParams();
  const navigate = useNavigate();
  const [sp] = useSearchParams();
  const initDate = sp.get('date') ? new Date(sp.get('date')) : startOfToday();

  const [selectedDate, setSelectedDate] = useState(initDate);
  const [selectedSlot, setSelectedSlot] = useState(null); // {start, end, reserved}
  const days = Array.from({ length: 14 }, (_, i) => addDays(startOfToday(), i));

  const { data: provider } = useQuery(['provider', providerId], () => providersAPI.detail(providerId), { select: d => d.data });

  // Fetch slots for a 7-day window starting from selected date
  const windowStart = format(selectedDate, 'yyyy-MM-dd');
  const { data: slotsData, isLoading: slotsLoading } = useQuery(
    ['slots', providerId, windowStart],
    () => providersAPI.slots(providerId, windowStart),
    { select: d => d.data, enabled: !!providerId },
  );

  // Find slots for exactly the selected date
  const selectedDateStr = format(selectedDate, 'yyyy-MM-dd');
  const dayData = Array.isArray(slotsData) ? slotsData.find(d => d.date === selectedDateStr) : null;
  const freeSlots = dayData?.slots?.filter(sl => !sl.reserved) || [];

  // Appointment model fields: provider_related, date, start_time, end_time, weekday
  const bookMutation = useMutation(
    () => appointmentsAPI.create({
      provider_related: providerId,
      date: selectedDateStr,
      start_time: selectedSlot.start,
      end_time: selectedSlot.end,
      weekday: selectedDate.getDay() === 0 ? 6 : selectedDate.getDay() - 1, // convert JS Sunday=0 to Python Monday=0
    }),
    {
      onSuccess: () => { toast.success('Appointment booked!'); navigate('/appointments'); },
      onError: err => toast.error(err?.response?.data?.detail || err?.response?.data?.non_field_errors?.[0] || 'Booking failed'),
    },
  );

  return (
    <div className={s.page}>
      <div className={s.inner}>
        <button className={s.back} onClick={() => navigate(-1)}><ChevronLeft size={16} /> Back</button>
        <h1>Book Appointment</h1>

        {provider && (
          <div className={s.pBar}>
            <div className={s.pAv}>{(provider.name || 'P')[0]}</div>
            <div><p className={s.pN}>{provider.name}</p><p className={s.pS}>{provider.expertize_name}</p></div>
          </div>
        )}

        <div className={s.grid}>
          <div className={s.left}>
            {/* Date picker */}
            <div className={s.card}>
              <h3><Calendar size={15} /> Select Date</h3>
              <div className={s.dayScroll}>
                {days.map(day => {
                  const key = format(day, 'yyyy-MM-dd');
                  const isSelected = isSameDay(day, selectedDate);
                  return (
                    <button key={key} className={`${s.dayB} ${isSelected ? s.dayS : ''}`}
                      onClick={() => { setSelectedDate(day); setSelectedSlot(null); }}>
                      <span className={s.dN}>{DAYS[day.getDay() === 0 ? 6 : day.getDay() - 1]}</span>
                      <span className={s.dD}>{format(day, 'd')}</span>
                      <span className={s.dM}>{format(day, 'MMM')}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Time slots */}
            <div className={s.card}>
              <h3><Clock size={15} /> Available Times — {format(selectedDate, 'EEE, MMM d')}</h3>
              {slotsLoading ? <Spinner size={24} /> : freeSlots.length === 0 ? (
                <p className={s.noSl}>No available slots for this date.</p>
              ) : (
                <div className={s.slGrid}>
                  {freeSlots.map((sl, i) => (
                    <button key={i}
                      className={`${s.slBtn} ${selectedSlot === sl ? s.slSel : ''}`}
                      onClick={() => setSelectedSlot(sl)}>
                      {sl.start.slice(0, 5)} – {sl.end.slice(0, 5)}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Summary */}
          <div className={s.right}>
            <div className={s.sum}>
              <h3>Summary</h3>
              <div className={s.sRow}><span>Provider</span><strong>{provider?.name || '—'}</strong></div>
              <div className={s.sRow}><span>Date</span><strong>{format(selectedDate, 'EEE, MMM d yyyy')}</strong></div>
              <div className={s.sRow}><span>Time</span><strong>{selectedSlot ? `${selectedSlot.start.slice(0,5)} – ${selectedSlot.end.slice(0,5)}` : '—'}</strong></div>
              <Btn variant="teal" size="lg" full loading={bookMutation.isLoading} disabled={!selectedSlot}
                onClick={() => bookMutation.mutate()}>
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
