import s from './Spinner.module.css';
export default function Spinner({ size=32, full=false }) {
  const el = <div className={s.s} style={{width:size,height:size}} />;
  return full ? <div className={s.f}>{el}</div> : el;
}
