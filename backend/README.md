# Backend (API)

Node.js + TypeScript + Express API for GitHub OAuth and repository connection.

## Setup

1. Copy `.env.example` to `.env` and fill in GitHub OAuth values.
2. Install deps: `npm install`
3. Generate Prisma client: `npx prisma generate`
4. Apply schema: `npx prisma db push` (or `npm run migrate` for dev migrations)
5. Run: `npm run dev`

## Endpoints

- `GET /auth/github` — start GitHub OAuth
- `GET /auth/github/callback` — OAuth callback; redirects to frontend with `#token=...`
- `GET /api/me` — current user profile (Authorization: Bearer token)
- `GET /api/github/repos` — list GitHub repos for the user
- `GET /api/repos` — list connected repos in DB
- `POST /api/repos/connect` — connect a repo `{ fullName: "owner/name" }`
