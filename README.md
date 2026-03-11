# Distributed CI Intelligence & Code Review Platform

Phase 1 — Auth + Repo Management

This monorepo contains a Next.js frontend and a Node/Express API with Prisma + PostgreSQL. It implements GitHub OAuth login, user persistence, listing GitHub repos, connecting repositories, and listing connected repositories.

## Structure

- `frontend/` — Next.js app (App Router)
- `backend/` — Express API (TypeScript), Prisma schema
- `docker-compose.yml` — Postgres, Adminer, API, Web (dev setup)

## Quickstart (local)

1. Create OAuth app at GitHub:
   - Homepage URL: `http://localhost:3000`
   - Authorization callback: `http://localhost:4000/auth/github/callback`
2. Backend env: copy `backend/.env.example` to `backend/.env` and set values.
3. Frontend env: copy `frontend/.env.example` to `frontend/.env`.
4. Install deps:
   - `npm --workspace backend install`
   - `npm --workspace frontend install`
5. Set up DB schema:
   - `npm --workspace backend run generate`
   - `npm --workspace backend run db:push`
6. Run dev servers:
   - `npm --workspace backend run dev`
   - `npm --workspace frontend run dev`
7. Visit `http://localhost:3000` and “Sign in with GitHub”.

## API (Phase 1)

- `GET /auth/github` → start OAuth
- `GET /auth/github/callback` → redirects to `http://localhost:3000/auth/callback#token=...`
- `GET /api/me` → current user (Bearer token)
- `GET /api/github/repos` → GitHub repos for user
- `GET /api/repos` → connected repos
- `POST /api/repos/connect` → `{ fullName: "owner/repo" }`

## Notes

- Auth tokens are JWTs stored in `localStorage` for dev simplicity. For production, switch to HttpOnly cookies on the same domain or a session store.
- The OAuth access token is stored in DB (plain) for Phase 1. For production, encrypt at rest.
- Pagination for GitHub repos is simplified to first page; extend as needed.

## Next Phases

- Webhooks ingestion service
- Async workers + queue
- Analysis service (Python + FastAPI)
- Risk scoring engine, dashboards
- AWS-ready deployment & IaC