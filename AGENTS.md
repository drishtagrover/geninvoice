# Invoice Generator — AGENTS.md

## Repo layout

```
ig-backend/    Django 6 + DRF + SimpleJWT (Python 3.13, venv/)
ig-client/     React 19 + Vite 7 + Clerk auth + Bootstrap 5 (JS/JSX, no TS)
```

No monorepo tool — each half is independent, sharing only `package-lock.json` at root (empty).

## Backend (`ig-backend/`)

- **Apps**: `users` (custom `User` model, email-based auth) and `invoices` (Invoice → Item, Address).
- **Auth**: SimpleJWT access/refresh tokens. Frontend uses custom `AuthContext` + `AuthModal` (login/register in-app, no Clerk).
- **DB**: PostgreSQL in `.env` (requires running Postgres). Local dev can swap to `sqlite3` by editing `settings.py`; `db.sqlite3` is gitignored but may linger.
- **Commands** (activate `../venv` first):
  ```powershell
  ../venv/Scripts/activate
  python manage.py runserver 8000
  python manage.py test
  python manage.py makemigrations && python manage.py migrate
  ```
- Frontend hardcodes `http://localhost:8000/api` (`src/context/AppContext.jsx:25`).
- CORS in `.env` allows `http://localhost:5173` (Vite default).

## Client (`ig-client/`)

- **Entry**: `src/main.jsx` → `App.jsx` (React Router with protected routes via AuthContext).
- **Dev**:
  ```powershell
  npm run dev       # Vite default :5173 (matches CORS)
  npm run build
  npm run lint      # ESLint (JS/JSX only)
  ```
- No test framework installed (no vitest/jest).
- PDF generation via `html2canvas` + `jsPDF` (`src/util/pdfUtils.js`).
- Auth endpoints at `src/context/AuthContext.jsx` (login/register/logout/token refresh via Django SimpleJWT). `AuthModal` in `src/components/AuthModal.jsx`.

## Quick reference

| Action | Command |
|---|---|
| Start backend | `cd ig-backend; ../venv/Scripts/activate; python manage.py migrate; python manage.py runserver 8000` |
| Start frontend | `cd ig-client; npm install; npm run dev` |
| Lint frontend | `cd ig-client; npm run lint` |
| Run backend tests | `cd ig-backend; ../venv/Scripts/activate; python manage.py test` |
| Create backend superuser | `python manage.py createsuperuser` |

## Gotchas

- No frontend CI/lint script on the backend side, and no backend lint config.
- The root `package-lock.json` is a placeholder (empty packages); real client deps are in `ig-client/`.
- Email is configured to use the console backend by default (prints to terminal). Set `EMAIL_BACKEND`, `EMAIL_HOST`, etc. in `ig-backend/.env` for real SMTP.
