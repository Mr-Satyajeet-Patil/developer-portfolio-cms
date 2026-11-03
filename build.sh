#!/usr/bin/env bash
# Build script used by Render (and any other host that runs the app from source).
set -o errexit

python -m pip install -r backend/requirements.txt

# Build the React app into frontend/dist. Django serves that folder through
# WhiteNoise, so the whole portfolio runs as a single service on one origin.
npm ci --prefix frontend --include=dev --include=optional
npm run build --prefix frontend

python backend/manage.py collectstatic --noinput
python backend/manage.py migrate --noinput
python backend/manage.py seed_portfolio
