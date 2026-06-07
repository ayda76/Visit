import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DoctorsPage from './pages/DoctorsPage';
import DoctorDetailPage from './pages/DoctorDetailPage';
import CentersPage from './pages/CentersPage';
import CenterDetailPage from './pages/CenterDetailPage';
import BookingPage from './pages/BookingPage';
import DashboardPage from './pages/DashboardPage';
import AppointmentsPage from './pages/AppointmentsPage';
import ProfilePage from './pages/ProfilePage';
import NotFoundPage from './pages/NotFoundPage';
import LoadingSpinner from './components/common/LoadingSpinner';

function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <LoadingSpinner fullPage />;
  return user ? children : <Navigate to="/login" replace />;
}

function GuestRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <LoadingSpinner fullPage />;
  return !user ? children : <Navigate to="/dashboard" replace />;
}

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="doctors" element={<DoctorsPage />} />
        <Route path="doctors/:id" element={<DoctorDetailPage />} />
        <Route path="centers" element={<CentersPage />} />
        <Route path="centers/:id" element={<CenterDetailPage />} />
        <Route path="book/:doctorId" element={
          <PrivateRoute><BookingPage /></PrivateRoute>
        } />
        <Route path="dashboard" element={
          <PrivateRoute><DashboardPage /></PrivateRoute>
        } />
        <Route path="appointments" element={
          <PrivateRoute><AppointmentsPage /></PrivateRoute>
        } />
        <Route path="profile" element={
          <PrivateRoute><ProfilePage /></PrivateRoute>
        } />
        <Route path="login" element={
          <GuestRoute><LoginPage /></GuestRoute>
        } />
        <Route path="register" element={
          <GuestRoute><RegisterPage /></GuestRoute>
        } />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
