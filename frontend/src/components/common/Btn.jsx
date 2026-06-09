import s from './Btn.module.css';

export default function Btn({ children, variant='primary', size='md', full, loading, icon, className='', ...p }) {
  return (
    <button
      className={`${s.btn} ${s[variant]} ${s[size]} ${full ? s.full : ''} ${loading ? s.loading : ''} ${className}`}
      disabled={loading || p.disabled}
      {...p}
    >
      {loading ? <span className={s.spinner} /> : <>{icon && <span className={s.icon}>{icon}</span>}{children}</>}
    </button>
  );
}
