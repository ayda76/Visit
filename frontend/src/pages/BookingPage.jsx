import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from 'react-query';
import { doctorsAPI, appointmentsAPI } from '../api';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Button from '../components/common/Button';
import toast from 'react-hot-toast';
import { format, addDays, startOfToday } from 'date-fns';
import { Calendar, Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import styles from './BookingPage.module.css';

const DAYS_AHEAD = 14;

function generateDays() {
  return Array.from({ length: DAYS_AHEAD }, (_, i) => addDays(startOfToday(), i));
}

export default function BookingPage() {
  const { doctorId } = useParams();
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(startOfToday());
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [reason, setReason] = useState('');
  const days = generateDays();

  const { data: doctor } = useQuery(
    ['doctor', doctorId],
    () => doctorsAPI.detail(doctorId),
    { select: d => d.data },
  );

  const { data: slots, isLoading: slotsLoading } = useQuery(
    ['slots', doctorId, format(selectedDate, 'yyyy-MM-dd')],
    () => doctorsAPI.available(doctorId, { date: format(selectedDate, 'yyyy-MM-dd') }),
    { select: d => d.data?.slots || d.data || [], enabled: !!doctorId },
  );

  const bookMutation = useMutation(
    () => appointmentsAPI.create({
      doctor: doctorId,
      appointment_date: format(selectedDate, 'yyyy-MM-dd'),
      appointment_time: selectedSlot,
      reason,
    }),
    {
      onSuccess: () => {
        toast.success('Appointment booked successfully!');
        navigate('/appointments');
      },
      onError: (err) => {
        toast.error(err?.response?.data?.detail || 'Booking failed. Please try again.');
      },
    },
  );

  const handleBook = () => {
    if (!selectedSlot) { toast.error('Please select a time slot'); return; }
    bookMutation.mutate();
  };

  return (
    <div className={styles.page}>
      <div className={styles.inner}>
        <button className={styles.back} onClick={() => navigate(-1)}>
          <ChevronLeft size={16} /> Back
        </button>

        <div className={styles.grid}>
          {/* Left: Doctor info + picker */}
          <div className={styles.left}>
            <h1 className={styles.title}>Book an Appointment</h1>

            {doctor && (
              <div className={styles.doctorMini}>
                <div className={styles.miniAvatar}>{(doctor.full_name || 'D').charAt(0)}</div>
                <div>
                  <p className={styles.miniName}>Dr. {doctor.full_name}</p>
                  <p className={styles.miniSpec}>{doctor.specialty_name || doctor.specialty}</p>
                  {doctor.consultation_fee && (
                    <p className={styles.miniFee}>€{doctor.consultation_fee} per visit</p>
                  )}
                </div>
              </div>
            )}

            {/* Date picker */}
            <div className={styles.section}>
              <h3><Calendar size={16} /> Select Date</h3>
              <div className={styles.daysRow}>
                {days.map(day => (
                  <button
                    key={day.toISOString()}
                    className={`${styles.dayBtn} ${format(day,'yyyy-MM-dd') === format(selectedDate,'yyyy-MM-dd') ? styles.daySelected : ''}`}
                    onClick={() => { setSelectedDate(day); setSelectedSlot(null); }}
                  >
                    <span className={styles.dayName}>{format(day, 'EEE')}</span>
                    <span className={styles.dayNum}>{format(day, 'd')}</span>
                    <span className={styles.dayMon}>{format(day, 'MMM')}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Time slots */}
            <div className={styles.section}>
              <h3><Clock size={16} /> Select Time</h3>
              {slotsLoading ? (
                <div style={{ padding: 24, display: 'flex', justifyContent: 'center' }}>
                  <LoadingSpinner size={24} />
                </div>
              ) : !slots?.length ? (
                <p className={styles.noSlots}>No available slots for this date.</p>
              ) : (
                <div className={styles.slotsGrid}>
                  {slots.map(slot => (
                    <button
                      key={slot}
                      className={`${styles.slotBtn} ${selectedSlot === slot ? styles.slotSelected : ''}`}
                      onClick={() => setSelectedSlot(slot)}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right: Confirm card */}
          <div className={styles.right}>
            <div className={styles.confirmCard}>
              <h3>Appointment Summary</h3>

              <div className={styles.summaryRow}>
                <span>Doctor</span>
                <strong>Dr. {doctor?.full_name || '—'}</strong>
              </div>
              <div className={styles.summaryRow}>
                <span>Date</span>
                <strong>{format(selectedDate, 'EEE, d MMM yyyy')}</strong>
              </div>
              <div className={styles.summaryRow}>
                <span>Time</span>
                <strong>{selectedSlot || '—'}</strong>
              </div>
              {doctor?.consultation_fee && (
                <div className={styles.summaryRow}>
                  <span>Fee</span>
                  <strong>€{doctor.consultation_fee}</strong>
                </div>
              )}

              <div className={styles.reasonSection}>
                <label>Reason for visit</label>
                <textarea
                  placeholder="Briefly describe your concern (optional)"
                  value={reason}
                  onChange={e => setReason(e.target.value)}
                  rows={3}
                  className={styles.textarea}
                />
              </div>

              <Button
                variant="teal"
                size="lg"
                fullWidth
                loading={bookMutation.isLoading}
                disabled={!selectedSlot}
                onClick={handleBook}
              >
                Confirm Booking
              </Button>

              <p className={styles.note}>
                You can cancel or reschedule up to 24 hours before your appointment.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
