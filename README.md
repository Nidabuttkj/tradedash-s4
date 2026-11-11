# TradesDash: S4 (Website Front Door)

Group 3, Platform and Public Site. S4 owns the **Homepage** (`/`) and **Pricing** (`/pricing`),
plus two backend routes. The look copies the Super Admin screens (navy sidebar, orange accent, Inter font).

## Folders

```
web/      React + Tailwind frontend (http://localhost:5173)
server/   Node + Express backend    (http://localhost:5000)
```

## Run it (Windows: use npm.cmd if PowerShell blocks npm)

**One time:** install everything.
```
cd web
npm.cmd install
cd ../server
npm.cmd install
cd ..
```

**Every time:** open TWO terminals in VS Code.
```
# terminal 1
cd server
npm.cmd run dev

# terminal 2
cd web
npm.cmd run dev
```
Then open http://localhost:5173

Optional, one command for both (after `npm.cmd install` in the main folder too):
```
npm.cmd run dev
```

Frontend only also works: Pricing shows its built-in plans and the free-trial form shows a "start the backend" message.

## What works

| Page / route | What it does |
|---|---|
| `/` Homepage | Stat cards, feature table with tabs, how it works, testimonials, Start Free Trial |
| `/pricing` Pricing | Plan cards from the API, monthly/yearly switch, compare table, FAQ |
| `/dashboard` | Temporary page where the trial form lands (Group 1 builds the real one) |
| `GET /api/public/plans` | Starter £19, Pro £49 (from MongoDB, or memory if no database) |
| `POST /api/public/trial-signup` | Checks the form, saves a tenant, returns `{ tenant, redirectTo }` |
| `GET /api/health` | `{ ok: true }` |

Test the backend rules: `cd server && npm.cmd test` (works without MongoDB)

## Code map

```
web/src/layouts/AppLayout.jsx   always-visible sidebar + header + trial popup
web/src/components/ui.jsx       StatCard, Panel, Table, Badge, Button
web/src/components/TrialModal.jsx  free-trial form -> POST /api/public/trial-signup
web/src/pages/Home.jsx, Pricing.jsx, Dashboard.jsx
web/src/data/                   fallback plans and page text
server/app.js                   express app (cors, json, error handling)
server/routes/public.js         the two public routes
server/lib/validate.js          form checks (tested by validate.test.js)
server/db.js                    connects to MongoDB (collections: plans, tenants)
server/store.js                 reads/writes data (MongoDB, or memory when no MONGODB_URI)
server/data/plans.js            starting plans, added to MongoDB the first time
```

## MongoDB (Atlas)

1. Make a free cluster on MongoDB Atlas and copy its connection string.
2. In `server/`, copy `.env.example` to `.env` and paste the string as `MONGODB_URI` (with your real password).
3. In Atlas -> Network Access, allow your IP address (or 0.0.0.0/0 for the project).
4. Run `npm.cmd run dev` in `server`. You should see `MongoDB connected.`

Collections: `plans` (starting plans are added automatically) and `tenants` (one per free-trial signup).
Without `MONGODB_URI` the server still runs, using memory.

## Deploy on Render (Weeks 7-8)

Needs: the code on GitHub, a MongoDB Atlas cluster, a free Render account.

1. **Atlas:** Network Access -> allow `0.0.0.0/0` (Render's IP changes). Copy the connection string.
2. **Render:** New -> Blueprint -> choose the GitHub repo (it reads `render.yaml`). Two services appear:
   `tradesdash-api` (backend) and `tradesdash-web` (website).
3. When asked, fill the secret values:
   - `tradesdash-api` -> `MONGODB_URI` = your Atlas string
   - `tradesdash-api` -> `CLIENT_ORIGIN` = the website address, e.g. `https://tradesdash-web.onrender.com`
   - `tradesdash-web` -> `VITE_API_URL` = the API address, e.g. `https://tradesdash-api.onrender.com`
4. After the first deploy, if the two addresses were different from what you typed, fix the values and press **Manual Deploy** on both.
5. Open the website. Pricing should load plans, and Start Free Trial should save a tenant.

Notes: the free Render API sleeps after 15 minutes without visitors, so the first request can take about a minute.
`VITE_API_URL` is read when the website is built, so after changing it, deploy the website again.
Group repo layout different? Change the two `rootDir` lines in `render.yaml`.

## 8-week plan for S4

| Weeks | S4 work |
|---|---|
| 1-2 | Homepage + Pricing with dummy data. Done. |
| 3-4 | Express routes with in-memory data, React calls the API. Done. |
| 5-6 | MongoDB: `plans` and `tenants` collections (done, match S1/S2 field names); call S3's `logAudit()`. |
| 7-8 | Deploy on Render (backend + static frontend), fix online bugs, final demo. |

## Waiting on teammates

- S1: `tenants` schema (add S1's fields in `server/db.js`).
- S2: `plans` collection (keep field names in `server/db.js` in sync with S2).
- S3: `logAudit()` helper (see the TODO in `server/routes/public.js`).
- S5: shared theme and components (swap into `tailwind.config.js` and `web/src/components/ui.jsx`).
- Group 1: real Dashboard (delete `web/src/pages/Dashboard.jsx` and its route).
