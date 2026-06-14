import axios from 'axios';

const BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({ baseURL: BASE, headers: { 'Content-Type': 'application/json' } });

api.interceptors.request.use(cfg => {
  const t = localStorage.getItem('access_token');
  if (t) cfg.headers.Authorization = `Bearer ${t}`;
  return cfg;
});

api.interceptors.response.use(
  r => r,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  },
);

// ── Account ──────────────────────────────────────────────────────────────────
// POST /account/Login/          { username, password } → { access, refresh }
// POST /account/SignUp/         { username,password,email,firstname,lastname,role }
//                               role = "doctor_pending" | "center_pending" | "patient"
// GET  /account/ME/             → Account object
// PATCH /account/ME/            → update Account
// POST /account/change/password/ { old_password, new_password }
// GET  /account/Account/        → list (admin)
// GET  /account/Account/{id}/   → detail (admin)
export const authAPI = {
  login:          (d) => api.post('/account/Login/', d),
  register:       (d) => api.post('/account/SignUp/', d),
  me:             ()  => api.get('/account/ME/'),
  updateMe:       (d) => api.patch('/account/ME/', d),
  changePassword: (d) => api.post('/account/change/password/', d),
  // admin
  accountList:    (p) => api.get('/account/Account/', { params: p }),
  accountDetail:  (id)=> api.get(`/account/Account/${id}/`),
  accountUpdate:  (id,d)=> api.patch(`/account/Account/${id}/`, d),
};

// ── Providers (public list + slots) ──────────────────────────────────────────
// GET  /doctor/Provider/              → paginated list
// GET  /doctor/Provider/{id}/         → detail
// GET  /doctor/Provider/{id}/slots/?start_date=YYYY-MM-DD
//      → [ { date, weekday, slots: [{start,end,reserved}] } ]
export const providersAPI = {
  list:   (p)  => api.get('/doctor/Provider/', { params: p }),
  detail: (id) => api.get(`/doctor/Provider/${id}/`),
  // pass start_date=YYYY-MM-DD; returns 7 days
  slots:  (id, startDate) => api.get(`/doctor/Provider/${id}/slots/`, {
    params: startDate ? { start_date: startDate } : {},
  }),
};

// ── Centers ───────────────────────────────────────────────────────────────────
// GET/POST /doctor/Center/
// GET/PATCH/DELETE /doctor/Center/{id}/
export const centersAPI = {
  list:   (p)    => api.get('/doctor/Center/', { params: p }),
  detail: (id)   => api.get(`/doctor/Center/${id}/`),
  create: (d)    => api.post('/doctor/Center/', d),
  update: (id,d) => api.patch(`/doctor/Center/${id}/`, d),
};

// ── Expertize / SubExpertize ─────────────────────────────────────────────────
export const expertizeAPI = {
  list:    ()  => api.get('/doctor/Expertize/'),
  subList: (p) => api.get('/doctor/SubExpertize/', { params: p }),
};

// ── Doctors (admin) ───────────────────────────────────────────────────────────
export const doctorsAPI = {
  list:   (p)    => api.get('/doctor/Doctor/', { params: p }),
  detail: (id)   => api.get(`/doctor/Doctor/${id}/`),
  create: (d)    => api.post('/doctor/Doctor/', d),
  update: (id,d) => api.patch(`/doctor/Doctor/${id}/`, d),
};

// ── Provider Applications ─────────────────────────────────────────────────────
// POST /doctor/ProviderApplication/    { role_requested, documents }
//      auto-assigns account_related from JWT
// GET  /doctor/ProviderApplication/    → list (admin sees all, user sees own)
// POST /doctor/ProviderApplication/{id}/review/  { decision: "approve"|"reject" }
export const applicationsAPI = {
  create: (d)         => api.post('/doctor/ProviderApplication/', d),
  list:   (p)         => api.get('/doctor/ProviderApplication/', { params: p }),
  detail: (id)        => api.get(`/doctor/ProviderApplication/${id}/`),
  review: (id, d)     => api.post(`/doctor/ProviderApplication/${id}/review/`, d),
};

// ── Reviews ───────────────────────────────────────────────────────────────────
// POST /doctor/ProviderReview/   { provider_related, rating, comment }
//      auto-assigns patient_related from JWT
// GET  /doctor/ProviderReview/?provider_related=ID
export const reviewsAPI = {
  list:   (p) => api.get('/doctor/ProviderReview/', { params: p }),
  create: (d) => api.post('/doctor/ProviderReview/', d),
};

// ── Schedule (WorkDay / WorkHour) — provider only ─────────────────────────────
// WorkDay fields: day(0-6), provider_related, duration_min, is_active
// WorkHour fields: workday_related, start_time(HH:MM:SS), end_time(HH:MM:SS)
export const scheduleAPI = {
  workDays:         (p)    => api.get('/schedule/WorkDay/', { params: p }),
  createWorkDay:    (d)    => api.post('/schedule/WorkDay/', d),
  updateWorkDay:    (id,d) => api.patch(`/schedule/WorkDay/${id}/`, d),
  deleteWorkDay:    (id)   => api.delete(`/schedule/WorkDay/${id}/`),
  workHours:        (p)    => api.get('/schedule/WorkHour/', { params: p }),
  createWorkHour:   (d)    => api.post('/schedule/WorkHour/', d),
  updateWorkHour:   (id,d) => api.patch(`/schedule/WorkHour/${id}/`, d),
  deleteWorkHour:   (id)   => api.delete(`/schedule/WorkHour/${id}/`),
};

// ── Appointments ──────────────────────────────────────────────────────────────
// POST /book/Appointment/
//   { provider_related, date, start_time, end_time, weekday }
// GET  /book/Appointment/  → patient sees own; provider sees own
// PATCH /book/Appointment/{id}/  { is_canceled: true }
export const appointmentsAPI = {
  list:   (p)    => api.get('/book/Appointment/', { params: p }),
  create: (d)    => api.post('/book/Appointment/', d),
  detail: (id)   => api.get(`/book/Appointment/${id}/`),
  update: (id,d) => api.patch(`/book/Appointment/${id}/`, d),
  cancel: (id)   => api.patch(`/book/Appointment/${id}/`, { is_canceled: true }),
};

export default api;
