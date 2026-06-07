# Visit — Frontend

React + Vite frontend for the **Visit** medical appointment booking platform.

## Tech Stack

| Tool | Purpose |
|------|---------|
| React 18 | UI framework |
| Vite 5 | Build tool / dev server |
| React Router v6 | Client-side routing |
| React Query | Server state & caching |
| Axios | HTTP client with JWT interceptors |
| React Hot Toast | Notifications |
| CSS Modules | Scoped styling |
| date-fns | Date utilities |

## Project Structure

```
src/
├── api/            # All backend API calls (auth, doctors, appointments…)
├── components/
│   ├── common/     # Button, LoadingSpinner, NotificationBell
│   ├── doctors/    # DoctorCard
│   └── layout/     # Navbar, Footer, Layout
├── context/        # AuthContext (JWT auth + user state)
├── pages/          # One file per route
├── styles/         # global.css (CSS variables, resets)
└── main.jsx        # App entry point
```

## Pages & Routes

| Route | Page | Auth |
|-------|------|------|
| `/` | Home — hero, specialties, top doctors | Public |
| `/doctors` | Doctor listing with search & filters | Public |
| `/doctors/:id` | Doctor profile + reviews | Public |
| `/centers` | Medical center listing | Public |
| `/centers/:id` | Center detail + doctors | Public |
| `/book/:doctorId` | Date/time slot picker + confirm | **Required** |
| `/dashboard` | User overview + upcoming appointments | **Required** |
| `/appointments` | All appointments (upcoming / history) | **Required** |
| `/profile` | Edit profile + change password | **Required** |
| `/login` | Sign in | Guest only |
| `/register` | Create account | Guest only |

## API Coverage

All calls go through `src/api/index.js`:

- **Auth** — login, refresh, register, profile, update profile, change password  
- **Doctors** — list, detail, specialties, available slots, search, top-rated  
- **Medical Centers** — list, detail, search, center doctors  
- **Appointments** — list, create, detail, cancel, reschedule, upcoming, history  
- **Reviews** — list for doctor, create, my reviews  
- **Notifications** — list, mark read, mark all read, unread count  

JWT tokens are stored in `localStorage`. The Axios interceptor auto-refreshes the access token on 401 responses.

---

## Local Development

```bash
# 1. Install dependencies
npm install

# 2. Create .env
cp .env.example .env
# Edit VITE_API_URL to point at your Django backend

# 3. Start dev server
npm run dev
# → http://localhost:3000
```

The Vite dev server proxies `/api/*` to the backend automatically.

---

## Docker

### Build & run standalone

```bash
docker build \
  --build-arg VITE_API_URL=http://localhost:8000 \
  -t visit-frontend .

docker run -p 80:80 visit-frontend
```

### With docker-compose (add to the repo's docker-compose.yml)

```yaml
visit_frontend:
  container_name: visit_frontend
  build:
    context: ./frontend
    args:
      VITE_API_URL: http://visit_backend:8000
  ports:
    - "3000:80"
  depends_on:
    - visit_backend
```

Nginx inside the container:
- Serves the built React SPA on port 80  
- Proxies `/api/*` → `visit_backend:8000` (Django)  
- Handles SPA routing (`try_files … /index.html`)  
- Caches static assets for 1 year  

---

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `VITE_API_URL` | `http://localhost:8000` | Django backend base URL |

> **Note:** Vite embeds env vars at build time. If you change `VITE_API_URL`, rebuild the image.
