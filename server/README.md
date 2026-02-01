# Modern Banking API (Express + Supabase)

A lightweight Express + TypeScript backend scaffold that uses Supabase (Postgres + auth) via a thin service layer.

## Getting Started

1. Install dependencies:
   ```bash
   cd server
   npm install
   ```
2. Copy env template and fill values:
   ```bash
   cp .env.example .env
   # set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY
   ```
3. Run in dev mode:
   ```bash
   npm run dev
   ```
   The API defaults to http://localhost:4000.

## API Surface (scaffold)

- `GET /healthz` – basic liveness.
- `GET /api/accounts` – placeholder wired to Supabase `accounts` table (expects columns: id, name, balance, currency, created_at).

## Structure

- `src/config/env.ts` – loads and validates environment variables.
- `src/services/supabaseClient.ts` – Supabase client configured with service role key.
- `src/services/accountService.ts` – example service calling Supabase.
- `src/routes` – Express routes.
- `src/server.ts` – app factory with middleware and error handling.
- `src/index.ts` – starts the HTTP server.

## Notes

- Supabase keys are required; `SUPABASE_SERVICE_ROLE_KEY` is needed for server-side operations. Keep it secret.
- Extend `services/` and `routes/` to add auth, transfers, transactions, and notifications. Consider adding OpenAPI and integration tests as you build out features.
