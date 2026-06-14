import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Stethoscope, Menu, X, ChevronDown, LogOut, User, Calendar, LayoutDashboard } from 'lucide-react';
import s from './Layout.module.css';

function Navbar() {
  const { user, logout, isAdmin, isProvider } = useAuth();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [drop, setDrop] = useState(false);
  const [mob, setMob]   = useState(false);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', h);
    return () => window.removeEventListener('scroll', h);
  }, []);

  const doLogout = () => { logout(); navigate('/'); setDrop(false); };

  const dashLink = isAdmin ? '/admin' : isProvider ? '/provider/dashboard' : '/appointments';

  return (
    <header className={`${s.bar} ${scrolled ? s.sc : ''}`}>
      <div className={s.inner}>
        <Link to="/" className={s.logo}><Stethoscope size={20} strokeWidth={1.8}/>Visit</Link>
        <nav className={s.nav}>
          <NavLink to="/providers" className={({isActive})=>`${s.lk}${isActive?' '+s.act:''}`}>Doctors & Centers</NavLink>
        </nav>
        <div className={s.right}>
          {user ? (
            <div className={s.uWrap}>
              <button className={s.uBtn} onClick={()=>setDrop(v=>!v)}>
                <span className={s.av}>{(user.firstname||user.username||'U')[0].toUpperCase()}</span>
                <span className={s.un}>{user.firstname||user.username}</span>
                <ChevronDown size={13} className={drop?s.rot:''}/>
              </button>
              {drop && <>
                <div className={s.bd} onClick={()=>setDrop(false)}/>
                <div className={s.dp}>
                  <Link to={dashLink} className={s.di} onClick={()=>setDrop(false)}><LayoutDashboard size={14}/>Dashboard</Link>
                  <Link to="/profile" className={s.di} onClick={()=>setDrop(false)}><User size={14}/>Profile</Link>
                  <hr className={s.hr}/>
                  <button className={`${s.di} ${s.dng}`} onClick={doLogout}><LogOut size={14}/>Sign Out</button>
                </div>
              </>}
            </div>
          ) : (
            <>
              <Link to="/login" className={s.li}>Sign In</Link>
              <Link to="/register" className={s.re}>Get Started</Link>
            </>
          )}
        </div>
        <button className={s.bg} onClick={()=>setMob(v=>!v)}>{mob?<X size={20}/>:<Menu size={20}/>}</button>
      </div>
      {mob && (
        <div className={s.mb}>
          <NavLink to="/providers" onClick={()=>setMob(false)} className={s.ml}>Doctors & Centers</NavLink>
          {user ? (
            <>
              <NavLink to={dashLink} onClick={()=>setMob(false)} className={s.ml}>Dashboard</NavLink>
              <NavLink to="/profile" onClick={()=>setMob(false)} className={s.ml}>Profile</NavLink>
              <button className={`${s.ml} ${s.dng}`} onClick={doLogout}>Sign Out</button>
            </>
          ) : (
            <>
              <NavLink to="/login" onClick={()=>setMob(false)} className={s.ml}>Sign In</NavLink>
              <NavLink to="/register" onClick={()=>setMob(false)} className={s.ml}>Register</NavLink>
              <NavLink to="/provider-signup" onClick={()=>setMob(false)} className={s.ml}>Join as Provider</NavLink>
            </>
          )}
        </div>
      )}
    </header>
  );
}

function Footer() {
  return (
    <footer style={{background:'var(--ink)',padding:'28px 24px',marginTop:'auto'}}>
      <div style={{maxWidth:1160,margin:'0 auto',display:'flex',alignItems:'center',gap:32,flexWrap:'wrap'}}>
        <Link to="/" style={{display:'flex',alignItems:'center',gap:8,fontFamily:'var(--font-d)',fontSize:18,fontWeight:600,color:'#fff'}}>
          <Stethoscope size={16} style={{color:'var(--teal)'}}/> Visit
        </Link>
        <nav style={{display:'flex',gap:20,flex:1,flexWrap:'wrap'}}>
          {[['Doctors & Centers','/providers'],['Sign In','/login'],['Register','/register'],['Join as Provider','/provider-signup']].map(([l,h])=>(
            <Link key={h} to={h} style={{fontSize:14,color:'var(--steel)',transition:'color var(--t)'}}>{l}</Link>
          ))}
        </nav>
        <p style={{fontSize:13,color:'var(--slate)',marginLeft:'auto'}}>© {new Date().getFullYear()} Visit</p>
      </div>
    </footer>
  );
}

export default function Layout() {
  return (
    <div style={{display:'flex',flexDirection:'column',minHeight:'100vh'}}>
      <Navbar/>
      <main style={{flex:1}}><Outlet/></main>
      <Footer/>
    </div>
  );
}
