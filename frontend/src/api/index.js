import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// ─── Request interceptor: attach JWT ────────────────────────────────────────
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ─── Response interceptor: auto-refresh token ───────────────────────────────
api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const original = err.config;
    if (err.response?.status === 401 && !original._retry) {
      original._retry = true;
      const refresh = localStorage.getItem('refresh_token');
      if (refresh) {
        try {
          const { data } = await axios.post(`${BASE_URL}/api/token/refresh/`, { refresh });
          localStorage.setItem('access_token', data.access);
          original.headers.Authorization = `Bearer ${data.access}`;
          return api(original);
        } catch {
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(err);
  },
);

// ─── Auth ────────────────────────────────────────────────────────────────────
export const authAPI = {
  login:        (data) => api.post('/api/token/', data),
  refresh:      (data) => api.post('/api/token/refresh/', data),
  register:     (data) => api.post('/api/accounts/register/', data),
  profile:      ()     => api.get('/api/accounts/profile/'),
  updateProfile:(data) => api.patch('/api/accounts/profile/', data),
  changePassword:(data)=> api.post('/api/accounts/change-password/', data),
};

// ─── Doctors ────────────────────────────────────────────────────────────────
export const doctorsAPI = {
  list:         (params) => api.get('/api/doctors/', { params }),
  detail:       (id)     => api.get(`/api/doctors/${id}/`),
  specialties:  ()       => api.get('/api/doctors/specialties/'),
  available:    (id, params) => api.get(`/api/doctors/${id}/available-slots/`, { params }),
  search:       (params) => api.get('/api/doctors/search/', { params }),
  topRated:     ()       => api.get('/api/doctors/top-rated/'),
};

// ─── Medical Centers ────────────────────────────────────────────────────────
export const centersAPI = {
  list:         (params) => api.get('/api/medical-centers/', { params }),
  detail:       (id)     => api.get(`/api/medical-centers/${id}/`),
  search:       (params) => api.get('/api/medical-centers/search/', { params }),
  doctors:      (id)     => api.get(`/api/medical-centers/${id}/doctors/`),
};

// ─── Appointments ───────────────────────────────────────────────────────────
export const appointmentsAPI = {
  list:         (params) => api.get('/api/appointments/', { params }),
  create:       (data)   => api.post('/api/appointments/', data),
  detail:       (id)     => api.get(`/api/appointments/${id}/`),
  cancel:       (id)     => api.patch(`/api/appointments/${id}/cancel/`),
  reschedule:   (id, data) => api.patch(`/api/appointments/${id}/reschedule/`, data),
  upcoming:     ()       => api.get('/api/appointments/upcoming/'),
  history:      ()       => api.get('/api/appointments/history/'),
  confirm:      (id)     => api.patch(`/api/appointments/${id}/confirm/`),   // doctor side
  reject:       (id)     => api.patch(`/api/appointments/${id}/reject/`),    // doctor side
};

// ─── Reviews ────────────────────────────────────────────────────────────────
export const reviewsAPI = {
  forDoctor:    (doctorId) => api.get(`/api/reviews/`, { params: { doctor: doctorId } }),
  create:       (data)     => api.post('/api/reviews/', data),
  myReviews:    ()         => api.get('/api/reviews/my/'),
};

// ─── Notifications ──────────────────────────────────────────────────────────
export const notificationsAPI = {
  list:         ()     => api.get('/api/notifications/'),
  markRead:     (id)   => api.patch(`/api/notifications/${id}/read/`),
  markAllRead:  ()     => api.post('/api/notifications/mark-all-read/'),
  unreadCount:  ()     => api.get('/api/notifications/unread-count/'),
};

export default api;
