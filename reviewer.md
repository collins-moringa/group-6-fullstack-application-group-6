# Phase 2 — Review Notes

## What We Built

Full-stack Global Health Dashboard: React + Vite frontend, Flask + PostgreSQL backend.
The backend serves our own Countries and Favorites resources, and proxies WHO GHO API
requests server-side to avoid browser CORS restrictions.

---

## Changes Made This Session

### 1. Installed `axios` in the frontend

```bash
cd frontend && npm install axios
```

`axios` was imported in `src/services/gho.js` but not listed in `package.json`.

---

### 2. Restored `getIndicatorData` in `gho.js`

The function had been commented out, causing a `SyntaxError` in `Trends.jsx` on import.
Added it back pointing at the WHO GHO API (later moved to the backend proxy — see #7).

---

### 3. Fixed blueprint URL prefixes (`app/__init__.py`)

Both blueprints were registered without a prefix, so every route resolved to `/` and clashed.

```python
# Before
app.register_blueprint(country_bp)
app.register_blueprint(favorite_bp)

# After
app.register_blueprint(country_bp, url_prefix="/countries")
app.register_blueprint(favorite_bp, url_prefix="/favorites")
```

---

### 4. Removed `db.create_all()` from `create_app`

`db.create_all()` was running inside `create_app`, which bypasses Flask-Migrate and means
schema changes are never tracked. Removed it and moved model imports to the top of
`create_app` so `flask db migrate` can auto-detect them.

```python
# Import models so Flask-Migrate can detect them for `flask db migrate`
from app.models.country import Country  # noqa: F401
from app.models.favorite import Favorite  # noqa: F401
```

---

### 5. Added `PUT /favorites/<id>` endpoint (`favorite_routes.py`)

The endpoint was missing. The frontend's `gho.js` called `PUT /favorites/:id` but got 405.
Added full validation: checks the favorite exists, validates `country_id` if provided.

```python
@favorite_bp.route("/<int:id>", methods=["PUT"])
def update_favorite(id):
    ...
```

---

### 6. Added `Code` and `Title` aliases to `Country.to_dict()`

The frontend was built against the WHO GHO API which returns `{ Code, Title }`.
The backend model returns `{ id, name, iso_code }`. Added aliases so both old and new
frontend code works without a rewrite.

```python
def to_dict(self):
    return {
        "id": self.id,
        "name": self.name,
        "iso_code": self.iso_code,
        "Code": self.iso_code,
        "Title": self.name
    }
```

---

### 7. Added WHO GHO proxy route (`who_routes.py`)

The browser blocks direct calls to `https://ghoapi.azureedge.net` (no CORS headers).
Added a Flask proxy so the frontend calls our backend, which fetches from WHO server-side.

```
GET /who-data/<indicator_code>?country=KEN
```

Flask fetches from `https://ghoapi.azureedge.net/api/<code>?$filter=SpatialDim eq 'KEN'`
and returns the `value` array. Registered under `url_prefix="/who-data"` in `create_app`.

Updated `getIndicatorData` in `gho.js`:

```js
export async function getIndicatorData(code, countryCode) {
  const params = countryCode ? { country: countryCode } : {};
  const res = await api.get(`/who-data/${code}`, { params });
  return res.data;
}
```

---

### 8. Fixed Flask port conflict (5000 → 5001)

macOS AirPlay Receiver occupies port 5000. Updated `run.py`:

```python
app.run(debug=True, port=5001)
```

Updated `BASE_URL` in `gho.js`:

```js
const BASE_URL = "http://localhost:5001";
```

---

### 9. Disabled strict slash redirects

Flask was redirecting `GET /countries` → `GET /countries/` (301), which Axios doesn't
follow on POST. Fixed by setting on the app:

```python
app.url_map.strict_slashes = False
```

---

### 10. Installed `requests` and added to `requirements.txt`

Required for the WHO GHO proxy route. Was missing from the venv and `requirements.txt`.

```bash
pip install requests
```

---

### 11. Ran database migrations

```bash
flask db init
flask db migrate -m "Initial models"
flask db upgrade
```

Created `countries` and `favorites` tables in the `health_dashboard` PostgreSQL database.
Deleted the stale `instance/test.db` SQLite file left over from an earlier `db.create_all()` run.

---

## Final File Summary

| File | What changed |
|---|---|
| `frontend/src/services/gho.js` | Restored `getIndicatorData`; updated `BASE_URL` to port 5001; pointed `getIndicatorData` at backend proxy |
| `frontend/package.json` / `package-lock.json` | Added `axios` |
| `backend/app/__init__.py` | Added URL prefixes, `strict_slashes=False`, removed `db.create_all()`, registered `who_bp` |
| `backend/app/models/country.py` | Added `Code` and `Title` aliases to `to_dict()` |
| `backend/app/routes/favorite_routes.py` | Added `PUT /<id>` endpoint |
| `backend/app/routes/who_routes.py` | New file — WHO GHO proxy route |
| `backend/requirements.txt` | Added `requests==2.34.2` |
| `backend/run.py` | Changed port to 5001 |
| `backend/instance/test.db` | Deleted (stale SQLite artifact) |
| `backend/migrations/` | Initialised; first migration generated and applied |

---

## API Endpoints (running on `http://localhost:5001`)

### Countries
| Method | URL | Description |
|---|---|---|
| GET | `/countries` | List all countries |
| POST | `/countries` | Create a country `{ name, iso_code }` |
| PUT | `/countries/<id>` | Update a country |
| DELETE | `/countries/<id>` | Delete a country |

### Favorites
| Method | URL | Description |
|---|---|---|
| GET | `/favorites` | List all favorites |
| POST | `/favorites` | Create a favorite `{ country_id, notes? }` |
| PUT | `/favorites/<id>` | Update a favorite |
| DELETE | `/favorites/<id>` | Delete a favorite |

### WHO GHO Proxy
| Method | URL | Description |
|---|---|---|
| GET | `/who-data/<code>?country=KEN` | Fetch indicator data from WHO GHO API |

---

## Known Remaining Items

- **Seed data** — `seed.py` not yet written; `countries` table is empty (frontend dropdowns will be empty until seeded or a country is POSTed).
- **`backend/app/views/index.py`** — empty file, safe to delete.
- **Frontend CRUD UI** — Samuel's forms for creating/editing/deleting countries and favorites are not yet built.
- **Deployment** — not yet configured.
