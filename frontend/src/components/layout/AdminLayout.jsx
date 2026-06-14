import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Stethoscope, LayoutDashboard, FileCheck, Users, Building2, Stethoscope as Doc, LogOut } from 'lucide-react';
import s from './AdminLayout.module.css';

const NAV = [
  { to: '/admin',              icon: <LayoutDashboard size={17}/>, label: 'Dashboard' },
  { to: '/admin/applications', icon: <FileCheck size={17}/>,       label: 'Applications' },
  { to: '/admin/providers',    icon: <Doc size={17}/>,             label: 'Providers' },
  { to: '/admin/centers',      icon: <Building2 size={17}/>,       label: 'Centers' },
  { to: '/admin/patients',     icon: <Users size={17}/>,           label: 'Patients' },
];

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const doLogout = () => { logout(); navigate('/login'); };

  return (
    <div className={s.wrap}>
      <aside className={s.side}>
        <div className={s.brand}>
          <Stethoscope size={18} style={{color:'var(--teal)'}}/>
          <span>Visit Admin</span>
        </div>
        <nav className={s.nav}>
          {NAV.map(n=>(
            <NavLink key={n.to} to={n.to} end={n.to==='/admin'}
              className={({isActive})=>`${s.lk} ${isActive?s.act:''}`}>
              {n.icon}{n.label}
            </NavLink>
          ))}
        </nav>
        <div className={s.bottom}>
          <div className={s.who}>
            <div className={s.av}>{(user?.firstname||'A')[0]}</div>
            <div>
              <p>{user?.firstname} {user?.lastname}</p>
              <span>Admin</span>
            </div>
          </div>
          <button className={s.out} onClick={doLogout}><LogOut size={16}/></button>
        </div>
      </aside>
      <main className={s.main}><Outlet/></main>
    </div>
  );
}
