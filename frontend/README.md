# Frontend (Next.js)

- `npm run dev` — start dev server
- Set `NEXT_PUBLIC_API_BASE_URL` in `.env` to backend URL.
- Pages:
  - `/` — Sign in with GitHub
  - `/auth/callback` — stores JWT token
  - `/dashboard` — user + connected repos
  - `/repositories` — list GitHub repos, connect