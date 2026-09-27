<div align="right">

# ملک‌نما ۳۶۰ — MelkNama 360

</div>

A Redfin-style, transaction-first PropTech web app for the Iranian market, built from the
business plan in this folder (`25-Business_Plan_Toolkit_Redfin_Iran_filled.pdf`).

**Next.js 15 (App Router) + FastAPI**, fully bilingual **fa/en with RTL/LTR**, light/dark
themes, responsive from 360px up, and PWA-ready.

---

## What it does

| Area | Feature |
| --- | --- |
| Search | Full-text + city / neighborhood / deal / type / beds / area / price / amenity filters, 6 sort modes, pagination |
| Map | Price-pin map panel with a card preview (no external map SDK) |
| Listing | Gallery, key facts, amenities, MelkNama Estimate vs. asking price, 12-month price history, trust / walk / transit scores, advisor card + tour request |
| Estimate | Data-driven valuation endpoint (neighborhood base price, age, parking, elevator, beds) |
| Market | Median price, avg. price per m², days on market, neighborhood ranking, 12-month trend |
| Advisors | Licensed advisor directory with rating, closed deals, active listings |
| Account | OTP-style login flow, favorites (stored per browser) |

Persian copy follows the
[Persian-vocabulary-in-UXwriting](https://github.com/Aylarrazzaghi/Persian-vocabulary-in-UXwriting)
reference (حساب کاربری، جستجو، نشانی، دیدگاه، علاقه‌مندی‌ها، رمز یک‌بار مصرف …), with Persian
digits and Persian date formatting throughout.

## Layout

```
backend/    FastAPI service (app/main.py API, app/data.py deterministic seed data)
frontend/   Next.js 15 app (app/ routes, components/, lib/)
docker-compose.yml
.env        host ports + the API base URL baked into the web build
```

## Run with Docker (one command)

```bash
docker compose up --build
```

- Web: http://localhost:3333
- API: http://localhost:8100 — interactive docs at `/docs`

Ports come from `.env` (`WEB_PORT`, `API_PORT`, `NEXT_PUBLIC_API_BASE`). They default to
3333/8100 because 3000/8000 were already taken on this machine — change all three together
if you want the usual ports.

## Run locally (no Docker)

```bash
# API
cd backend && python3 -m venv .venv && ./.venv/bin/pip install -r requirements.txt
./.venv/bin/uvicorn app.main:app --reload --port 8100

# Web
cd frontend && npm install && npm run dev      # http://localhost:3000
```

`frontend/.env.local` holds `NEXT_PUBLIC_API_BASE`. It is inlined at **build** time, so
rebuild after changing it.

## API

| Method | Path | Purpose |
| --- | --- | --- |
| GET | `/api/health` | liveness |
| GET | `/api/meta` | cities, neighborhoods, property types, amenities, sorts |
| GET | `/api/listings` | search + filters + sort + pagination |
| GET | `/api/listings/{id}` | one listing, its advisor and similar homes |
| GET | `/api/market` | market pulse (optionally `?city=`) |
| GET | `/api/agents` | advisor directory |
| POST | `/api/estimate` | valuation for a property description |
| POST | `/api/leads` | tour / callback request |

Data is deterministic in-memory seed data (110 listings, 8 advisors, 4 cities) — swap
`app/data.py` for a real database without touching the routes.

## Handy URL flags

`?lang=en` / `?lang=fa` and `?theme=light` / `?theme=dark` override the stored preference —
useful for QA, demos and deep links.

## Next steps (planned)

1. **PWA** — service worker, offline shell, install prompt (manifest + icons already ship).
2. **Android APK / iOS IPA** — wrap the PWA with Capacitor, sharing this exact frontend.
3. Real database, auth with OTP provider, photo uploads, agent panel (پیش‌خوان مشاور).
