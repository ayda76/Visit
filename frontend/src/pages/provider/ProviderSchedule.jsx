import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { scheduleAPI } from '../../api';
import Spinner from '../../components/common/Spinner';
import Btn from '../../components/common/Btn';
import Field from '../../components/common/Field';
import toast from 'react-hot-toast';
import { Plus, Trash2, Clock } from 'lucide-react';

const WEEKDAYS = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];

export default function ProviderSchedule() {
  const qc = useQueryClient();
  const [showAdd, setShowAdd] = useState(false);
  const [newDay, setNewDay] = useState({ day: 0, duration_min: 30, is_active: true });
  const [addingHours, setAddingHours] = useState(null); // workday id
  const [newHour, setNewHour] = useState({ start_time: '09:00', end_time: '17:00' });

  const { data: workdays, isLoading } = useQuery(
    'workdays', () => scheduleAPI.workDays(),
    { select: d => d.data?.results || d.data || [] },
  );

  const { data: workhours } = useQuery(
    'workhours', () => scheduleAPI.workHours(),
    { select: d => d.data?.results || d.data || [] },
  );

  const createDay = useMutation(d => scheduleAPI.createWorkDay(d), {
    onSuccess: () => { toast.success('Work day added!'); qc.invalidateQueries('workdays'); setShowAdd(false); setNewDay({ day: 0, duration_min: 30, is_active: true }); },
    onError: () => toast.error('Failed to add work day'),
  });

  const deleteDay = useMutation(id => scheduleAPI.deleteWorkDay(id), {
    onSuccess: () => { toast.success('Work day removed'); qc.invalidateQueries('workdays'); qc.invalidateQueries('workhours'); },
    onError: () => toast.error('Failed to remove'),
  });

  const createHour = useMutation(d => scheduleAPI.createWorkHour(d), {
    onSuccess: () => { toast.success('Hours added!'); qc.invalidateQueries('workhours'); setAddingHours(null); setNewHour({ start_time: '09:00', end_time: '17:00' }); },
    onError: () => toast.error('Failed to add hours'),
  });

  const deleteHour = useMutation(id => scheduleAPI.deleteWorkHour(id), {
    onSuccess: () => { toast.success('Hours removed'); qc.invalidateQueries('workhours'); },
  });

  const getHoursForDay = (dayId) => (workhours || []).filter(h => h.workday_related === dayId);

  return (
    <div style={{ padding: '40px 32px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 28, color: 'var(--ink)' }}>My Schedule</h1>
          <p style={{ color: 'var(--steel)', marginTop: 4 }}>Set your working days and hours</p>
        </div>
        <Btn variant="teal" icon={<Plus size={15} />} onClick={() => setShowAdd(v => !v)}>Add Work Day</Btn>
      </div>

      {/* Add new work day */}
      {showAdd && (
        <div style={{ background: 'var(--white)', border: '1px solid var(--fog)', borderRadius: 'var(--r-lg)', padding: 24, marginBottom: 24, display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'flex-end' }}>
          <Field label="Day of Week">
            <select value={newDay.day} onChange={e => setNewDay(d => ({ ...d, day: Number(e.target.value) }))}>
              {WEEKDAYS.map((w, i) => <option key={i} value={i}>{w}</option>)}
            </select>
          </Field>
          <Field label="Slot Duration (minutes)">
            <input type="number" min={5} max={120} value={newDay.duration_min} onChange={e => setNewDay(d => ({ ...d, duration_min: Number(e.target.value) }))} style={{ width: 120 }} />
          </Field>
          <div style={{ display: 'flex', gap: 8 }}>
            <Btn variant="teal" loading={createDay.isLoading} onClick={() => createDay.mutate(newDay)}>Save</Btn>
            <Btn variant="ghost" onClick={() => setShowAdd(false)}>Cancel</Btn>
          </div>
        </div>
      )}

      {isLoading ? <Spinner /> : !workdays?.length ? (
        <div style={{ background: 'var(--white)', border: '1px dashed var(--fog)', borderRadius: 'var(--r-lg)', padding: 60, textAlign: 'center', color: 'var(--steel)' }}>
          <Clock size={40} style={{ color: 'var(--mist)', marginBottom: 12 }} />
          <p>No work days configured yet.</p>
          <p style={{ fontSize: 14, marginTop: 6 }}>Click "Add Work Day" to get started.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {(workdays || []).sort((a,b) => a.day - b.day).map(wd => (
            <div key={wd.id} style={{ background: 'var(--white)', border: '1px solid var(--fog)', borderRadius: 'var(--r-lg)', overflow: 'hidden' }}>
              {/* Day header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderBottom: '1px solid var(--fog)', background: wd.is_active ? 'var(--teal-pale)' : 'var(--fog)' }}>
                <div>
                  <h3 style={{ fontSize: 16, color: 'var(--ink)', fontFamily: 'var(--font-b)', fontWeight: 600 }}>{WEEKDAYS[wd.day]}</h3>
                  <p style={{ fontSize: 13, color: 'var(--steel)', marginTop: 2 }}>Slot duration: {wd.duration_min} min · {wd.is_active ? 'Active' : 'Inactive'}</p>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <Btn variant="outline" size="sm" icon={<Plus size={13} />} onClick={() => setAddingHours(wd.id)}>Add Hours</Btn>
                  <Btn variant="danger" size="sm" icon={<Trash2 size={13} />} onClick={() => deleteDay.mutate(wd.id)} />
                </div>
              </div>

              {/* Add hours form */}
              {addingHours === wd.id && (
                <div style={{ padding: '14px 20px', background: 'var(--fog)', display: 'flex', gap: 14, alignItems: 'flex-end', flexWrap: 'wrap', borderBottom: '1px solid var(--fog)' }}>
                  <Field label="Start Time">
                    <input type="time" value={newHour.start_time} onChange={e => setNewHour(h => ({ ...h, start_time: e.target.value }))} style={{ width: 130 }} />
                  </Field>
                  <Field label="End Time">
                    <input type="time" value={newHour.end_time} onChange={e => setNewHour(h => ({ ...h, end_time: e.target.value }))} style={{ width: 130 }} />
                  </Field>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <Btn variant="teal" size="sm" loading={createHour.isLoading}
                      onClick={() => createHour.mutate({ workday_related: wd.id, start_time: newHour.start_time + ':00', end_time: newHour.end_time + ':00' })}>Save</Btn>
                    <Btn variant="ghost" size="sm" onClick={() => setAddingHours(null)}>Cancel</Btn>
                  </div>
                </div>
              )}

              {/* Existing hours */}
              <div style={{ padding: '14px 20px', display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {getHoursForDay(wd.id).length === 0
                  ? <p style={{ fontSize: 14, color: 'var(--steel)' }}>No hours set. Add a time range above.</p>
                  : getHoursForDay(wd.id).map(h => (
                    <div key={h.id} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 12px', background: 'var(--fog)', borderRadius: 'var(--r-sm)', fontSize: 14, fontWeight: 500 }}>
                      <Clock size={13} style={{ color: 'var(--teal)' }} />
                      {h.start_time?.slice(0,5)} – {h.end_time?.slice(0,5)}
                      <button onClick={() => deleteHour.mutate(h.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--steel)', display: 'flex', alignItems: 'center', marginLeft: 4 }}>
                        <Trash2 size={13} />
                      </button>
                    </div>
                  ))
                }
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
