import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Layout from './components/layout/Layout';
import AdminLayout from './components/layout/AdminLayout';
import Spinner from './components/common/Spinner';

// Public / Patient
import HomePage       from './pages/HomePage';
import LoginPage      from './pages/LoginPage';
import RegisterPage   from './pages/RegisterPage';
import ProviderSignup from './pages/ProviderSignupPage';
import ProvidersPage  from './pages/ProvidersPage';
import ProviderPage   from './pages/ProviderPage';
import BookPage       from './pages/BookPage';
import MyAppointments from './pages/MyAppointments';
import ProfilePage    from './pages/ProfilePage';
import PendingPage    from './pages/PendingPage';

// Provider
import ProviderDashboard   from './pages/provider/ProviderDashboard';
import ProviderSchedule    from './pages/provider/ProviderSchedule';
import ProviderAppointments from './pages/provider/ProviderAppointments';

// Admin
import AdminDashboard    from './pages/admin/AdminDashboard';
import AdminApplications from './pages/admin/AdminApplications';
import AdminProviders    from './pages/admin/AdminProviders';
import AdminPatients     from './pages/admin/AdminPatients';
import AdminCenters      from './pages/admin/AdminCenters';

import NotFound from './pages/NotFound';

function Spin() { return <Spinner full />; }

function Guard({ children, allow, fallback = '/' }) {
  const { user, loading } = useAuth();
  if (loading) return <Spin />;
  if (!user)   return <Navigate to="/login" replace />;
  if (!allow(user)) return <Navigate to={fallback} replace />;
  return children;
}

export default function App() {
  return (
    <Routes>

      {/* ── Main layout ── */}
      <Route element={<Layout />}>
        <Route index              element={<HomePage />} />
        <Route path="providers"   element={<ProvidersPage />} />
        <Route path="providers/:id" element={<ProviderPage />} />
        <Route path="login"       element={<LoginPage />} />
        <Route path="register"    element={<RegisterPage />} />
        <Route path="provider-signup" element={<ProviderSignup />} />

        {/* Pending — show status page */}
        <Route path="pending" element={
          <Guard allow={u => ['doctor_pending','center_pending'].includes(u.role)} fallback="/">
            <PendingPage />
          </Guard>
        } />

        {/* Patient routes */}
        <Route path="book/:providerId" element={
          <Guard allow={u => u.role === 'patient'} fallback="/login">
            <BookPage />
          </Guard>
        } />
        <Route path="appointments" element={
          <Guard allow={u => u.role === 'patient'} fallback="/login">
            <MyAppointments />
          </Guard>
        } />
        <Route path="profile" element={
          <Guard allow={u => !!u} fallback="/login">
            <ProfilePage />
          </Guard>
        } />

        {/* Provider routes */}
        <Route path="provider/dashboard" element={
          <Guard allow={u => ['doctor','center_manager'].includes(u.role)} fallback="/">
            <ProviderDashboard />
          </Guard>
        } />
        <Route path="provider/schedule" element={
          <Guard allow={u => ['doctor','center_manager'].includes(u.role)} fallback="/">
            <ProviderSchedule />
          </Guard>
        } />
        <Route path="provider/appointments" element={
          <Guard allow={u => ['doctor','center_manager'].includes(u.role)} fallback="/">
            <ProviderAppointments />
          </Guard>
        } />
      </Route>

      {/* ── Admin layout ── */}
      <Route element={
        <Guard allow={u => u.role === 'admin'} fallback="/login">
          <AdminLayout />
        </Guard>
      }>
        <Route path="admin"              element={<AdminDashboard />} />
        <Route path="admin/applications" element={<AdminApplications />} />
        <Route path="admin/providers"    element={<AdminProviders />} />
        <Route path="admin/patients"     element={<AdminPatients />} />
        <Route path="admin/centers"      element={<AdminCenters />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
