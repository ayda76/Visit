import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// On 401 — clear tokens and send to login
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  },
);

// ─── Account ─────────────────────────────────────────────────────────────────
// POST /account/Login/           { username, password } → { access, refresh }
// POST /account/SignUp/          { username, password, email, ... } → { access, refresh }
// GET  /account/ME/              → current user profile
// PATCH /account/ME/             → update profile
// POST /account/change/password/ → change password
// GET/PATCH /account/Account/{id}/ → account detail
export const authAPI = {
  login:         (data) => api.post('/account/Login/', data),
  register:      (data) => api.post('/account/SignUp/', data),
  me:            ()     => api.get('/account/ME/'),
  updateMe:      (data) => api.patch('/account/ME/', data),
  changePassword:(data) => api.post('/account/change/password/', data),
  accountDetail: (id)   => api.get(`/account/Account/${id}/`),
  accountUpdate: (id, data) => api.patch(`/account/Account/${id}/`, data),
};

// ─── Doctor App ───────────────────────────────────────────────────────────────
// GET  /doctor/Center/           → list medical centers
// GET  /doctor/Center/{id}/      → center detail
// GET  /doctor/Expertize/        → list specialties
// GET  /doctor/SubExpertize/     → list sub-specialties
// GET  /doctor/Doctor/           → list doctors
// GET  /doctor/Doctor/{id}/      → doctor detail
// GET  /doctor/Provider/         → list providers (doctors+centers acting as providers)
// GET  /doctor/Provider/{id}/    → provider detail
// GET  /doctor/Provider/{id}/slots/ → upcoming slots for provider
// GET  /doctor/ProviderReview/   → reviews
// POST /doctor/ProviderReview/   → create review
// GET  /doctor/ProviderApplication/ → applications
// PATCH /doctor/ProviderApplication/{id}/review/ → review application
export const centersAPI = {
  list:   (params) => api.get('/doctor/Center/', { params }),
  detail: (id)     => api.get(`/doctor/Center/${id}/`),
};

export const expertizeAPI = {
  list:    ()       => api.get('/doctor/Expertize/'),
  subList: (params) => api.get('/doctor/SubExpertize/', { params }),
};

export const doctorsAPI = {
  list:   (params) => api.get('/doctor/Doctor/', { params }),
  detail: (id)     => api.get(`/doctor/Doctor/${id}/`),
};

export const providersAPI = {
  list:   (params) => api.get('/doctor/Provider/', { params }),
  detail: (id)     => api.get(`/doctor/Provider/${id}/`),
  slots:  (id)     => api.get(`/doctor/Provider/${id}/slots/`),
};

export const reviewsAPI = {
  list:   (params) => api.get('/doctor/ProviderReview/', { params }),
  create: (data)   => api.post('/doctor/ProviderReview/', data),
};

// ─── Schedule App ─────────────────────────────────────────────────────────────
// GET /schedule/WorkDay/         → list work days
// GET /schedule/WorkDay/{id}/    → work day detail
// GET /schedule/WorkHour/        → list work hours (slots)
// GET /schedule/WorkHour/{id}/   → work hour detail
export const scheduleAPI = {
  workDays:       (params) => api.get('/schedule/WorkDay/', { params }),
  workDayDetail:  (id)     => api.get(`/schedule/WorkDay/${id}/`),
  workHours:      (params) => api.get('/schedule/WorkHour/', { params }),
  workHourDetail: (id)     => api.get(`/schedule/WorkHour/${id}/`),
};

// ─── Book App ─────────────────────────────────────────────────────────────────
// GET  /book/Appointment/        → list my appointments
// POST /book/Appointment/        → create appointment
// GET  /book/Appointment/{id}/   → appointment detail
// PATCH/DELETE /book/Appointment/{id}/ → update/cancel
export const appointmentsAPI = {
  list:   (params) => api.get('/book/Appointment/', { params }),
  create: (data)   => api.post('/book/Appointment/', data),
  detail: (id)     => api.get(`/book/Appointment/${id}/`),
  update: (id, data) => api.patch(`/book/Appointment/${id}/`, data),
  cancel: (id)     => api.delete(`/book/Appointment/${id}/`),
};

export default api;
