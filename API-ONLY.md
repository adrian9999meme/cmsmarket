# API-Only Backend

This Laravel application is configured as **backend-only**: no Blade UI, no admin/seller/frontend views. It exposes only APIs and minimal non-HTML routes.

## What is loaded

- **API routes** – `routes/api.php`, `routes/delivery-hero-api.php`, `routes/seller-api.php` (under `/api/...`)
- **Minimal web routes** – `routes/web-api-only.php`:
  - `GET /` – JSON with message, version, and links
  - `GET /health` – JSON health check

## What was removed

- All **Blade view files** under `resources/views/` (admin, frontend, install, home, etc.)
- **UI route files** – web, admin, seller, install, refund, reward, POS, chat, video-shopping, affiliate, etc. are no longer loaded
- **ViewServiceProvider** – disabled (it targeted admin Blade views)

## Errors

Exceptions are always returned as **JSON** (no HTML error pages), including validation errors (422) and server errors (500).

## Your frontend

Run your UI (Next.js, Vue, React, mobile app, etc.) separately and call this backend:

- **Base URL:** `https://your-domain.com/api` (or `http://localhost:8000/api` in dev)
- **Main API prefix:** `/api/v100/` (e.g. `/api/v100/login`, `/api/v100/configs`, `/api/v100/get-products`)
- **Auth:** JWT; send `Authorization: Bearer <token>`

Set `allowed_origins` in `config/cors.php` to your frontend origin in production if needed.

## Database

The database must already be set up (e.g. by importing a dump or running migrations). The install wizard and admin UI are not available in this API-only setup.
