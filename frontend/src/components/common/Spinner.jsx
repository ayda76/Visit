import s from './Spinner.module.css';

export default function Spinner({ size = 32, full = false }) {
  const el = <div className={s.spin} style={{ width: size, height: size }} />;
  if (full) return <div className={s.full}>{el}</div>;
  return el;
}
