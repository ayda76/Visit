import s from './Field.module.css';
export default function Field({ label, error, children }) {
  return (
    <div className={s.f}>
      {label && <label className={s.l}>{label}</label>}
      {children}
      {error && <span className={s.e}>{error}</span>}
    </div>
  );
}
