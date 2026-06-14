import s from './Btn.module.css';
export default function Btn({ children, variant='primary', size='md', full, loading, icon, className='', ...p }) {
  return (
    <button className={`${s.b} ${s[variant]} ${s[size]} ${full?s.full:''} ${loading?s.dis:''} ${className}`}
      disabled={loading||p.disabled} {...p}>
      {loading ? <span className={s.spin}/> : <>{icon&&<span className={s.ico}>{icon}</span>}{children}</>}
    </button>
  );
}
