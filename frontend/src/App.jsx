import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Layout from './components/layout/Layout';
import Spinner from './components/common/Spinner';

import HomePage        from './pages/HomePage';
import LoginPage       from './pages/LoginPage';
import RegisterPage    from './pages/RegisterPage';
import ProvidersPage   from './pages/ProvidersPage';
import ProviderPage    from './pages/ProviderPage';
import BookPage        from './pages/BookPage';
import MyAppointments  from './pages/MyAppointments';
import ProfilePage     from './pages/ProfilePage';
import NotFound        from './pages/NotFound';

function Private({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <Spinner full />;
  return user ? children : <Navigate to="/login" replace />;
}

function Guest({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <Spinner full />;
  return !user ? children : <Navigate to="/" replace />;
}

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index              element={<HomePage />} />
        <Route path="providers"   element={<ProvidersPage />} />
        <Route path="providers/:id" element={<ProviderPage />} />
        <Route path="book/:providerId" element={<Private><BookPage /></Private>} />
        <Route path="appointments" element={<Private><MyAppointments /></Private>} />
        <Route path="profile"      element={<Private><ProfilePage /></Private>} />
        <Route path="login"        element={<Guest><LoginPage /></Guest>} />
        <Route path="register"     element={<Guest><RegisterPage /></Guest>} />
        <Route path="*"            element={<NotFound />} />
      </Route>
    </Routes>
  );
}
