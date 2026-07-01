# Global Health Observatory — Pitch

## The problem

Public health data — life expectancy, child mortality, maternal health — is
published by organizations like the WHO, but it's locked inside raw API
responses and spreadsheets. A student, researcher, or health worker who
wants to answer a simple question like *"how has under-5 mortality changed
in Kenya over the last five years?"* has to know how to query an API,
parse JSON, and build their own chart before they can answer it.

## The solution

**Global Health Observatory** is a dashboard that turns that question into
three clicks: pick a country, pick an indicator, see the trend. No API
knowledge required, no spreadsheets, no SQL.

It started as a Phase 1 project that pulled live data from the WHO Global
Health Observatory API. In Phase 2 we rebuilt it into a real full-stack
application: a Flask + PostgreSQL backend that owns its own data, and an
admin workflow so the dataset can be curated and grown over time — not
just mirrored from a third party. As of this build, the app runs entirely
on our own data. No external API calls happen at runtime.

## What it does

- **Dashboard** — pick a country, see a live grid of stat cards (life
  expectancy, mortality rates, and more) for the most recent year on record.
- **Trends** — pick a country and an indicator, see how it's changed over
  time on a line chart, with an auto-generated insight sentence
  ("Life Expectancy at Birth in Kenya increased from 65.0 (2016) to 66.7
  (2021)").
- **Compare** — put 2–4 countries side by side on the same indicator.
- **Favorites** — bookmark a country with a note, and jump straight back
  into its Trends view later.
- **Admin** — a gated section where an administrator curates the dataset
  the whole app runs on: add/remove countries, define which indicators are
  tracked, and enter the underlying data points; a read-only view of
  registered users rounds it out.

## Why it's more than "a WHO API wrapper"

Most Phase 1 dashboards in this space stop at fetching and displaying a
public API. We went further:

- **Our own database, our own schema.** Countries, indicators, and their
  data points live in PostgreSQL with proper relationships and migrations
  — not fetched fresh on every page load.
- **Admin-curated, not API-curated.** What the app shows is a deliberate
  editorial choice made through an admin UI, not whatever a third party's
  catalog happens to contain.
- **Resilient by design.** Because there's no runtime dependency on an
  external API, the app doesn't go down, rate-limit, or slow down when
  someone else's service does.
- **Built for what's next.** The schema and auth model were designed so
  Phase 3 (full user accounts, per-user favorites, richer roles) is an
  extension of what exists today, not a rewrite.

## Tech stack

| Layer | Choice |
| --- | --- |
| Frontend | React 19, React Router, Recharts, Axios |
| Backend | Flask, SQLAlchemy, Flask-Migrate, Flask-CORS |
| Database | PostgreSQL |
| Auth | Lightweight signed-token admin gate (`itsdangerous` + `werkzeug` password hashing) |

## Architecture at a glance

```
React (Vite)  →  Axios  →  Flask REST API  →  SQLAlchemy  →  PostgreSQL
   │                            │
   └── localStorage token ──────┘  (admin-only writes)
```

Every write to Countries, Indicators, or Data Points requires an admin
token; every read (Dashboard, Trends, Compare, Favorites) is open, because
the point of the app is to make this data easy to explore.

## The team

| Member | Focus |
| --- | --- |
| Collins Kiptoo (Lead) | Architecture, backend, database, integration |
| Shawn Ochieng | Backend API |
| Wasaa Abdalla | Frontend integration |
| Samuel Wanjau | Frontend features, CRUD UI |
| Rhoda Kinoti | UI/UX, design system, documentation |

## What's next (Phase 3)

- Full user accounts — not just an admin login, but registered users who
  can save their own private favorites instead of a shared list.
- Expand the curated dataset beyond the current 6 countries / 11
  indicators as admin usage grows.
- Role-based permissions beyond a single admin flag.
