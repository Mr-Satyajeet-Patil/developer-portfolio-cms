# developer-portfolio-cms

A full-stack developer portfolio and content management system. Django REST
Framework serves the data from MySQL locally (PostgreSQL in production), while a
React single-page app renders the public site. Content is managed through the
Django admin — no code changes needed to update projects, skills, experience or
writing.

## Stack

| Layer    | Technology                                              |
| -------- | ------------------------------------------------------- |
| Backend  | Django 6.1, Django REST Framework, PostgreSQL / MySQL   |
| Frontend | React 19, Vite 8, Zod                                   |
| Content  | Django admin (sessions, CSRF)                           |
| Media    | Django media storage (profile images)                   |
| Hosting  | Render free web service + Neon free PostgreSQL          |

## Project structure

```
my-portfolio/
├── backend/
│   ├── myproject/          # Django project (settings, urls, wsgi/asgi)
│   ├── portfolio/          # Models, serializers, API views, admin, migrations
│   │   ├── fixtures/       # Initial content loaded on first deploy
│   │   └── management/     # seed_portfolio command
│   ├── requirements.txt    # Production dependencies
│   ├── requirements-dev.txt # Adds MySQL support for local development
│   └── manage.py
├── frontend/
│   ├── public/             # Static assets (favicon)
│   ├── src/
│   │   ├── api/            # Fetch client + tolerant Zod schemas
│   │   ├── components/     # Page sections and UI primitives
│   │   ├── hooks/          # Data fetching, scroll reveal, active section
│   │   ├── lib/            # Date/text formatting helpers
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── styles.css
│   ├── vite.config.js      # Dev proxy for /api, /media and /admin
│   └── package.json
├── build.sh                # Render build: frontend + collectstatic + migrate
├── render.yaml             # Single-service free deployment
├── .env.example
└── README.md
```

## Features

- **Public portfolio** — hero, about, projects, skills, experience, education,
  writing and contact, all fed by the API.
- **Projects** — featured ordering, technology filters and source/live links.
- **Skills** — grouped by category with animated proficiency bars.
- **Writing** — published blog posts open in an accessible modal reader.
- **Contact form** — validated client-side and server-side; messages are stored
  in the database and readable in the admin.
- **Graceful states** — per-section skeletons, partial-failure warnings, retry,
  empty states and reduced-motion support.
- **CMS** — create and edit every section through `/admin/`.

## Getting started

### 1. Backend

```bash
cd backend

# Windows
python -m venv venv
venv\Scripts\activate

# macOS / Linux
python3 -m venv venv
source venv/bin/activate

pip install -r requirements-dev.txt
```

Create a MySQL database named in your `.env` (default `portfolio_db`), then copy
the environment template and fill in your credentials:

```bash
cp .env.example .env      # from the repository root
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

The API is served at `http://localhost:8000/api/` and the CMS at
`http://localhost:8000/admin/`.

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173`. Vite proxies `/api`, `/media` and `/admin` to
Django, so no CORS or hard-coded URLs are needed in development.

Optional environment variables (`frontend/.env.local`):

```bash
# Only needed when the API is hosted elsewhere. Leave empty for the dev proxy.
VITE_API_URL=

# Override the proxy target (defaults to http://localhost:8000)
VITE_API_PROXY=http://localhost:8000
```

### 3. Add content

Sign in at `/admin/` and add a **Profile**, then **Projects**, **Skills**,
**Experience**, **Education** and **Blog posts**. Published blog posts appear on
the site; every other item appears immediately. Upload a profile image to show
a portrait instead of the initials fallback.

## API

| Method | Endpoint             | Description                              |
| ------ | -------------------- | ---------------------------------------- |
| GET    | `/api/profile/`      | Portfolio owner profile                  |
| GET    | `/api/projects/`     | Projects (newest first)                  |
| GET    | `/api/skills/`       | Skills with category and level           |
| GET    | `/api/experience/`   | Work history                             |
| GET    | `/api/education/`    | Education history                        |
| GET    | `/api/blog/`         | Published blog posts                     |
| POST   | `/api/contact/`      | Create a contact message                 |

The public endpoints are read-only; all writes happen through the Django admin.

## Scripts

| Location   | Command           | Purpose                     |
| ---------- | ----------------- | --------------------------- |
| root       | `bash build.sh`   | Full production build       |
| `backend`  | `manage.py runserver` | Run the API and admin   |
| `backend`  | `manage.py migrate`   | Apply database migrations |
| `backend`  | `manage.py seed_portfolio` | Load bundled content if empty |
| `frontend` | `npm run dev`     | Vite dev server             |
| `frontend` | `npm run build`   | Production build to `dist/` |
| `frontend` | `npm run preview` | Preview the production build |
| `frontend` | `npm run lint`    | ESLint                      |

## Deploy for free (Render + Neon)

This repository is set up to run as **one free Render web service** plus a
**free Neon PostgreSQL database**. Django serves the React build, the API, the
admin and media from the same origin, so there is no CORS configuration, no
second frontend host and no Docker image to maintain.

Why this combination:

- Render's free web service needs no credit card and includes 750 instance hours
  per month. It sleeps after 15 minutes without traffic and wakes in about a
  minute.
- Render's free PostgreSQL **expires after 30 days**, so the database lives at
  Neon instead. Neon's free plan is permanent, needs no credit card, and keeps
  1 GB of data.
- PythonAnywhere's free plan no longer includes MySQL for new accounts and its
  free web apps expire monthly. Koyeb closed its free plan to new users in 2026.

### 0. Before you start

You need free accounts on [GitHub](https://github.com), [Render](https://render.com)
and [Neon](https://neon.com). No payment method is required for any of them.

### 1. Push the project to GitHub

The deployment needs `backend/` and `frontend/` in the **same branch**. In this
checkout that branch is `backend` (the `frontend` branch has an older backend).
Commit and push it from the repository root:

```bash
git add .
git commit -m "Prepare portfolio for deployment"
git push origin backend
```

If you prefer to deploy from `main`, merge `backend` into `main` first and push
`main` instead.

Make sure `frontend/package-lock.json` and
`backend/media/profile/photo.jpg.jpeg` are part of the commit. Never commit
`.env`; production secrets are set in the Render dashboard.

### 2. Create the free database (Neon)

1. Sign in at [neon.com](https://neon.com) and create a project.
2. Pick a region close to you (for example `AWS ap-southeast-1` for India).
3. Open **Connect** and copy the **pooled** connection string. It looks like:

   ```text
   postgresql://user:password@ep-xxx-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require
   ```

Keep this string secret. It is the only required secret.

### 3. Deploy on Render

**Option A — Blueprint (recommended)**

1. Open [dashboard.render.com](https://dashboard.render.com) → **New +** →
   **Blueprint**.
2. Connect GitHub and select this repository. When Render asks which branch to
   link, choose `backend` (the branch that contains both `backend/` and
   `frontend/`).
3. Render reads `render.yaml`. When prompted for `DATABASE_URL`, paste the Neon
   connection string.
4. Click **Deploy Blueprint** and wait for the first build (about 3–6 minutes).

**Option B — Manual web service**

Create **New + → Web Service** from the repository, select the `backend` branch,
and use:

| Setting        | Value                                                                 |
| -------------- | --------------------------------------------------------------------- |
| Language       | Python 3                                                              |
| Build command  | `bash build.sh`                                                       |
| Start command  | `gunicorn --chdir backend myproject.wsgi:application --bind 0.0.0.0:$PORT --workers 2 --timeout 60` |
| Instance type  | Free                                                                  |

Add these environment variables:

| Key                  | Value                                    |
| -------------------- | ---------------------------------------- |
| `DJANGO_SECRET_KEY`  | a long random string (Render can generate it) |
| `DATABASE_URL`       | the Neon connection string               |
| `DEBUG`              | `False`                                  |
| `ALLOWED_HOSTS`      | `.onrender.com`                          |

The build runs `build.sh`, which installs dependencies, builds the React app,
collects static files, applies migrations and loads the bundled portfolio
content **only if the database is empty**. The bundled fixture
(`backend/portfolio/fixtures/portfolio.json`) contains your current profile,
project, skills, experience, education and blog post, so the Neon database
starts with your content. Your site is then live at
`https://<service-name>.onrender.com`.

### 4. Create the admin user

Render's free instances do not include Shell access, so create the superuser from
your computer against the same Neon database:

```powershell
cd backend
$env:DATABASE_URL="postgresql://..."
.\venv\Scripts\python.exe manage.py createsuperuser
```

On macOS/Linux:

```bash
cd backend
DATABASE_URL="postgresql://..." .venv/bin/python manage.py createsuperuser
```

Sign in at `https://<service-name>.onrender.com/admin/`. Contact messages appear
there under **Contact messages**.

### 5. Optional: custom domain

1. Add the domain in Render → your service → **Settings → Custom Domains** and
   create the DNS records Render shows.
2. Add these environment variables (then save, which redeploys):

   ```text
   ALLOWED_HOSTS=.onrender.com,yourdomain.com,www.yourdomain.com
   CSRF_TRUSTED_ORIGINS=https://*.onrender.com,https://yourdomain.com,https://www.yourdomain.com
   ```

### Free-plan behaviour to expect

- **Cold starts:** after 15 minutes without visitors, Render stops the service.
  The next visit takes about a minute to load.
- **Instance hours:** 750 per month. One sleeping service fits comfortably; keep
  the total to one free web service per workspace.
- **Ephemeral disk:** the portrait committed in `backend/media/profile/` is part
  of the deployment, so it survives restarts. A photo uploaded through the admin
  is lost when the service restarts. To change it permanently, replace the file
  in the repository and redeploy (or move media to object storage).
- **Neon:** the database scales to zero after 5 minutes idle and resumes in
  milliseconds; data is not deleted. Free storage is 1 GB.
- **Do not use Render's free Postgres** for this project: it is deleted 30 days
  after creation.

If you later need always-on hosting, the cheapest upgrade is a paid Render
instance (from about $7/month). A card-backed always-free VM such as Oracle
Cloud Always Free also works, but requires more server administration.
